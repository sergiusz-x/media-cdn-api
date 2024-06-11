const path = require("path")
const main_folder_path = path.join(__dirname, "../")
//
class Logger {
    constructor(options = {}) {
        this.file = options.file || null
    }
    //
    log(...args) {
        this._logMessage("log", ...args)
    }
    //
    error(...args) {
        this._logMessage("error", ...args)
    }
    //
    _logMessage(level, ...args) {
        const time_log = new Date().toLocaleString("pl-PL", { hour12: false })
        //
        let file_log = ""
        if(this.file) {
            file_log = `[${path.relative(main_folder_path, this.file)}]`
        }
        //
        const logLine = `[${time_log}]${file_log}[${level}]\n`

        console.log(logLine, ...args)
    }
}
//
module.exports = Logger