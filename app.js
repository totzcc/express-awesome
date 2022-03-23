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
app.use(require('./routes/anti-filter'));
[
    require('./routes/router-user'),
].forEach(handler => {
    const contextPath = process.env.CONTEXT_PATH || ''
    for (const handlerKey in handler) {
        const handlerValue = handler[handlerKey]
        const systemStatus = (st) => {
            return {
                time: Date.now() - st,
                ts: Date.now(),
                up: process.uptime().toFixed(2)
            }
        }
        const sendSuccess = (res, data, st) => {
            if (data === undefined && !res.finished) {
                res.send('')
            } else {
                res.send({
                    code: 0,
                    data,
                    extra: systemStatus(st)
                })
            }
        }
        const sendError = (res, e, st) => {
            console.error(e)
            res.send({
                code: 1,
                error: {
                    ...e,
                    message: e.message
                },
                extra: systemStatus(st)
            })
        }
        const requestHandler = async (req, res) => {
            res.header('Access-Control-Allow-Origin', '*')
            const st = Date.now()
            try {
                const value = handlerValue(req, res)
                if (value instanceof Promise) {
                    sendSuccess(res, await value, st)
                } else {
                    sendSuccess(res, value, st)
                }
            } catch (e) {
                sendError(res ,e, st)
            }
        }
        const paths = handlerKey.split(' ')
        if (paths.length === 2) {
            app[paths[0].toLowerCase()](contextPath + paths[1], requestHandler)
        } else {
            app.all(contextPath + handlerKey, requestHandler)
        }
    }
})
module.exports = app;
