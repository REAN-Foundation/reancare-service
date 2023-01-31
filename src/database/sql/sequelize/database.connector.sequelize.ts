import { execSync } from 'child_process';
import { Dialect } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Logger } from '../../../common/logger';
import { ConfigurationManager } from '../../../config/configuration.manager';
import { IDatabaseConnector } from '../../database.connector.interface';
import { DbConfig } from './database.config';
import { MysqlClient } from './dialect.clients/mysql.client';
import { PostgresqlClient } from './dialect.clients/postgresql.client';
import * as fs from 'fs';
import * as path from 'path';

//////////////////////////////////////////////////////////////

export class DatabaseConnector_Sequelize implements IDatabaseConnector {

    private _sequelize: Sequelize = null;

    public connect = async (): Promise<boolean> => {

        try {
            const config = DbConfig.config;
            const dialect: Dialect = this.getDialect();
            const modelsFolder = path.join(__dirname, '/models');
            const modelsPath = getFoldersRecursively(modelsFolder);
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
            await this._sequelize.sync({ force: false, alter: true });

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
            await this._sequelize.sync({ alter: true });
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

function getFoldersRecursively(location: string) {
    const items = fs.readdirSync(location, { withFileTypes: true });
    let paths = [];
    for (const item of items) {
        if (item.isDirectory()) {
            const fullPath = path.join(location, item.name);
            const childrenPaths = getFoldersRecursively(fullPath);
            paths = [
                ...paths,
                fullPath,
                ...childrenPaths,
            ];
        }
    }
    return paths;
}
