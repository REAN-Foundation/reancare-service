import mysql, { Connection } from 'mysql2/promise';

import { Logger } from '../../../common/logger';
import { databaseConfig } from '../../../common/database.utils/database.config';
import { DatabaseSchemaType } from '../../../common/database.utils/database.config';

export class DatabaseConnector_Mysql {

    private connection: Connection = null;

    private static instance: DatabaseConnector_Mysql = null;
   
    private constructor() {}

    public static getInstance() {
        return this.instance || (this.instance = new DatabaseConnector_Mysql());
    }

    public connect = async (): Promise<any> => {
        try {
            if (!this.connection) {
                const config = databaseConfig(DatabaseSchemaType.Primary);
                this.connection = await mysql.createConnection({
                    database : config.DatabaseName,
                    host     : config.Host,
                    user     : config.Username,
                    password : config.Password,
                });
            }
           
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
