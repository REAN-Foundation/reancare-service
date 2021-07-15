
const mysql = require('mysql2');
import { Logger } from '../../../../common/logger';
import { DbConfig } from '../../../../configs/db.config';

////////////////////////////////////////////////////////////////

export class MysqlClient {
    
    public static createDb = async () => {
        try {
            const config = DbConfig.config;
            var query = `CREATE DATABASE ${config.database}`;
            await MysqlClient.executeQuery(query);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public static dropDb = async () => {
        try {
            const config = DbConfig.config;
            var query = `DROP DATABASE IF EXISTS ${config.database}`;
            await MysqlClient.executeQuery(query);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public static executeQuery = (query): Promise<boolean> => {

        return new Promise((resolve, reject) => {
            try {
                const config = DbConfig.config;
    
                var connection = mysql.createConnection({
                    host: config.host,
                    user: config.username,
                    password: config.password,
                });
    
                connection.connect(function (err) {
                    if (err) {
                        throw err;
                    }
                    //console.log('Connected!');
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

