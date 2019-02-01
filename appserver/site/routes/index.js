/****************************************
 * This file is part of elexis-oob      *
 * Copyright (c) 2019 by G. Weirich     *
 ****************************************/
var express = require("express")
var router = express.Router()

const ip = require("ip").address()

var net = require("net")

function getNetworkIP(callback) {
  var socket = net.createConnection(80, "www.google.com")
  socket.on("connect", function() {
    callback(undefined, socket.address().address)
    socket.end()
  })
  socket.on("error", function(e) {
    callback(e, "error")
  })
}

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Elexis Out-Of-The-Box", ip: ip })
})

/**
 * Serve the Core repository dir listing and files
 */
router.get("/core/:dir?/:file", (req, res) => {
  let dname = req.params.dir
  let fname = req.params.file
  const fp = dname ? dname + "/" + fname : fname
  res.sendFile("/home/node/site/public/core-repository/" + fp)
})

/**
 * Serve the Base repository dir listing and files
 */
router.get("/base/:dir?/:file", (req, res) => {
  let dname = req.params.dir
  let fname = req.params.file
  const fp = dname ? dname + "/" + fname : fname
  res.sendFile("/home/node/site/public/base-repository/" + fp)
})

/**
 * Serve the Ungrad repository dir listing and files
 */
router.get("/ungrad/:dir?/:file", (req, res) => {
  let dname = req.params.dir
  let fname = req.params.file
  const fp = dname ? dname + "/" + fname : fname
  res.sendFile("/home/node/site/public/ungrad-repository/" + fp)
})

module.exports = router
