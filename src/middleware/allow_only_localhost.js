const ApiError = require("../models/ApiError")
//
const checkLocalhost = (req, res, next) => {
    let client_ip = req.connection.remoteAddress
    //
    if(client_ip.startsWith("::ffff:")) {
        client_ip = client_ip.substr(7)
    }
    //
    if (client_ip === "127.0.0.1" || client_ip === "::1") {
        next()
    } else {
        res.status(403).json(new ApiError("Forbidden: Only localhost is allowed"))
    }
}
//
module.exports = checkLocalhost
  