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
const archiver = require('../utils/archiver')
const { spawn } = require('child_process');
const log = require('winston')

const backupdir="/backup"
/**
 * backup management routes (/backup/..)
 */
router.get("/settings", (req, res) => {
  res.render("backup")
})

router.post("/exec", async (req, res) => {
  connection = mysql.createConnection({
    host: HOST,
    user: "root",
    port: PORT,
    password: cfg.get("dbrootpwd")
  })
  const dirs = ["/mnt/elexisdb", "/mnt/lucindadata", "/mnt/lucindabase", "/mnt/webelexisdata", "/mnt/pacsdata"]
  const archie = new archiver(backupdir, parseInt(req.body.numbackups))
  if (req.body.button == "setup") {
    const rule = req.body.minute + " " + req.body.hour + " " + req.body.day + " " + req.body.month + " " + req.body.weekday
    try {
      const ni = archie.schedule(rule, dirs)
      res.render('success', { header: "Backup konfiguriert", body: "Nächste Ausführung: " + ni.toString() })
    } catch (err) {
      res.render("error", { message: "Fehler beim Einrichten", error: err })
    }
  } else {
    try {
      for (const dir of dirs) {
        log.info("backing up " + dir)
        await archie.pack(dir)
      }
      res.render('success', { header: "Backup ausgeführt", body: "Keine Fehler" })

    } catch (err) {
      res.render("error", { message: "Fehler beim Backup", error: err })

    }
  }
})

router.get("/restore", async (req, res) => {
  const archie = new archiver(backupdir)
  const dates=await archie.list_dates()
  res.render("restore_form",{dates})
})

router.get("/restore/:idx",async (req,res) =>{
  const archie = new archiver(backupdir)
  const dates=await archie.list_dates()
  const index=req.params.idx
  res.render("restore_verify",{date: dates[index], index})
})

module.exports = router