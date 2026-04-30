/* eslint-disable no-console */

export class Logger {
    
    private static _instance: Logger = null;

    private debugEnabled: boolean = false;

    private constructor() {
    }

    public static instance(): Logger {
        return this._instance || (this._instance = new this());
    }
    
    public setDebugEnabled = (enabled: boolean): void => {
        this.debugEnabled = enabled;
    };

    public log = (message: string): void => {
        if (process.env.NODE_ENV === 'test') {
            return;
        }
        const dateTime = new Date().toISOString();
        const temp_str = dateTime + '> ' + message;
        console.log(' ');
        console.log(temp_str);
    };
    
    public logDebug = (message: string, filename?: string, lineNumber?: number): void => {
        if (!this.debugEnabled) {
            return;
        }
        if (process.env.NODE_ENV === 'test') {
            return;
        }
        const dateTime = new Date().toISOString();
        const temp_str = dateTime + '>DEBUG: ' + filename + ':' + lineNumber + '> ' + message;
        console.log(' ');
        console.log(temp_str);
    };

    public error = (message: string, code: number, details: unknown): void => {
        if (process.env.NODE_ENV === 'test') {
            return;
        }
        const dateTime = new Date().toISOString();
        const err = {
            message : message,
            code    : code,
            details : details
        };
        const temp_str = dateTime + '> ' + JSON.stringify(err, null, '    ');
        console.log(' ');
        console.log(temp_str);
    };

}
