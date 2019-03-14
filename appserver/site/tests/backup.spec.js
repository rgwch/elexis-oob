const chai=require('chai')
chai.should()
const fs=require('fs')
const path=require('path')
const rimraf=require('rimraf')
const archiver=require('../utils/archiver')

const testdir=path.join(__dirname,"output")
before(done=>{
    rimraf(testdir,err=>{
        if(err){
            console.log(err)
        }
        fs.mkdir(testdir,err=>{
            done()
        })
        
    })
})

describe("Backup",()=>{
    it("creates a backup of this directory",async ()=>{
        const tosave=path.join(__dirname,"../public/doc")
        const arc=new archiver(testdir,3)
        const result=await arc.pack(tosave)
        console.log(result)
    })
})