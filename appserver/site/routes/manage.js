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
    fs.writeFile('/mnt/webelexisdata/key.pem', keys.privateKey, err => {
        if (err) {
            res.render("error", { message: "Fehler beim Speichern", error: err })
        } else {
            fs.writeFile("/mnt/webelexisdata/cert.pem", keys.certificate, err => {
                if (err) {
                    res.render("error", { message: "Fehler beim Speichern", error: err })
                } else {
                    res.render("success", { header: "Zertifikat gespeichert", body: "Sie können jetzt mit https:// auf die Seite zugreifen." })
                }
            })
        }
    })
})
module.exports = router