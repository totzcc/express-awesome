const bizJwt = require('../service/biz-jwt')
module.exports = {
    'post /api/user/login': (req, res)=>{
        const { username, password } = req.body
        if (!username || !password) {
            throw new Error('wtf')
        }
        if (username === 'admin' && password === '123') {
            return bizJwt.set(req, res, { username, password, rd: Math.random()})
        } else {
            throw new Error('login has error')
        }
    },
    'get /api/user/info': (req, res)=>{
       return bizJwt.get(req, res)
    },

    '/api/user/logout': (req, res)=>{
        bizJwt.invoke(req, res)
        return ''
    },
}
