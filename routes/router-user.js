const bizSession = require('../service/biz-session')
module.exports = {
    '/api/user/login': (req, res)=>{
        const { username, password } = req.body
        if (!username || !password) {
            throw new Error('wtf')
        }
        if (username === 'admin' && password === '123') {
            return bizSession.set(req, res, { username, password, rd: Math.random()})
        } else {
            throw new Error('login has error')
        }
    },
    '/api/user/info': (req, res)=>{
       return bizSession.get(req, res)
    },
    '/api/user/info2': (req, res)=>{
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(bizSession.get(req, res))
                // reject(new Error('aaa'))
            }, 1000)
        })
    },
    '/api/user/logout': (req, res)=>{
        bizSession.invoke(req, res)
        return ''
    },
}
