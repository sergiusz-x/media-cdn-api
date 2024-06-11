const { Router } = require("express")
//
const image_controller = require("../controllers/image")
const multer_config = require("../utils/multer")
//
const router = Router()
//
router.post(`/save`, multer_config.upload.single("image"), image_controller.save)
router.get(`/get/:id`, image_controller.get)
router.get(`/check/:id`, image_controller.check)
//
module.exports = router