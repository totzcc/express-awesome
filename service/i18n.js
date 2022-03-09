const en = require('./en.json')
class I18n {
    t(req, str){
        const lang = req.header('Accept-Language')
        if (!lang || lang.startsWith('zh')) {
            return str
        }
        return en[str] || str
    }
}
module.exports = new I18n()
