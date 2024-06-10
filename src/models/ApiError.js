const ApiResponse = require("./ApiResponse")
//
class ApiError extends ApiResponse {
    constructor(message, data = {}) {
        super(message, data)
        this.error = true
    }
}
//
module.exports = ApiError