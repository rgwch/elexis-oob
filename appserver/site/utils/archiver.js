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
  schedule(rule, jobs, numbackups) {
    this.timer = scheduler.scheduleJob(rule, async () => {
      for (const job of jobs) {
        await this.pack(job, numbackups)
      }
    })
    return this.timer.nextInvocation()
  }
  /**
   * Archibe a single directory
   * @param {*} dirname directory to archive
   * @param {*} numbackups number of archives to keep
   */
  pack(dirname, numbackups) {
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
            log.error("Error while cleaning up ", err)
          } else {
            const myfiles = files.map(f => f.startsWith(base)).sort((a, b) => { a.localeCompare(b) })
            while (myfiles.length > numbackups) {
              const file = path.join(this.outdir, myfiles.shift())
              fs.unlink(file, err => {
                log.error("error removing %s: %s", file, err)
              })
              log.info("removed ", file)
            }
          }
        })
        resolve(true)
      })
      destfile.on("error", err => {
        log.warn("pack exited with error ", err)
        reject(err)
      })
    })
  }
}

module.exports = Archiver
