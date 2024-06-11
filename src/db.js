const mysql = require("mysql2/promise")
const Logger = require("./utils/logger")
const logger = new Logger({ file: __filename })
const { mysql_db_config } = require("./config/config")
//
let pool, active_pool = false
let prob_reconnect_db = 0
//
/**
 * Creates MySQL connection
 */
async function handle_db_connection() {
    pool = mysql.createPool(mysql_db_config)
    //
    try {
        const connection = await pool.getConnection()
        logger.log(`Successful connection to the database`)
        connection.release()
        active_pool = true
        prob_reconnect_db = 0
        //
        connection.on("error", err => {
            logger.error("Connection to the database has been broken", err)
            if(err.code == "ER_PARSE_ERROR") return
            active_pool = false
            prob_reconnect_db++
            handle_db_connection()
        })
    } catch (error) {
        if(prob_reconnect_db >= 5) {
            logger.error(`5 unsuccessful attempts to connect to the database were made`)
            throw error
        }
        logger.error(`Failed to connect to the database`, error)
        //
        active_pool = false
        prob_reconnect_db++
        setTimeout(() => {
            handle_db_connection()
        }, 5000)
    }
}
//
/**
 * Returns current database connection
 * @returns {Promise<mysql.Connection>}
 */
function return_current_db_connection() {
    return new Promise(async (res, err) => {
        if(active_pool) return res(pool)
        //
        let interwal
        interwal = setInterval(() => {
            if(active_pool) res(pool)
            return clearInterval(interwal)
        }, 100)
    })
}
//
module.exports = { handle_db_connection, return_current_db_connection }