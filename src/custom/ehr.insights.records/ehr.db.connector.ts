import { Dialect } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Logger } from '../../common/logger';
import mysql from 'mysql2';

//////////////////////////////////////////////////////////////

export class EHRDbConnector {

    static _sequelize: Sequelize = null;

    static _config = {
        username : process.env.DB_USER_NAME,
        password : process.env.DB_USER_PASSWORD,
        database : `ehr_insights`,
        host     : process.env.DB_HOST,
        dialect  : 'mysql',
        pool     : {
            max     : 20,
            min     : 0,
            acquire : 30000,
            idle    : 10000,
        },
    }

    public static connect = async (): Promise<boolean> => {
        try {
            const dialect: Dialect = 'mysql';
            const modelsPath = [
                __dirname + '/models',
            ];
            const options = {
                host    : EHRDbConnector._config.host,
                dialect : dialect,
                models  : modelsPath,
                pool    : {
                    max     : EHRDbConnector._config.pool.max,
                    min     : EHRDbConnector._config.pool.min,
                    acquire : EHRDbConnector._config.pool.acquire,
                    idle    : EHRDbConnector._config.pool.idle,
                },
                logging : false, //TODO: Please provide a function here to handle logging...
            };

            const sequelize = new Sequelize(
                EHRDbConnector._config.database,
                EHRDbConnector._config.username,
                EHRDbConnector._config.password, options);

            EHRDbConnector._sequelize = sequelize;

            Logger.instance().log(`Connecting to EHR Insights database '${EHRDbConnector._config.database}' ...`);
            Logger.instance().log(`EHR Insights Database flavour: ${EHRDbConnector._config.dialect}`);
            Logger.instance().log(`EHR Insights Database host: ${EHRDbConnector._config.host}`);

            await EHRDbConnector.createDatabase();
            await EHRDbConnector._sequelize.authenticate();
            await EHRDbConnector._sequelize.sync({ alter: true });

            Logger.instance().log(`Connected to EHR Insights database.`);

            return true;

        } catch (error) {
            Logger.instance().log(error.message);
            return false;
        }
    };

    public static executeQuery = (query): Promise<boolean> => {

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return new Promise((resolve, reject) => {
            try {
                const connection = mysql.createConnection({
                    host     : EHRDbConnector._config.host,
                    user     : EHRDbConnector._config.username,
                    password : EHRDbConnector._config.password,
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

    public static createDatabase = async () => {
        try {
            const query = `CREATE DATABASE ${EHRDbConnector._config.database}`;
            await EHRDbConnector.executeQuery(query);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    //Drops DB if exists
    public static dropDatabase = async () => {
        try {
            const query = `DROP DATABASE IF EXISTS ${EHRDbConnector._config.database}`;
            await EHRDbConnector.executeQuery(query);
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
        }
        return false;
    };

}
