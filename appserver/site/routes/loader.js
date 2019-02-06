const xz = require('xz')
const { Writable } = require('stream')
const fetch = require('node-fetch')

function loadFromUrlXz(connection, url) {
    return fetch(url).then(response => {
        return loadFromXz(connection, response.body)
    }).catch(err=>{
        console.log(err)
    })

}

function loadFromXz(connection, readStream) {
    return new Promise((resolve, reject) => {
        const expander = new xz.Decompressor()
        const loader = new SqlLoader(connection)
        loader.on('finish', () => {
            resolve()
        })
        loader.on('error', (err => {
            reject(err)
        }))
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
        Promise.all(jobs).then(result => {
            return result
        }).then(last => {
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
            this.conn.query(cmd, (err, resp, fields) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(resp)
                }
            })
        })
    }
}


module.exports={loadFromXz,loadFromUrlXz}
/*
loadFromUrlXz(undefined, "http://elexis.ch/ungrad/artikel.sql.xz").then(resp=>{
    console.log(resp)
})
*/