const uuid = require('uuid')
const jwt = require('jsonwebtoken')
const jwtSecret = 'express-awesome'
const jwtExpiresIn = 3 * 24 * 3600

class BizJwt {
    set(req, res, obj) {
        if (!obj['jid']) {
            obj['jid'] = uuid.v4()
        }
        const authorization = jwt.sign(obj, jwtSecret, {expiresIn: jwtExpiresIn})
        res.cookie('jwt', authorization, { maxAge: jwtExpiresIn * 1000, httpOnly: true })
        return obj['jid']
    }

    get(req, res) {
        const authorization = req.cookies['jwt']
        if (!authorization) {
            throw new Error('未登录')
        }
        try {
            const obj = jwt.verify(authorization, jwtSecret, {expiresIn: jwtExpiresIn})
            if (Math.random() * 100 < 20) {
                const newObj = {...obj}
                delete newObj.exp
                delete newObj.iat
                this.set(req, res, newObj)
            }
            return obj
        } catch (e) {
            throw new Error('未登录')
        }
    }

    invoke(req, res) {
        const authorization = req.cookies['jwt']
        if (authorization) {
            res.cookie('jwt', '', {maxAge: 0, httpOnly: true})
        }
    }
}
module.exports = new BizJwt()
