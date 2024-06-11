const multer = require("multer")
const path = require("path")
//
const ALLOWED_EXTENSIONS = ["png", "jpg", "jpeg"]
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
//
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if(ALLOWED_EXTENSIONS.includes(ext.slice(1))) {
        cb(null, true)
    } else {
        cb(new Error("File type not allowed"), false)
    }
}
//
const upload = multer({
    fileFilter: fileFilter,
    limits: { fileSize: MAX_FILE_SIZE }
})
//
module.exports = { upload }