const chai=require('chai')
chai.should()
const fs=require('fs')
const path=require('path')

const testdir=path.join(__dirname,"output")
before(done=>{
    fs.rmdir(testdir,err=>{
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

    })
})