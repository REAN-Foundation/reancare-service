import mysql, { Connection } from 'mysql2/promise';
import { DatabaseSchemaType, databaseConfig } from './database.config';
import { Logger } from '../logger';

export class MySQL {

    connection: Connection = null;

    // constructor (schemaType: DatabaseSchemaType) {
    //     const config = databaseConfig(schemaType);
    //     this.connection = await mysql.createConnection({
    //         database : config.DatabaseName,
    //         host     : config.Host,
    //         user     : config.Username,
    //         password : config.Password,
    //     });
    // }

    public connect = async (): Promise<any> => {
        try {
            const config = databaseConfig(DatabaseSchemaType.Primary);
            this.connection = await mysql.createConnection({
                database : config.DatabaseName,
                host     : config.Host,
                user     : config.Username,
                password : config.Password,
            });
        } catch (error) {
            Logger.instance().log(error.message);
            Logger.instance().log(`Error trace: ${error.stack}`);
        }
    };

    public executeQuery = async (query: string): Promise<any> => {
        try {
            const result = await this.connection.query(query);
            return result;
        } catch (error) {
            Logger.instance().log(error.message);
            Logger.instance().log(`Error trace: ${error.stack}`);
        }
        return null;
    };

}
