import 'reflect-metadata';
import { IDatabaseConnector } from './database.connector.interface';
import { injectable, inject } from 'tsyringe';
import { Logger } from '../common/logger';

////////////////////////////////////////////////////////////////////////

@injectable()
export class DatabaseConnector {
    
    constructor(@inject('IDatabaseConnector') private _db: IDatabaseConnector) {}

    public init = async (): Promise<boolean> => {
        try {
            await this._db.connect();
            return true;
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

    public createDatabase = async (): Promise<boolean> => {
        try {
            await this._db.createDatabase();
            return true;
        } catch (error) {
            Logger.instance().log('Create database error: ' + error.message);
            return false;
        }
    };

    public dropDatabase = async (): Promise<boolean> => {
        try {
            await this._db.dropDatabase();
            return true;
        } catch (error) {
            Logger.instance().log('Drop database error: ' + error.message);
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

    public executeQuery = async (query: string): Promise<boolean> => {
        try {
            await this._db.executeQuery(query);
            return true;
        } catch (error) {
            Logger.instance().log('Database query execution error: ' + error.message);
            return false;
        }
    };

}

////////////////////////////////////////////////////////////////////////
