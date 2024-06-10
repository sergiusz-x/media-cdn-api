const path = require("path")
require('dotenv').config({ path: path.join(__dirname, "../../.env") })
const webhooks_data = require("./webhooks.json")
const bot_tokens = require("./bot_tokens.json")

module.exports = {
    port_http: process.env.PORT_HTTP || 3000,
    port_https: process.env.PORT_HTTPS || 3001,
    webhooks_data: webhooks_data,
    mysql_db_config: {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD || "",
        database: process.env.MYSQL_DATABASE,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    },
    bot_tokens: bot_tokens.tokens
}