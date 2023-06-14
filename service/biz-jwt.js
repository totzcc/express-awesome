const uuid = require('uuid')
const jwt = require('jsonwebtoken')
const jwtSecret = 'express'
const jwtExpiresIn = 7 * 24 * 3600

class BizJwt {
    set(req, res, obj) {
        if (!obj['jid']) {
            obj['jid'] = uuid.v4()
        }
        delete obj.exp
        delete obj.iat
        const authorization = jwt.sign(obj, jwtSecret, {expiresIn: jwtExpiresIn})
        res.header('Authorization', `Bearer ${authorization}`)
        return obj['jid']
    }

    get(req, res) {
        let authorization = req.header('Authorization') || ''
        authorization = authorization.replace('Bearer ', '')
        if (!authorization) {
            throw new Error('wtf wtf need login')
        }
        try {
            const obj = jwt.verify(authorization, jwtSecret, { expiresIn: jwtExpiresIn })
            if (Math.random() * 100 < 20) {
                this.set(req, res, obj)
            }
            return obj
        } catch (e) {
            throw new Error('wtf wtf need login')
        }
    }

    invoke(req, res) {
        res.header('Authorization', '')
    }
}
module.exports = new BizJwt()