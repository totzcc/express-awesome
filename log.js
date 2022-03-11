const log4js = require('log4js')
log4js.configure({
    appenders: {
        appendCosnole: {type: 'console'},
        appendFile: { type: 'file', filename: 'logs/access.log'}
    },
    categories: {
        default: { appenders: ['appendCosnole', 'appendFile'], level: 'all' }
    }
});
const logger = log4js.getLogger();
module.exports = {
    use(app) {
        app.use(log4js.connectLogger(logger, { level: 'debug', format: '[:method :url :status :response-timems :remote-addr]-[:user-agent]'}))
    }
}
console.error = logger.error.bind(logger)
console.log = logger.info.bind(logger)
