const http = require('http')
const https = require('https')
const fs = require('fs')
const express = require('express')
const app = require('./app')
const config = require('./config/config')
//
const send_webhooks = require("./services/send_webhooks")
const fetch_webhooks_images = require("./services/fetch_webhooks_images")
const db_mysql = require("./db")
//
const httpServer = http.createServer(app)

const PORT_HTTP = config.port_http

httpServer.listen(PORT_HTTP, () => {
    console.log(`HTTP Server running on port ${PORT_HTTP}`)
})
//
db_mysql.handle_db_connection()
send_webhooks.start()
fetch_webhooks_images.start()