import { Dialect } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Logger } from '../../common/logger';
import mysql from 'mysql2';
import { ConfigurationManager } from '../../config/configuration.manager';
import { MysqlClient } from '../../database/sql/sequelize/dialect.clients/mysql.client';
import { PostgresqlClient } from '../../database/sql/sequelize/dialect.clients/postgresql.client';

//////////////////////////////////////////////////////////////

export class EHRDbConnector {

    private static _sequelize: Sequelize = null;

    static config = () => {

        return {
            username : process.env.DB_USER_NAME,
            password : process.env.DB_USER_PASSWORD,
            database : `ehr_insights`,
            host     : process.env.DB_HOST,
            dialect  : EHRDbConnector.getDialect(),
            pool     : {
                max     : 20,
                min     : 0,
                acquire : 30000,
                idle    : 10000,
            },
        };
    };

    public static connect = async (): Promise<boolean> => {
        try {
            const dialect: Dialect = EHRDbConnector.getDialect();
            const modelsPath = [
                __dirname + '/models',
            ];
            const config = EHRDbConnector.config();
            const options = {
                host    : config.host,
                dialect : dialect,
                models  : modelsPath,
                pool    : {
                    max     : config.pool.max,
                    min     : config.pool.min,
                    acquire : config.pool.acquire,
                    idle    : config.pool.idle,
                },
                logging : false, //TODO: Please provide a function here to handle logging...
            };

            const sequelize = new Sequelize(
                config.database,
                config.username,
                config.password, options);

            EHRDbConnector._sequelize = sequelize;

            Logger.instance().log(`Connecting to EHR Insights database '${config.database}' ...`);
            Logger.instance().log(`EHR Insights Database flavour: ${config.dialect}`);
            Logger.instance().log(`EHR Insights Database host: ${config.host}`);

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
                const config = EHRDbConnector.config();
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
            const config = EHRDbConnector.config();
            const query = `CREATE DATABASE ${config.database}`;
            await EHRDbConnector.executeQuery(query);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    private static getDialect(): Dialect {

        let dialect: Dialect = 'postgres';
        const flavour = ConfigurationManager.DatabaseFlavour();

        if (flavour === 'MySQL') {
            dialect = 'mysql';
        }
        if (flavour === 'PostgreSQL') {
            dialect = 'postgres';
        }

        return dialect;
    }

    private static getClient() {

        const flavour = ConfigurationManager.DatabaseFlavour();

        if (flavour === 'MySQL') {
            return MysqlClient;
        }
        if (flavour === 'PostgreSQL') {
            return PostgresqlClient;
        }
        return PostgresqlClient;
    }

    //Drops DB if exists
    public static dropDatabase = async () => {
        try {
            const config = EHRDbConnector.config();
            const query = `DROP DATABASE IF EXISTS ${config.database}`;
            await EHRDbConnector.executeQuery(query);
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
        }
        return false;
    };

}
