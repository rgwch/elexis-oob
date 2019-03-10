/****************************************
 * This file is part of elexis-oob      *
 * Copyright (c) 2019 by G. Weirich     *
 ****************************************/
const express = require("express")
const router = express.Router()
const cfg = new (require("conf"))()
const mysql = require("mysql")
const prequest = require("request-promise-native")
const encrypt = require("../utils/elxcrypt")
const uuidv4 = require("uuid/v4")
const initwlx = require("./initwlx")
const { mysqlFromUrlGzipped, mysqlFromPlain } = require("../utils/loader")

const DBHOST = process.env.DBHOST || "localhost"
const DBPORT = process.env.DBPORT || 3312
cfg.set("dbport", DBPORT)
cfg.set("dbhost", DBHOST)

let connection

/**
 * Database management routes (/db/...)
 */
router.get("/init", (req, res) => {
  res.render("init_form")
})

router.get("/restore", (req, res) => {
  res.render("restore_form")
})

router.get("/loaddata", (req, res) => {
  res.render("loaddata")
})
/**
 * Initialize DB: First step. Set Database name, mariadb root password, database user and password
 */
router.post("/do_initialize", async (req, res) => {
  cfg.clear() // start over
  cfg.set("dbport", DBPORT)
  cfg.set("dbhost", DBHOST)
  body2cfg(req.body)
  connection = mysql.createConnection({
    host: DBHOST,
    user: "root",
    port: DBPORT,
    password: cfg.get("dbrootpwd")
  })
  connection.connect(err => {
    if (err) {
      res.render("error", { message: "could not connect", error: err })
      return
    }
  })
  try {
    await exec(`CREATE  DATABASE ${cfg.get("dbname")}`)
    await exec(`CREATE USER ${cfg.get("dbuser")}@'%' identified by '${cfg.get("dbpwd")}'`)
    await exec("flush privileges")
    await exec(`grant all on ${cfg.get("dbname")}.* to ${cfg.get("dbuser")}@'%'`)
    await exec(`grant super on *.* to ${cfg.get("dbuser")}@'%'`)
    connection.end()
    const response = await prequest.get(
      "https://raw.githubusercontent.com/rgwch/elexis-3-core/ungrad2019/bundles/ch.elexis.core.data/rsc/createDB.script"
    )
    let cr1 = response.replace(/#.*\r?\n/g, "")
    const createdb = cr1.split(";")
    connection = mysql.createConnection({
      host: DBHOST,
      user: cfg.get("dbuser"),
      port: DBPORT,
      password: cfg.get("dbpwd"),
      database: cfg.get("dbname")
    })
    for (const stm of createdb) {
      const trimmed = stm.trim()
      if (trimmed.length > 0) {
        await exec(trimmed)
      }
    }
    connection.end()
    res.render("init_step2")
  } catch (err) {
    res.render("error", { message: "Database error", error: err })
  }
})

/**
 * Initialize db second step: Create Admin and first mandator
 */
router.post("/createaccount", async (req, res) => {
  body2cfg(req.body)
  connection = mysql.createConnection({
    host: DBHOST,
    user: cfg.get("dbuser"),
    port: DBPORT,
    password: cfg.get("dbpwd"),
    database: cfg.get("dbname")
  })
  try {
    const uid = uuidv4()
    await exec(`INSERT INTO KONTAKT(id,Bezeichnung1,Bezeichnung2,istPerson,istAnwender,istMandant,deleted) 
  VALUES ('${uid}','${req.body.lastname}','${req.body.firstname}','1','1','1','0')`)
    const hashes = encrypt(req.body.adminpwd)
    await exec(`INSERT INTO USER_ (id, KONTAKT_ID, IS_ADMINISTRATOR, SALT, HASHED_PASSWORD,deleted) 
  VALUES ('Administrator', '${uid}', '1', '${hashes.salt}', '${hashes.hashed}','0')`)
    const uhashes = encrypt(req.body.userpwd)
    await exec(`INSERT into USER_ (id,KONTAKT_ID,IS_ADMINISTRATOR,SALT,HASHED_PASSWORD) 
      VALUES ('${req.body.username}','${uid}','0','${uhashes.salt}','${uhashes.hashed}')`)
    initwlx()
    res.render("success", {
      header: "Datenbank erstellt",
      body: "Sie können jetzt einen Elexis-Client mit der Datenbank verbinden oder Basis-Datenbestände einlesen."
    })
  } catch (err) {
    res.render("error", { message: "Could not insert initialize data", error: err })
  }
})

/**
 * Initialize db third step: import data sets and create configuration for Webelexis
 *
 */
router.post("/loaddata", async (req, res) => {
  try {
    if (req.body.articles) {
      const result = await mysqlFromUrlGzipped("http://elexis.ch/ungrad/artikel.sql.gz")
    }
    if (req.body.tarmed) {
      const result = await mysqlFromUrlGzipped("http://elexis.ch/ungrad/tarmed.sql.gz")
    }
    if (req.body.icd10) {
      const result = await mysqlFromUrlGzipped("http://elexis.ch/ungrad/icd10.sql.gz")
    }
    if (req.body.labcode) {
      const result = await mysqlFromUrlGzipped("http://elexis.ch/ungrad/eal2009.sql.gz")
    }
    if (req.body.migel) {
      const result = await mysqlFromUrlGzipped("http://elexis.ch/ungrad/migel.sql.gz")
    }
    if (req.body.kkdata) {
      const result = await mysqlFromUrlGzipped("http://elexis.ch/ungrad/kkliste.sql.gz")
    }
    if (req.body.demodb) {
      const result = await mysqlFromUrlGzipped("http://elexis.ch/ungrad/demodb.sql.gz")
    }
    res.render("success", {
      header: " Ausgeführt",
      body: "Die gewünschten Datenbestände wurden eingelesen."
    })
  } catch (err) {
    res.render("error", {
      message: "Could not initialize data",
      error: err
    })
  }
})

router.post("/readsql", async (req, res) => {
  req.pipe(req.busboy)
  req.busboy.on('file', (fieldname, file, filename) => {
    console.log(`Upload of '${filename}' started`);
    mysqlFromPlain(file).then(res => {
      res.render("success", {
        header: "Fertig",
        body: "Das Script wurde eingelesen"
      })
    }).catch(err => {
      res.render("error", {
        message: "Could not read sql script",
        error: err
      })
    })
  })
})

function body2cfg(parms) {
  for (const key of Object.keys(parms)) {
    cfg.set(key, parms[key])
  }
}
function exec(sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, resp, fields) => {
      if (err) {
        reject(err)
      }
      resolve(resp)
    })
  })
}

module.exports = router
