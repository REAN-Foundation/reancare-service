export class Scheduler {

    private static _instance: Scheduler = null;

    private constructor() {
    }

    public static instance() {
        return this._instance || (this._instance = new this());
    }
    
    public schedule = async () => {
        return new Promise((resolve, reject) => {
            try {


                resolve(true);

            } catch (error) {
                reject(error);
            }
        });
    };
}
