/****************************************
 * This file is part of elexis-oob      *
 * Copyright (c) 2019 by G. Weirich     *
 ****************************************/
const express = require("express")
const router = express.Router()
const cfg = new (require('conf'))()
const mysql = require('mysql')
const HOST = "localhost"
const PORT = 3312
const path = require('path')
const { spawn } = require('child_process');

router.get("/settings", (req, res) => {
  res.render("backup")
})

router.post("/exec", (req, res) => {
  connection = mysql.createConnection({
    host: HOST,
    user: "root",
    port: PORT,
    password: cfg.get("dbrootpwd")
  })
  connection.query("FLUSH TABLES WITH READ LOCK;")
  const { spawn } = require('child_process');
  console.log(__dirname)
  try {
    const backup = spawn("backup.sh")
    backup.stdout.on('data', data => {
      console.log(data)
    })
    backup.stderr.on("data", data => {
      console.log(data)
      res.render("error", { message: data, err: {} })
    })
    backup.on('close', exit => {
      conso9le.log(data)
      connection.query("UNLOCK TABLES")
      res.render("ok")
    })
  } catch (err) {
    console.log(err)
    console.log(__dirname)
  }
  console.log(req.body)
})

function doBackup() {

}

module.exports = router