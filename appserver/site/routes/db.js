/****************************************
 * This file is part of elexis-oob      *
 * Copyright (c) 2019 by G. Weirich     *
 ****************************************/
const express = require("express")
const router = express.Router()
const cfg = new (require('conf'))()
const mysql = require('mysql')
let connection

router.get("/init", (req, res) => {
  res.render("init_form")
})

router.post("/do_initialize", (req, res) => {
  cfg.set("db.name", req.body.dbname)
  cfg.set("db.rootpwd", req.body.dbrootpwd)
  cfg.set("db.username", req.body.dbuser)
  cfg.set("db.userpwd", req.body.dbpwd)
  connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3312,
    password: cfg.get('db').rootpwd
  })
  connection.connect(err => {
    if (err) {
      res.render('error', { message: "could not connect", error: err })
      throw (err)
    }
  })
  connection.query(`CREATE  DATABASE ${cfg.get('db').name}`, (err, results, fields) => {
    if (err) {
      res.render('error', { message: "could not create database", error: err })
      throw (err)
    }
    connection.query(`CREATE USER ${cfg.get('db').username}@'%' identified by '${cfg.get('db').userpwd}'`, (err, results) => {
      if (err) {
        res.render("error", { message: "could not create user", error: err })
      }
      res.render('index')
    })
  })
})



module.exports = router
