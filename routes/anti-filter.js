const qs = require("querystring");
module.exports = (req, res, next) => {
    if (req.path.indexOf('api/v2/wx/receive') === -1) {
        const tts = req.query.tts || req.cookies['tts'] || 0
        const now = Date.now()
        if (Math.abs(now - tts) > 120000) {
            res.cookie('tts', now)
            if (req.method === 'GET') {
                req.query['tts'] = now
                res.redirect(req.path + '?' + qs.stringify(req.query))
            } else {
                res.send({
                    code: 1,
                    error: {
                        message: '网络不稳定, 请重试'
                    }
                })
            }
            return
        }
    }
    next()
}
