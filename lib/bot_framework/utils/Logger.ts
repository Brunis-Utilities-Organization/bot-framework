export class Logger {
    static logDebug: boolean = false
    static logFormat: string = "[%t] [%l/%n] %m"

    loggerName: string
    logDebugForThisLogger: boolean

    constructor(loggerName: string, debug?: boolean) {
        this.loggerName = loggerName
        this.logDebugForThisLogger = debug || Logger.logDebug
    }

    info(message: string) {
        const formattedString = Logger.logFormat.replace("%t", new Date().toISOString()).replace("%l", this.loggerName).replace("%n", "INFO").replace("%m", message)
        
    }
}