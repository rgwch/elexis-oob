/****************************************
 * This file is part of elexis-oob      *
 * Copyright (c) 2019 by G. Weirich     *
 ****************************************/
const express = require("express")
const router = express.Router()
const cfg = new (require("conf"))()
const mysql = require("mysql")
const request = require("request-promise-native")
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
    host: "localhost",
    user: "root",
    port: 3312,
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
      host: "localhost",
      user: cfg.get("db").username,
      port: 3312,
      password: cfg.get("db").userpwd,
      database: cfg.get("db").name
    })
    for (const stm of createdb) {
      const trimmed = stm.trim()
      if (trimmed.length > 0) {
        await exec(trimmed)
      }
    }
    res.render("index")
  } catch (err) {
    res.render("error", { message: "Database error", error: err })
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
