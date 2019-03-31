/****************************************
 * This file is part of elexis-oob      *
 * Copyright (c) 2019 by G. Weirich     *
 ****************************************/
const express = require("express")
const router = express.Router()
const certgen = require('../utils/certs')
const fs = require('fs')

router.get("/certdef", (req, res) => {
  res.render("create_cert")
})

router.post("/certgen", (req, res) => {
  const keys = certgen(req.body)
  fs.writeFile(`/mnt/webelexisdata/${req.body.cn}.key`, keys.privateKey, err => {
    if (err) {
      res.render("error", { message: "Fehler beim Speichern", error: err })
    } else {
      fs.writeFile(`/mnt/webelexisdata/${req.body.cn}.crt`, keys.certificate, err => {
        if (err) {
          res.render("error", { message: "Fehler beim Speichern", error: err })
        } else {
          res.render("success", {
            header: "Zertifikat gespeichert",
            body: `Sie können jetzt mit https://${req.body.cn} auf die Seite zugreifen.`
          })
        }
      })
    }
  })
})

router.get("/selcert", (req, res) => {
  res.render("upload_cert")
})

router.post("/certsend", async (req, res) => {
  try {
    req.busboy.on('error',err=>{
      res.render("error", { error: err })    
    })
    const result=[]
    req.busboy.on('file', (fieldname, file, filename) => {
      if (fieldname == "cert") {
        const out=fs.createWriteStream(`/mnt/webelexisdata/${filename}`)
        file.pipe(out)
        out.on('finish',()=>{
          console.log("cert written "+filename)    
        })
        out.on('error',err=>{
          console.log("cert write error "+err)
        })
      } else if (fieldname == "privkey") {
        const out=fs.createWriteStream(`/mnt/webelexisdata/${filename}`)
        file.pipe(out)
        out.on('finish',()=>{
          console.log("key written "+filename)
        })
        out.on('error',err=>{
          console.log("key write error "+err)
        })
      }
    })
    req.busboy.on('finish',()=>{
      res.render("success", { body: "Das Schlüsselpaar wurde installiert" })
    })
    req.pipe(req.busboy)

  } catch (err) {
    res.render("error", { err: err })
  }
})
module.exports = router