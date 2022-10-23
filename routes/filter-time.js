module.exports = function (req, res, next) {
    if (!req.path.endsWith('.do')) {
        next()
        return
    }
    const { sign='' } = req.query
    const diffTime = Math.abs(Date.now() - parseInt(sign.split('-')[0]))
    if (isNaN(diffTime) || diffTime > 60000) {
        res.send('403', 403)
    } else {
        next()
    }
}
