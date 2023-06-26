const config = require('../config.json')
const mysql = require('mysql2/promise')
class BizMysql {
    constructor() {
        this.inited = false
        this.pool = undefined
    }
    async getConn(){
        if (!this.inited) {
            console.log('mysql init pool')
            this.inited = true
            this.pool = mysql.createPool(config.mysql)
            console.log('mysql set time_zone +8')
            this.pool.query(`set time_zone='+08:00'`)
        }
        return this.pool
    }
    async query(sql, params) {
        return (await this.getConn()).query(sql, params)
    }
}
module.exports = new BizMysql()
