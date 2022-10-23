const uuid = require('uuid')
const jwt = require('jsonwebtoken')
const jwtSecret = 'express-awesome'
const jwtExpiresIn = 3 * 24 * 3600

class BizJwt {
    set(req, res, obj) {
        if (!obj['jid']) {
            obj['jid'] = uuid.v4()
        }
        delete obj.exp
        delete obj.iat
        const authorization = jwt.sign(obj, jwtSecret, {expiresIn: jwtExpiresIn})
        let sameSite = 'lax'
        if (req.header('user-agent').toLowerCase().indexOf('electron') !== -1) {
            sameSite = 'none'
        }
        res.cookie('jwt', authorization, {
            maxAge: jwtExpiresIn * 1000, httpOnly: true,
            sameSite, secure: true
        })
        res.header('x-jwt', authorization)
        return obj['jid']
    }

    get(req, res) {
        const authorization = req.header('x-jwt') || req.cookies['jwt']
        if (!authorization) {
            throw new Error('wtf 未登录')
        }
        try {
            let sameSite = 'lax'
            if (req.header('user-agent').toLowerCase().indexOf('electron') !== -1) {
                sameSite = 'none'
            }
            res.cookie('jwt', authorization, {
                maxAge: jwtExpiresIn * 1000, httpOnly: true,
                sameSite, secure: true
            })
            if (Math.random() * 100 < 20) {
                this.set(req, res, obj)
            }
            return obj
        } catch (e) {
            throw new Error('wtf 未登录')
        }
    }

    invoke(req, res) {
        res.header('x-jwt', '')
        res.cookie('jwt', '', {maxAge: 0, httpOnly: true, sameSite: 'none', secure: true})
    }
}
module.exports = new BizJwt()
