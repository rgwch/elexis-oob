/****************************************
 * This file is part of elexis-oob      *
 * Copyright (c) 2019 by G. Weirich     *
 ****************************************/

const crypto = require("crypto")

/**
 * Encrypt a password the same way as Elexis
 * @param {string} pwd 
 * @param {string} salt (optional) 
 */
const encrypt = (pwd, salt) => {
    if (!salt) {
        salt = crypto.randomBytes(8).toString('hex')
    }else{
        salt=Buffer.from(salt,'hex')
    }
    const key = crypto.pbkdf2Sync(pwd, salt, 20000, 20, "sha1")
    const hashed = key.toString("hex")
    return {salt:salt.toString('hex'),hashed}
}

// Prove that this creates the same hashes as elexis
//const enc=(encrypt('administrator','1254bb9a05856b9e'))
//console.log(enc)
//console.log(enc.hashed=='b94a0b6fc7be97e0a1585ac85e814d3852668968')
module.exports = encrypt
