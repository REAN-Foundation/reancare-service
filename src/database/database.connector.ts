import 'reflect-metadata';
import { IPrimaryDatabaseConnector } from './database.connector.interface';
import { injectable, inject } from 'tsyringe';
import { Logger } from '../common/logger';

////////////////////////////////////////////////////////////////////////

@injectable()
export class PrimaryDatabaseConnector {

    constructor(@inject('IPrimaryDatabaseConnector') private _db: IPrimaryDatabaseConnector) {}

    public init = async (): Promise<boolean> => {
        try {
            return await this._db.connect();
        } catch (error) {
            Logger.instance().log('Create database error: ' + error.message);
            return false;
        }
    };

    public sync = async (): Promise<boolean> => {
        try {
            await this._db.sync();
            return true;
        } catch (error) {
            Logger.instance().log('Sync database error: ' + error.message);
            return false;
        }
    };

    public migrate = async (): Promise<boolean> => {
        try {
            await this._db.migrate();
            return true;
        } catch (error) {
            Logger.instance().log('Migrate database error: ' + error.message);
            return false;
        }
    };

}

////////////////////////////////////////////////////////////////////////
