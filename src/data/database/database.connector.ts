import 'reflect-metadata';
import { IDatabaseConnector } from '../../interfaces/database.connector.interface';
import { injectable, inject } from "tsyringe";
import { Logger } from '../../common/logger';

////////////////////////////////////////////////////////////////////////

@injectable()
export class DatabaseConnector {
    
    constructor(@inject('IDatabaseConnector') private _db: IDatabaseConnector) {}

    public init = async (): Promise<boolean> => {
        return new Promise(async (resolve, reject) => {
            try {
                await this._db.connect();
                resolve(true);
            } catch (error) {
                
                reject(error);
            }
        });
    };

    public sync = async (): Promise<boolean> => {
        try {
            await this._db.sync();
            return true;
        } catch (error) {
            Logger.instance().log('Sync database error: ' + error.message);
            //reject(error);
    }
    };

    public createDatabase = async (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            try {
                this._db.createDatabase();
                resolve(true);
            } catch (error) {
                Logger.instance().log('Create database error: ' + error.message);
                //reject(error);
            }
        });
    };

    public dropDatabase = async (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            try {
                this._db.dropDatabase();
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    };

    public migrate = async (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            try {
                this._db.migrate();
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    };

    public executeQuery = async (query: string): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            try {
                this._db.executeQuery(query);
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    };
}



////////////////////////////////////////////////////////////////////////
