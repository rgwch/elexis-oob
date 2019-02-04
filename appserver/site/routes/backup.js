/****************************************
 * This file is part of elexis-oob      *
 * Copyright (c) 2019 by G. Weirich     *
 ****************************************/
var express = require("express")
var router = express.Router()

router.get("/settings", (req, res) => {
  res.render("backup")
})

router.post("/exec", (req, res) => {
  // FLUSH TABLES WITH READ LOCK;

  console.log(req.body)
})

function doBackup(){
  
}

module.exports=router