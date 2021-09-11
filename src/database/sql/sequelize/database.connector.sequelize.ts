import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize';
import { DbConfig } from './database.config';
import { Logger } from '../../../common/logger';
import { IDatabaseConnector } from '../../database.connector.interface';
import { PostgresqlClient } from './dialect.clients/postgresql.client';
import { MysqlClient } from './dialect.clients/mysql.client';
import { execSync } from 'child_process';
import { ConfigurationManager } from '../../../configs/configuration.manager';

//const execSync = require('child_process').execSync;

//////////////////////////////////////////////////////////////

export class DatabaseConnector_Sequelize implements IDatabaseConnector {

    private _sequelize: Sequelize = null;

    public connect = async (): Promise<boolean> => {

        try {
            const config = DbConfig.config;
            const dialect: Dialect = this.getDialect();
            const modelsPath = [
                __dirname + '/models',
                __dirname + '/models/biometrics/',
            ];
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

            const sequelize = new Sequelize(config.database, config.username, config.password, options);
            this._sequelize = sequelize;

            Logger.instance().log(`Connecting to database '${config.database}' ...`);
            Logger.instance().log(`Database flavour: ${config.dialect}`);
            Logger.instance().log(`Database host: ${config.host}`);

            await this.createDatabase();
            await this._sequelize.authenticate();
            await this._sequelize.sync({ alter: true });

            Logger.instance().log(`Connected to database.`);

            return true;

        } catch (error) {
            Logger.instance().log(error.message);
            return false;
        }

    };

    //Creates DB if does not exist
    public sync = async () => {
        try {
            await this._sequelize.sync({ force: true });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
        }
        return false;
    };

    //Creates DB if does not exist
    public createDatabase = async () => {
        try {
            const client = this.getClient();
            await client.createDb();
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
        }
        return false;
    };

    //Drops DB if exists
    public dropDatabase = async () => {
        try {
            const client = this.getClient();
            await client.dropDb();
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
        }
        return false;
    };

    //Drops DB if exists
    public executeQuery = async (query: string) => {
        try {
            const client = this.getClient();
            await client.executeQuery(query);
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
        }
        return false;
    };

    public migrate = async () => {
        try {
            const output = execSync('npx sequelize-cli db:migrate');

            const str = output.toString();
            Logger.instance().log('Database migrated successfully!');
            Logger.instance().log(str);

            return true;
        } catch (error) {
            Logger.instance().log(error.message);
        }
        return false;
    };

    //Private methods

    private getDialect(): Dialect {

        let dialect: Dialect = 'postgres';
        const flavour = ConfigurationManager.DatabaseFlavour();

        if (flavour === 'MySQL') {
            dialect = 'mysql';
        }
        if (flavour === 'PostGreSQL') {
            dialect = 'postgres';
        }

        return dialect;
    }

    private getClient() {

        const flavour = ConfigurationManager.DatabaseFlavour();

        if (flavour === 'MySQL') {
            return MysqlClient;
        }
        if (flavour === 'PostGreSQL') {
            return PostgresqlClient;
        }
        return PostgresqlClient;
    }

}
