const tar = require("tar-fs")
const fs = require("fs")
const path = require("path")
const scheduler = require("node-schedule")
const zlib=require('zlib')

class Archiver {
  constructor(outdir, numToKeep) {
    this.outdir = outdir
    this.num2keep = numToKeep
    this.compressor = zlib.createGzip()
  }

  schedule(rule, jobs) {
    this.timer=scheduler.scheduleJob(rule,async ()=>{
      for(const job of jobs){
        await this.pack(job)
      }
    })
    return this.timer.nextInvocation()
  }
  pack(dirname) {
    return new Promise((resolve, reject) => {
      const base = path.basename(dirname)
      const destfile = fs.createWriteStream(path.join(this.outdir, base + ".tar.xz"))
      tar
        .pack(dirname)
        .pipe(this.compressor)
        .pipe(destfile)
      destfile.on("finish", () => {
        resolve(true)
      })
      destfile.on("error", err => {
        reject(err)
      })
    })
  }
}

module.exports = Archiver
