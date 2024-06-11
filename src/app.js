const express = require("express")
const morgan = require("morgan")
const rfs = require('rotating-file-stream')
//
const image_routes = require("./routes/image")
const multer_error = require("./middleware/multer_error")
const allow_only_localhost = require("./middleware/allow_only_localhost")
//
const app = express()
//
// Logs
const accessLogStream = rfs.createStream('logs.log', {
    interval: '1d',
    path: `${__dirname}/logs`,
    compress: 'gzip'
})
// Data | HTTP_v | Method | Refereer | IP | User | Autoryzacja | Res_length | Time | Total_time | Status | URL | User_agent
app.use(morgan(':date[iso] | :http-version | :method | :referrer | :remote-addr | :remote-user | :req[authorization] | :res[content-length] | :response-time[2]ms | :total-time[2]ms | :status | :url | :user-agent', { stream: accessLogStream }))
//
//
app.use(express.json())
app.use(allow_only_localhost)
app.use("/api/v1/image", image_routes)
app.use(multer_error)
//
// 404
const ApiError = require("./models/ApiError")
app.get("*", (req, res) => {
    res.status(404).json(new ApiError("Page not found"))
})
app.post("*", (req, res) => {
    res.status(404).json(new ApiError("Page not found"))
})
//
module.exports = app
