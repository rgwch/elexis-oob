const chai = require('chai')
chai.should()
const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const archiver = require('../utils/archiver')
const winston=require('winston')
winston.level="debug"
winston.add(new winston.transports.Console({
    format: new winston.format.simple()
}))

const testdir = path.join(__dirname, "output")
const delay=ms=>{
    return new Promise((resolve)=>{
        setTimeout(resolve,ms)
    })
}

before(done => {
    rimraf(testdir, err => {
        if (err) {
            console.log(err)
        }
        fs.mkdir(testdir, err => {
            done()
        })

    })
})

describe("single pack", () => {
    it("creates a backup of this directory", async () => {
        const tosave = path.join(__dirname, "../public/doc")
        const arc = new archiver(testdir, 3)
        const result = await arc.pack(tosave)
        console.log(result)
    })

    it("cleans up backups", async () => {
        fs.writeFileSync(testdir+"/doc_2010-01-01-2000.tar.gz","Blabla")
        fs.writeFileSync(testdir+"/doc_2011-01-01-2000.tar.gz","blabla")
        fs.writeFileSync(testdir+"/doc_2010-01-01-1955.tar.gz","blurb")
        const bef=fs.existsSync(testdir+"/doc_2010-01-01-1955.tar.gz")
        bef.should.be.true
        const tosave = path.join(__dirname, "../public/doc")
        const arc = new archiver(testdir, 3)
        const result = await arc.pack(tosave)
        await delay(10)
        fs.existsSync(testdir+"/doc_2010-01-01-1955.tar.gz").should.be.false
    })
})

