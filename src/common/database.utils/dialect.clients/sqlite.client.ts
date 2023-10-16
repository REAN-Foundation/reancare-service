import sqlite3 from 'sqlite3';
import * as fs from 'fs';
import { Logger } from '../../logger';
import { IDatabaseClient } from './database.client.interface';
import { DatabaseSchemaType, databaseConfig } from '../database.config';

////////////////////////////////////////////////////////////////

export class SQLiteClient  implements IDatabaseClient {

    public createDb = async (schemaType: DatabaseSchemaType): Promise<boolean> => {
        try {
            const config = databaseConfig(schemaType);
            const db = new sqlite3.Database(config.DatabaseName, (err) => {
                if (err) {
                    // eslint-disable-next-line no-console
                    console.log('Error connecting to the database:', err.message);
                } else {
                    // eslint-disable-next-line no-console
                    console.log('Connected to the SQLite database.');
                }
            });
            return db != null;
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public dropDb = async (schemaType: DatabaseSchemaType): Promise<boolean> => {
        try {
            const config = databaseConfig(schemaType);
            const databaseName = config.DatabaseName;
            fs.unlinkSync(databaseName);
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public executeQuery = async (schemaType: DatabaseSchemaType, query: string): Promise<boolean> => {
        try {
            const config = databaseConfig(schemaType);
            const db = new sqlite3.Database(config.DatabaseName);
            db.run(query, (err) => {
                Logger.instance().log(err.message);
                return false;
            });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

}
