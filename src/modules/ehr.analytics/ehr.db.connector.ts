import { Dialect } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Logger } from '../../common/logger';
import { MysqlClient } from '../../database/sql/sequelize/dialect.clients/mysql.client';
import { PostgresqlClient } from '../../database/sql/sequelize/dialect.clients/postgresql.client';
import { DatabaseDialect } from '../../domain.types/miscellaneous/system.types';

//////////////////////////////////////////////////////////////

export class EHRDbConnector {

    private static _sequelize: Sequelize;

    static config = () => {

        const dialect = process.env.DB_DIALECT as DatabaseDialect;

        return {
            username : process.env.DB_USER_NAME,
            password : process.env.DB_USER_PASSWORD,
            database : process.env.DB_NAME_EHR_INSIGHTS,
            host     : process.env.DB_HOST,
            dialect  : dialect,
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
            const dialect: DatabaseDialect = process.env.DB_DIALECT as DatabaseDialect;
            const modelsPath = [
                __dirname + '/models',
            ];
            const config = EHRDbConnector.config();
            const options = {
                host    : config.host,
                dialect : dialect as Dialect,
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
            Logger.instance().log(`EHR Insights Database dialect: ${config.dialect}`);
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

    private static getClient() {

        const dialect = process.env.DB_DIALECT as DatabaseDialect;

        if (dialect === 'mysql') {
            return MysqlClient;
        }
        if (dialect === 'postgres') {
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
