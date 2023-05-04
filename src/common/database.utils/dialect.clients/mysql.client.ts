
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mysql = require('mysql2');
import { Logger } from '../../logger';
import { DatabaseSchemaType, databaseConfig } from '../database.config';
import { IDatabaseClient } from './database.client.interface';

//////////////////////////////////////////////////////////////////////////////

export class MysqlClient implements IDatabaseClient {

    public createDb = async (schemaType: DatabaseSchemaType): Promise<boolean> => {
        try {
            const config = databaseConfig(schemaType);
            //var query = `CREATE DATABASE ${config.database} CHARACTER SET utf8 COLLATE utf8_general_ci;`;
            const query = `CREATE DATABASE ${config.DatabaseName}`;
            return await this.executeQuery(schemaType, query);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public dropDb = async (schemaType: DatabaseSchemaType): Promise<boolean> => {
        try {
            const config = databaseConfig(schemaType);
            const query = `DROP DATABASE IF EXISTS ${config.DatabaseName}`;
            return await this.executeQuery(schemaType, query);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public executeQuery = (schemaType: DatabaseSchemaType, query: string): Promise<boolean> => {

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return new Promise((resolve, reject) => {
            try {
                const config = databaseConfig(schemaType);

                const connection = mysql.createConnection({
                    host     : config.Host,
                    user     : config.Username,
                    password : config.Password,
                });

                connection.connect(function (err) {
                    if (err) {
                        throw err;
                    }

                    //Logger.instance().log('Connected!');
                    connection.query(query, function (err, result) {
                        if (err) {
                            Logger.instance().log(err.message);

                            var str = (result !== undefined && result !== null) ? result.toString() : null;
                            if (str != null){
                                Logger.instance().log(str);
                            }
                            else {
                                Logger.instance().log(`Query: ${query}`);
                            }
                        }
                        resolve(true);
                    });
                });

            } catch (error) {
                Logger.instance().log(error.message);
            }
        });

    };

}
