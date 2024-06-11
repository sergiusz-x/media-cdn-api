const { send_image } = require("../services/send_webhooks")
const ApiError = require("../models/ApiError")
const ApiResponse = require("../models/ApiResponse")
const Logger = require("../utils/logger")
const logger = new Logger({ file: __filename })
const { return_current_db_connection } = require("../db")
const { fetch_image_from_channel } = require("../services/fetch_webhooks_images")
const Image = require("../models/Image")
const ImageCache = require("../utils/image_cache")
//
const image_cache = new ImageCache(100, 1000 * 60 * 10)
//
const save = async (req, res) => {
    if(!req.file) {
        return send_response(req, res, 400, new ApiError("No file attached"))
    }
    //
    try {
        const image_base64 = req.file.buffer.toString("base64")
        const webhook_saved_image = await send_image(image_base64)
        //
        const connection = await return_current_db_connection()
        const query = `INSERT INTO mediacdn_images (hash_id, timestamp_created, channel_id, message_id) VALUES (?,?,?,?)`
        const [result] = await connection.execute(query, webhook_saved_image.returnDbInsertArray())
        webhook_saved_image.fill({ database_id: result.insertId })
        //
        send_response(req, res, 200, new ApiResponse("Successfully saved image", webhook_saved_image.returnApiJson(false)))
        //
        image_cache.add_image(result.insertId, webhook_saved_image)
    } catch (error) {
        logger.error(error)
        send_response(req, res, 500, new ApiError("Internal server error"))
    }
    //
}

const get = async (req, res) => { 
    const image_id = parseInt(req.params.id, 10)
    let if_not_cache_image = req.query.cache === "false"
    //
    if(isNaN(image_id)) {
        return send_response(req, res, 400, new ApiError("Invalid image ID"))
    }
    //
    try {
        const connection = await return_current_db_connection()
        const [rows] = await connection.execute("SELECT * FROM mediacdn_images WHERE id = ?", [image_id])
        if(rows.length == 0) {
            return send_response(req, res, 404, new ApiError("Image not found"))
        }
        const row = rows[0]
        //
        let image = if_not_cache_image ? undefined : image_cache.get_image(row.id)
        if(!image) {
            image = new Image()
            image.fill_from_db_row(row)
            image = await fetch_image_from_channel(image)
            //
            image_cache.add_image(row.id, image)
        }
        //
        if(!image) throw new Error(`Image [${row?.id}] not fetched`)
        //
        send_response(req, res, 200, new ApiResponse("Successfully fetched image", image.returnApiJson(true)))
    } catch (error) {
        logger.error(error)
        send_response(req, res, 500, new ApiError("Internal server error"))
    }
}

const check = async (req, res) => { 
    const image_id = parseInt(req.params.id, 10)
    //
    if(isNaN(image_id)) {
        return send_response(req, res, 400, new ApiError("Invalid image ID"))
    }
    //
    try {
        const connection = await return_current_db_connection()
        const [rows] = await connection.execute("SELECT id FROM mediacdn_images WHERE id = ?", [image_id])
        if(rows.length > 0) {
            send_response(req, res, 200, new ApiResponse("Image exists"))
        } else {
            send_response(req, res, 404, new ApiError("Image not found"))
        }
    } catch (error) {
        logger.error(error)
        send_response(req, res, 500, new ApiError("Internal server error"))
    }
}
//
function send_response(req, res, status = 200, json = {}) {
    if(res.finished) {
        return logger.error(`Response already sent [${req.originalUrl}][${status}]:\n${json}`)
    }
    //
    res.status(status).json(json)
}

module.exports = { save, get, check }