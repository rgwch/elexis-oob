/****************************************
 * This file is part of elexis-oob      *
 * Copyright (c) 2019 by G. Weirich     *
 ****************************************/
const express = require("express")
const router = express.Router()
const cfg = new (require("conf"))()
const mysql = require("mysql")
const request = require("request-promise-native")
const crypto = require("crypto")
const uuidv4 = require("uuid/v4")
const HOST = "localhost"
const PORT = 3312
let connection

router.get("/init", (req, res) => {
  res.render("init_form")
})

router.post("/do_initialize", async (req, res) => {
  cfg.set("db.name", req.body.dbname)
  cfg.set("db.rootpwd", req.body.dbrootpwd)
  cfg.set("db.username", req.body.dbuser)
  cfg.set("db.userpwd", req.body.dbpwd)
  connection = mysql.createConnection({
    host: HOST,
    user: "root",
    port: PORT,
    password: cfg.get("db").rootpwd
  })
  connection.connect(err => {
    if (err) {
      res.render("error", { message: "could not connect", error: err })
      return
    }
  })
  try {
    await exec(`CREATE  DATABASE ${cfg.get("db").name}`)
    await exec(
      `CREATE USER ${cfg.get("db").username}@'%' identified by '${cfg.get("db").userpwd}'`
    )
    await exec("flush privileges")
    await exec(`grant all on ${cfg.get("db").name}.* to ${cfg.get("db").username}@'%'`)
    connection.end()
    const response = await request.get(
      "https://raw.githubusercontent.com/rgwch/elexis-3-core/ungrad2019/bundles/ch.elexis.core.data/rsc/createDB.script"
    )
    let cr1 = response.replace(/#.*\r?\n/g, "")
    const createdb = cr1.split(";")
    connection = mysql.createConnection({
      host: HOST,
      user: cfg.get("db").username,
      port: PORT,
      password: cfg.get("db").userpwd,
      database: cfg.get("db").name
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

router.post("/createaccount", async (req, res) => {
  connection = mysql.createConnection({
    host: HOST,
    user: cfg.get("db").username,
    port: PORT,
    password: cfg.get("db").userpwd,
    database: cfg.get("db").name
  })
  try {
    const salt = crypto.randomBytes(8).toString('hex')
    const key = crypto.pbkdf2Sync(req.body.adminpwd, salt, 20000, 160, "sha1")
    
    const adminpwd = key.toString("hex")
    await exec(`INSERT INTO USER_ (id, IS_ADMINISTRATOR, SALT, HASHED_PASSWORD,deleted) 
  VALUES ('Administrator', '1', '${salt}', '${adminpwd}','0')`)
    const uid=uuidv4()
    const usalt=crypto.randomBytes(8).toString('hex')
    const ukey= crypto.pbkdf2Sync(req.body.userpwd, salt, 20000, 160, "sha1")
    const upwd=ukey.toString('hex')
    await exec(`INSERT INTO KONTAKT(id,Bezeichnung1,Bezeichnung1,istperson,istanwender,deleted") 
  VALUES ('${uid}','${req.body.lastname}','${req.body.firstname}','1','1','0')`)
    await exec(`INSERT into USER_ (id,KONTAKT_ID,IS_ADMINISTRATOR,SALT,HASHED_PASSWORD) 
      VALUES ('${uuidv4()}','${uid}','0','${usalt}','${upwd}')`)
  } catch (err) {
    res.render("error", { message: "Could not insert initialize data", error: err })
  }
})
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
