/****************************************
 * This file is part of elexis-oob      *
 * Copyright (c) 2019 by G. Weirich     *
 ****************************************/

const tar = require("tar-fs")
const fs = require("fs")
const path = require("path")
const scheduler = require("node-schedule")
const log = require('winston')
const zlib = require('zlib')
const { DateTime } = require('luxon')

class Archiver {
  constructor(outdir, numToKeep) {
    this.outdir = outdir
    this.num2keep = numToKeep
  }

  /**
   * schedule backup jobs
   * @param {*} rule a ruleset in crontab format
   * @param {*} jobs an Array of directories to archive
   * @param {*} numbackups number of archives to keep (delete olders after successful archive)
   */
  schedule(rule, jobs) {
    this.timer = scheduler.scheduleJob(rule, async () => {
      for (const job of jobs) {
        await this.pack(job)
      }
    })
    return this.timer.nextInvocation()
  }
  /**
   * Archibe a single directory
   * @param {*} dirname directory to archive
   * @param {*} numbackups number of archives to keep
   */
  pack(dirname) {
    const compressor = zlib.createGzip()

    return new Promise((resolve, reject) => {
      const base = path.basename(dirname)
      const now = DateTime.local()
      const suffix = now.toFormat("yyyy-LL-dd-HHmm")
      const destfile = fs.createWriteStream(path.join(this.outdir, base + "_" + suffix + ".tar.gz"))
      tar
        .pack(dirname)
        .pipe(compressor)
        .pipe(destfile)
      destfile.on("finish", () => {
        log.info("pack finished normally")
        fs.readdir(this.outdir, (err, files) => {
          if (err) {
            log.error(`Error while cleaning up: ${JSON.stringify(err)} `)
          } else {
            const myfiles = files.filter(f => f.startsWith(base)).sort((a, b) => a.localeCompare(b))
            while (myfiles.length > this.num2keep) {
              const file = path.join(this.outdir, myfiles.shift())
              fs.unlink(file, err => {
                if (err)
                  log.error(`error removing ${file}: ${JSON.stringify(err)}`)
              })
              log.info(`removed ${file}`)
            }
          }
        })
        resolve(true)
      })
      destfile.on("error", err => {
        log.warn(`pack exited with error: ${JSON.stringify(err)}`)
        reject(err)
      })
    })
  }

  list_files() {
    return new Promise((resolve, reject) => {
      fs.readdir(this.outdir, (err, files) => {
        if (err) {
          reject(err)
        }
        resolve(files)
      })
    })
  }

  list_dates() {
    return this.list_files().then(files => {
      const dates = files.map(file => /.+?_(.+?)\.tar.gz/.exec(file)[1])
      const unique= dates.filter((date, index, self) => self.indexOf(date) === index)
      const normalized=unique.map(date=>DateTime.fromFormat(date,"yyyy-LL-dd-HHmm").toFormat("dd.LL.yyyy, HH:mm"))
      return normalized
    })
  }
}

module.exports = Archiver
