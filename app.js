const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    res.header('X-Up', process.uptime().toFixed(2) + '')
    res.header('X-Ts', Date.now() + '')
    res.header('Access-Control-Allow-Origin', req.header('Origin') || '*')
    res.header('Access-Control-Allow-Headers', ['Content-Type'].join(','))
    res.header('Access-Control-Allow-Methods', '*')
    res.header('Access-Control-Allow-Credentials', 'true')
    next()
});
[
    require('./routes/router-user')
].forEach(handler => {
    const contextPath = process.env.CONTEXT_PATH || ''
    for (const handlerKey in handler) {
        const handlerValue = handler[handlerKey]
        const systemStatus = (res ,st) => {
            if (!res.finished) {
                res.header('X-Time', Date.now() - st)
            }
        }
        const sendSuccess = (res, data) => {
            if (!res.finished) {
                if (data === undefined) {
                    res.send('')
                } else {
                    if (typeof(data) === 'string' && data.startsWith('<')) {
                        res.send(data)
                    } else {
                        res.send({
                            code: 0,
                            data
                        })
                    }
                }
            }
        }
        const sendError = (res, e) => {
            if (e.message.indexOf('wtf') !== -1) {
                console.error(e)
            }
            res.send({
                code: 1,
                error: {
                    ...e,
                    message: e.message
                }
            })
        }
        const requestHandler = async (req, res) => {
            const st = Date.now()
            try {
                const value = handlerValue(req, res)
                systemStatus(res, st)
                if (value instanceof Promise) {
                    sendSuccess(res, await value, st)
                } else {
                    sendSuccess(res, value, st)
                }
            } catch (e) {
                systemStatus(res, st)
                sendError(res ,e, st)
            }
        }
        const paths = handlerKey.split(' ')
        let reqPath = contextPath + handlerKey
        if (paths.length === 2) {
            reqPath = contextPath + paths[1]
            app[paths[0].toLowerCase()](reqPath, requestHandler)
        } else {
            app.all(reqPath, requestHandler)
        }
    }
})
app.use((req, res) => {
    res.header('X-Up', process.uptime().toFixed(2))
    if (req.method === 'OPTIONS') {
        res.send('')
    } else {
        res.send({
            code: 1,
            error: {message: 'api path not found'}
        })
    }
})
module.exports = app;
