
export class Logger {
    
    private static _instance: Logger = null;

    private constructor() {
    }

    public static instance() {
        return this._instance || (this._instance = new this());
    }
    
    public log = (message) => {
        const dateTime = new Date().toISOString();
        var temp_str = dateTime + '> ' + message;
        console.log(' ');
        console.log(temp_str);
    }
    
    public error = (message, code, details) => {
        const dateTime = new Date().toISOString();
        var err = {
            message: message,
            code: code,
            details: details
        };
        var temp_str = dateTime + '> ' + JSON.stringify(err, null, '    ');
        console.log(' ');
        console.log(temp_str);
    }
}