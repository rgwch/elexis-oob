/****************************************
 * This file is part of elexis-oob      *
 * Copyright (c) 2019 by G. Weirich     *
 ****************************************/


const { Writable } = require("stream")
const fetch = require("node-fetch")
const zlib = require("zlib")
const logger = require("winston")
const cfg = new (require("conf"))()
const { spawn } = require("child_process")

/**
 * Fetch a GZipped SQL-File from an URL and load it into the database
 * database credentials must be in cfg, 'mysql' must be in the path
 * @param {string} url 
 */
function mysqlFromUrlGzipped(url) {
  return fetch(url).then(response => {
    return mysqlFromGZipped(response.body)
  })
}

/**
 * load a stream with Gzipped SQL Statements into the database.
 * Database credentials must be in cfg, 'mysql' must be in the path.
 * @param {readableStream} stream
 */

function mysqlFromGZipped(stream) {
  return new Promise((resolve, reject) => {
    const expander = zlib.createGunzip()
    const mysql = spawn("mysql", [
      "-h",
      cfg.get("dbhost"),
      "--protocol",
      "tcp",
      "-P",
      cfg.get("dbport"),
      "-u",
      cfg.get("dbuser"),
      "-p" + cfg.get("dbpwd"),
      cfg.get("dbname")
    ])
    mysql.stderr.on("data", data => {
      console.log(data.toString())
    })
    mysql.stdin.write("set foreign_key_checks = 0;\n")
    stream.pipe(expander).pipe(mysql.stdin)
    stream.on("end", () => {
      resolve()
    })
    stream.on("error", err => {
      reject(err)
    })
  }) 
}

function loadFromUrlGzipped(connection, url) {
  return fetch(url)
    .then(response => {
      return loadGzipped(connection, response.body)
    })
    .catch(err => {
      console.log(err)
    })
}

function loadGzipped(connection, readStream) {
  return new Promise((resolve, reject) => {
    const expander = zlib.createGunzip()
    const loader = new SqlLoader(connection)
    loader.on("finish", () => {
      resolve()
    })
    loader.on("error", err => {
      reject(err)
    })
    readStream.pipe(expander).pipe(loader)
  })
}

class SqlLoader extends Writable {
  constructor(connection, options) {
    super(options)
    this.conn = connection
    this.sql = ""
  }

  _write(chunk, encoding, next) {
    this.sql += chunk.toString().replace(/#.*\r?\n/g, "")
    const commands = this.sql.split(";")
    const jobs = []
    for (let i = 0; i < commands.length - 1; i++) {
      jobs.push(this.exec(commands[i].trim()))
    }
    Promise.all(jobs)
      .then(result => {
        return result
      })
      .then(last => {
        if (this.sql.endsWith(";")) {
          this.exec(commands[commands.length - 1].trim()).then(result => {
            this.sql = ""
            next()
          })
        } else {
          this.sql = commands[commands.length - 1]
          next()
        }
      })
  }

  exec(cmd) {
    return new Promise((resolve, reject) => {
      if (this.conn) {
        this.conn.query(cmd, (err, resp, fields) => {
          if (err) {
            logger.warn(cmd)
            reject(err)
          } else {
            logger.debug(cmd)
            resolve(resp)
          }
        })
      } else {
        console.log(cmd + "\n\n")
        resolve()
      }
    })
  }
}

module.exports = { loadGzipped, loadFromUrlGzipped, mysqlFromUrlGzipped }

/* test code
mysqlFromUrlGzipped("http://elexis.ch/ungrad/artikel.sql.gz").then(resp => {
  console.log(resp)
})
*/
