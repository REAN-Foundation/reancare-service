import { Logger } from '../common/logger';

///////////////////////////////////////////////////////////////////////////
export class Scheduler {

    private static _instance: Scheduler = null;

    private constructor() {
        Logger.instance().log('Initializing the schedular.');
    }

    public static instance(): Scheduler {
        return this._instance || (this._instance = new this());
    }

    public schedule = async (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            try {
                resolve(true);
            } catch (error) {
                Logger.instance().log('Error initializing the schedular.: ' + error.message);
                reject(false);
            }
        });
    };

}
