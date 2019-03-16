/****************************************
 * This file is part of elexis-oob      *
 * Copyright (c) 2019 by G. Weirich     *
 ****************************************/

const logger = require("winston")
const cfg = new (require("conf"))()

if (!cfg.get("dbport")) {
  cfg.set("dbport", (process.env.DBPORT || 3312))
}

if (!cfg.get("dbhost")) {
  cfg.set("dbhost", (process.env.DBHOST || "localhost"))
}

if(!cfg.get("dbname")){
    cfg.set("dbname", (process.env.DBNAME || "elexisoob"))
}

if(!cfg.get("dbuser")){
  cfg.set("dbuser", (process.env.DBUSER || "root"))
}

if(!cfg.get("dbpwd")){
  cfg.set("dbpwd",(process.env.DBPWD || "elexisadmin"))
}
