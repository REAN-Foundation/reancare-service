export class Seeder {

    private static _instance: Seeder = null;

    private constructor() {
    }

    public static instance() {
        return this._instance || (this._instance = new this());
    }
    
    public init = async () => {
        return new Promise((resolve, reject) => {
            try {


                resolve(true);

            } catch (error) {
                reject(error);
            }
        });
    };
}
