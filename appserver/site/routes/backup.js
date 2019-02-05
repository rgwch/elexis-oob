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
  try {
    //connection.query("FLUSH TABLES WITH READ LOCK;")
    const bfile = path.join(__dirname, "../backup.sh")
    console.log(bfile)
    const backup = spawn(bfile)
    backup.stdout.on('data', data => {
      console.log(data.toString("utf8"))
    })
    backup.stderr.on("data", data => {
      console.log(data.toString("utf8"))
      // res.render("error", { message: data, err: {} })
      // it's "tar: stripping leading / from file names"
    })
    backup.on('close', exit => {
      // connection.query("UNLOCK TABLES")
      connection.end()
      res.json({ "status": "ok" })
    })
  } catch (err) {
    console.log(err)
    console.log(__dirname)
    res.render("error",{message:"Backup failed",error:err})
  }
  console.log(req.body)
})

function doBackup() {

}

module.exports = router