const crypto = require("crypto")
//
function wait(ms) {
    if(ms == 0) return
    return new Promise(async (res) => {
        setTimeout(() => {
            res()
        }, ms)
    })
}
//
function random_hash() {
    const hash = crypto.createHash("sha256")
    hash.update(`${Date.now()}${String(Math.random())}`)
    const hashHex = hash.digest("hex")
    return hashHex
}
//
module.exports = { wait, random_hash }