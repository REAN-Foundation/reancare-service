
const mysql = require('mysql2');
import { Logger } from '../../../../common/logger';
import { DbConfig } from '../database.config';

////////////////////////////////////////////////////////////////

export class MysqlClient {
    
    public static createDb = async () => {
        try {
            const config = DbConfig.config;

            //var query = `CREATE DATABASE ${config.database} CHARACTER SET utf8 COLLATE utf8_general_ci;`;
            const query = `CREATE DATABASE ${config.database}`;
            await MysqlClient.executeQuery(query);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public static dropDb = async () => {
        try {
            const config = DbConfig.config;
            const query = `DROP DATABASE IF EXISTS ${config.database}`;
            await MysqlClient.executeQuery(query);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public static executeQuery = (query): Promise<boolean> => {

        return new Promise((resolve, reject) => {
            try {
                const config = DbConfig.config;
    
                const connection = mysql.createConnection({
                    host     : config.host,
                    user     : config.username,
                    password : config.password,
                });
    
                connection.connect(function (err) {
                    if (err) {
                        throw err;
                    }

                    //Logger.instance().log('Connected!');
                    connection.query(query, function (err, result) {
                        if (err) {
                            Logger.instance().log(err.message);

                            //throw err;
                        }
                        resolve(true);
                    });
                });

            } catch (error) {
                Logger.instance().log(error.message);

                //reject(false);
            }
        });
        
    };

}

