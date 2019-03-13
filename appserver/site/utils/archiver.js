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
    this.compressor = zlib.createGzip()
  }

  schedule(rule, jobs) {
    this.timer = scheduler.scheduleJob(rule, async () => {
      for (const job of jobs) {
        await this.pack(job)
      }
    })
    return this.timer.nextInvocation()
  }
  pack(dirname) {
    return new Promise((resolve, reject) => {
      const base = path.basename(dirname)
      const now = DateTime.local()
      const suffix = now.toFormat("yyyy-LL-dd-HHmm")
      const destfile = fs.createWriteStream(path.join(this.outdir, base + "_" + suffix + ".tar.gz"))
      tar
        .pack(dirname)
        .pipe(this.compressor)
        .pipe(destfile)
      destfile.on("finish", () => {
        log.info("pack finished normnally")
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
