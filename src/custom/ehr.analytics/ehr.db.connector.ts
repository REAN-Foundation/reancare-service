import { Dialect } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Logger } from '../../common/logger';
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

    public static executeQuery = async (query: string) => {
        try {
            const client = EHRDbConnector.getClient();
            await client.executeQuery(query);
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
        }
        return false;
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
