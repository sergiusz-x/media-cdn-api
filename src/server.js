const http = require("http")
const app = require("./app")
const config = require("./config/config")
const Logger = require("./utils/logger")
const logger = new Logger({ file: __filename })
//
const send_webhooks = require("./services/send_webhooks")
const fetch_webhooks_images = require("./services/fetch_webhooks_images")
const db_mysql = require("./db")
//
const http_server = http.createServer(app)
const PORT_HTTP = config.port_http
//
http_server.listen(PORT_HTTP, () => {
    logger.log(`HTTP Server running on port :${PORT_HTTP}`)
})
//
db_mysql.handle_db_connection()
send_webhooks.start()
fetch_webhooks_images.start()