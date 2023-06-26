const Redis = require('redis')
const redisConfig = require('../config.json').redis
class BizRedis {
    constructor() {
        this.client = Redis.createClient({
            url: redisConfig.url,
            password: redisConfig.password
        })
        this.connected = false
    }
    async init() {
        if (this.connected) {
            return this.client
        }
        this.connected = true
        console.log('redis-utils init')
        await this.client.connect()
        console.log('redis-utils init done')
        return this.client
    }
    async set(key, value, timeout=600) {
        if (typeof value === 'object') {
            value = JSON.stringify(value)
        }
        await this.init()
        key = `${redisConfig.prefix}:${key}`
        return await this.client.set(key, value, {
            EX: timeout
        })
    }
    async get(key, opt){
        await this.init()
        key = `${redisConfig.prefix}:${key}`
        const value = await this.client.get(key)
        if (value && opt) {
            const {renew, timeout, chance} = opt
            if (renew && Math.ceil(Math.random() * chance) === chance) {
                await this.client.expire(key, timeout)
            }
        }
        return value
    }
    async del(key) {
        await this.init()
        key = `${redisConfig.prefix}:${key}`
        return await this.client.del(key)
    }
    async push(key, value, timeout=600) {
        if (typeof value === 'object') {
            value = JSON.stringify(value)
        }
        await this.init()
        key = `${redisConfig.prefix}:${key}`
        await this.client.rPush(key, value)
        await this.client.expire(key, timeout)
    }
    async sAdd(key, value, timeout=600) {
        if (typeof value !== 'string') {
            value = JSON.stringify(value)
        }
        await this.init()
        key = `${redisConfig.prefix}:${key}`
        await this.client.sAdd(key, value)
        await this.client.expire(key, timeout)
    }
    async pop(key) {
        await this.init()
        key = `${redisConfig.prefix}:${key}`
        return await this.client.lPop(key)
    }
    async sPop(key) {
        await this.init()
        key = `${redisConfig.prefix}:${key}`
        return await this.client.sPop(key)
    }
}

module.exports = new BizRedis()
