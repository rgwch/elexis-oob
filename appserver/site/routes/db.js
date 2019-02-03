/****************************************
 * This file is part of elexis-oob      *
 * Copyright (c) 2019 by G. Weirich     *
 ****************************************/
var express = require("express")
var router = express.Router()

router.get("/init", (req, res) => {
  res.render("init_form")
})

router.get("/do_initialize",(req,res)=>{
    
})