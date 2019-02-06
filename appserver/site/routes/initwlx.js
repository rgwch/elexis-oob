/****************************************
 * This file is part of elexis-oob      *
 * Copyright (c) 2019 by G. Weirich     *
 ****************************************/

const cfg = new (require("conf"))()
const fs = require("fs")

/**
 * Create initial config for Webelexis
 */
const initWebelexis = () => {
  defaults = {
    testing: false,
    sitename: "Praxis Webelexis",
    adminpwd: cfg.get("adminpwd"),
    mandators: {
      default: {
        name: cfg.get("title") + " " + cfg.get("firstname") + " " + cfg.get("lastname"),
        subtitle: "Facharzt für Webelexik",
        street: cfg.get("street"),
        place: cfg.get("place"),
        phone: cfg.get("phone"),
        email: cfg.get("email"),
        zsr: cfg.get("zsr"),
        gln: cfg.get("gln")
      }
    },
    docbase: "../data/sample-docbase",
    elexisdb: {
      host: "localhost",
      database: cfg.get("dbname"),
      user: cfg.get("dbuser"),
      password: cfg.get("dbpwd"),
      port: cfg.get("dbport"),
      autmodify: true
    },
    lucinda: {
      url: "http://localhost:2016/lucinda/2.0"
    }
  }
  const str = "module.exports="+JSON.stringify(defaults)
  try {
    fs.writeFileSync("/mnt/webelexisdata/settings.js", str)
    fs.mkdirSync("/mnt/webelexisdata/sample-docbase")
  } catch (err) {
    console.log(str)
  }
}

module.exports = initWebelexis
