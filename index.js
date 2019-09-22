const fs = require('fs')

const read = path => new Promise((rs, rj) => fs.readFile(path, (err, data) => err ? rj(err) : rs(data)))
const write = (path, content) => new Promise((rs, rj) => fs.writeFile(path, content, err => err ? rj(err) : rs()))

module.exports = class extends Map {
    constructor(path, time, keys) {
        return new Promise((rs, rj) => {
            super(keys)

            if (typeof path != 'string')
                throw new Error('You must provide a db name as the first parameter')
            this.path = path

            if (time && typeof time != 'number')
                throw new Error('The second argument should be a number, duration in ms')
            this.time = time || 100

            read(this.path)
                .then(file => {
                    const data = JSON.parse(file)
                    Object.keys(data).forEach(key => super.set(key, data[key]))

                    rs(this)
                })
                .catch(() => {
                    write(path, JSON.stringify({}))
                        .then(() => rs(this))
                        .catch(rj)
                })

            this.queue = []
            setTimeout(() => {
                if (this.queue.length < 1) return

                read(this.path)
                    .then(data => {
                        let toWrite = JSON.parse(data)
                        this.queue.forEach(item => toWrite[item.key] = item.value)
                        this.queue = []
            
                        write(this.path, JSON.stringify(toWrite))
                            .catch(er => { throw new Error(`Failed to write to ${this.path}: ${er}`) })
                    })
                    .catch(er => { throw new Error(`Failed to read ${this.path}: ${er}`) })
            }, this.time)
        })
    }

    set(key, value) {
        this.queue.push({ key, value })
        return super.set(key, value)
    }
}
