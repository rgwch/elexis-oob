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
const fs = require('fs')
const path = require('path')
const jobs = require('./jobs')
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

  })
}

function mysqlFromChunks(basename, totalchunks) {
  return new Promise(async (resolve, reject) => {
    const destfile = path.join(path.dirname(basename), path.basename(basename) + "sql")
    const output = fs.createWriteStream(destfile)
    for (let i = 1; i <= totalchunks; i++) {
      const stream = fs.createReadStream(basename + i)
      await readChunk(stream, output)
      // jobs.updateJob(jobname, 1)
      fs.unlink(basename + i, err => {
        if (err) {
          console.log("Could not delete " + basename + i + "(" + JSON.stringify(err) + ")")
        }
      })
    }
    output.end()

    const infile = fs.createReadStream(destfile)
    // const jobname = "Einlesen: " + path.basename(basename)
    const dbname = cfg.get("dbname")
    // jobs.addJob(jobname, totalchunks)
    const mysql = spawn("mysql", [
      "-h",
      cfg.get("dbhost"),
      "--protocol",
      "tcp",
      "-P",
      cfg.get("dbport"),
      "-u",
      cfg.get("dbuser"),
      "-p" + cfg.get("dbpwd")
    ])
    mysql.stderr.on("data", data => {
      console.log("mysql errstream: " + data.toString())
    })
    mysql.stdin.on("error", err => {
      console.log("mysql input stream error:" + err)
      fs.unlink(destfile, () => {
        reject(err)
      })
    })
    infile.on('end', () => {
      fs.unlink(destfile, () => {
        // jobs.dele
        resolve()
      })
    })
    try {
      await sendCommand(mysql.stdin, "set foreign_key_checks = 0;\n")
      // await sendCommand(mysql.stdin, `drop database ${dbname};\n`)
      await sendCommand(mysql.stdin, `create database if not exists ${dbname};\n use ${dbname};\n`)
      infile.pipe(mysql.stdin)

    } catch (err) {
      console.log("command error " + err)
    }
  })
}

function sendCommand(stream, command) {
  return new Promise((resolve,reject) => {
    stream.write(command, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
function readChunk(instream, outstream) {
  return new Promise((resolve, reject) => {
    instream.pipe(outstream, { end: false })
    instream.on("end", () => {
      resolve()
    })
    instream.on("error", err => {
      reject(err)
    })
  })
}

/*
function mysqlFromPlain(stream){
  return new Promise((resolve, reject) => {
    const dbname=cfg.get("dbname")
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
      dbname
    ])
    mysql.on("close",(code,signal)=>{
      logger.info(`mysql read closed with ${code}, signal ${signal}`)
    })
    mysql.on('exit',(code,signal)=>{
      logger.info(`mysql read exited with ${code}, signal ${signal}`)
      // resolve()
    })
    mysql.on('error',(err)=>{
      logger.error("Could not launch mysql "+err)
      reject(err)
    })
    mysql.stdout.on("data",chunk=>{
      logger.info("Mysql output "+chunk)
    })
    mysql.stderr.on("data", data => {
      logger.info("Mysql errmsg: "+data.toString())
    })
    mysql.stdin.write("set foreign_key_checks = 0;\n")
    mysql.stdin.write(`drop database ${dbname}; create database ${dbname}; use ${dbname};\n`)
    stream.on("data",chunk=>{
      mysql.stdin.write(chunk.toString("utf-8"))
      // console.log(chunk.toString("utf-8"))
    })
    //stream.pipe(mysql.stdin)
    stream.on("error", err => {
      reject(err)
    })
    stream.on("end",()=>{
      resolve()
    })
  })
}
*/

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


module.exports = { loadGzipped, loadFromUrlGzipped, mysqlFromUrlGzipped, mysqlFromChunks }

