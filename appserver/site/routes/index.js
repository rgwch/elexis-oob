/****************************************
 * This file is part of elexis-oob      *
 * Copyright (c) 2019 by G. Weirich     *
 ****************************************/
const express = require("express")
const router = express.Router()
const cfg = new (require("conf"))()


/* GET home page. */
router.get("/", function(req, res, next) {
  const port = cfg.get("dbport") || 3312
  const hostname = req.hostname
  const dbname = cfg.get("dbname") || "elexisoob"
  const username = cfg.get("dbuser") || "(den Namen für die Datenbankverbindung)"
  const password = cfg.get("dbpwd") || "(das Passwort für die Datenbankverbindung)"
  res.render("index", {
    title: "Elexis Out-Of-The-Box",
    hostname,
    port: (process.env.PUBLIC_DBPORT || port),
    dbname,
    username,
    password
  })
})

let proc
router.get("/wait/:rum?", (req, res) => {
  if (req.params.rum) {
    proc += 10
    res.json({ status: proc >= 100 ? "finished" : "running", process: proc })
  } else {
    proc = 0
    res.render("wait", { checkurl: "/wait/123", process: 0 })
  }
})
/**
 * Serve the Core repository dir listing and files
 */
router.get("/elexis-core/:dir?/:file", (req, res) => {
  let dname = req.params.dir
  let fname = req.params.file
  const fp = dname ? dname + "/" + fname : fname
  res.sendFile("/home/node/site/public/core-repository/" + fp)
})

/**
 * Serve the Base repository dir listing and files
 */
router.get("/elexis-base/:dir?/:file", (req, res) => {
  let dname = req.params.dir
  let fname = req.params.file
  const fp = dname ? dname + "/" + fname : fname
  res.sendFile("/home/node/site/public/base-repository/" + fp)
})

/**
 * Serve the Ungrad repository dir listing and files
 */
router.get("/elexis-ungrad/:dir?/:file", (req, res) => {
  let dname = req.params.dir
  let fname = req.params.file
  const fp = dname ? dname + "/" + fname : fname
  res.sendFile("/home/node/site/public/ungrad-repository/" + fp)
})

module.exports = router
