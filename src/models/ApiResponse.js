class ApiResponse {
    constructor(message, data = {}) {
        this.error = false
        this.message = message
        this.data = data
    }
}
//
module.exports = ApiResponse