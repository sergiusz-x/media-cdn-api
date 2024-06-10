const multer = require('multer')
const ApiError = require("../models/ApiError")

const errorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if(err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json(new ApiError("File size exceeds limit"))
        }
    } else if(err) {
        return res.status(400).json(new ApiError(err.message))
    }
    next()
}

module.exports = errorHandler;
