const express = require("express")
//
const image_routes = require("./routes/image")
const multer_error = require("./middleware/multer_error")
const allow_only_localhost = require("./middleware/allow_only_localhost")
//
const app = express()

app.use(express.json())
app.use(allow_only_localhost)

app.use("/api/v1/image", image_routes)
//
app.use(multer_error)


module.exports = app
