const CryptoJS = require("crypto-js");
const bodyAes = {
    key: CryptoJS.enc.Utf8.parse('express_aes_keys'),
    ops: {
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.ECB
    }
}
module.exports = function (req, res, next) {
    if (!req.path.endsWith('.do')) {
        next()
        return
    }
    const { adata } = req.body
    if (adata) {
        try {
            const decodeData = CryptoJS.AES.decrypt(adata, bodyAes.key, bodyAes.ops).toString(CryptoJS.enc.Utf8)
            req.body = JSON.parse(decodeData)
        } catch (e) {
            res.send('403', 403)
            return
        }
    }
    next()
}
