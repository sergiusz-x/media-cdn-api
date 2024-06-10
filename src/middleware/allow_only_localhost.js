const ApiError = require("../models/ApiError")

const checkLocalhost = (req, res, next) => {
    let clientIp = req.connection.remoteAddress
    if(clientIp.startsWith("::ffff:")) {
        clientIp = clientIp.substr(7)
    }

    if (clientIp === '127.0.0.1' || clientIp === '::1') {
        next()
    } else {
        res.status(403).json(new ApiError("Forbidden: Only localhost is allowed"))
    }
}

module.exports = checkLocalhost
  