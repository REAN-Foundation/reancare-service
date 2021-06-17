import fs = require('fs');
import path = require('path');
import { Sequelize, Dialect } from 'sequelize';
import { DbConfig } from '../../../configs/db.config';
import { Logger } from '../../../common/logger';
import { IDatabaseConnector } from '../../../interfaces/database.connector.interface';
import { PostgresqlClient } from './dialect.clients/postgresql.client';
import { MysqlClient } from './dialect.clients/mysql.client';

const execSync = require('child_process').execSync;

//////////////////////////////////////////////////////////////

export class DatabaseConnector_Sequelize implements IDatabaseConnector {
    private _sequelize: Sequelize = null;

    public connect = async (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            try {
                const config = DbConfig.config;
                const dialect: Dialect = this.getDialect();

                var options = {
                    host: config.host,
                    dialect: dialect,
                    models: [__dirname + '/models'],
                    pool: {
                        max: config.pool.max,
                        min: config.pool.min,
                        acquire: config.pool.acquire,
                        idle: config.pool.idle,
                    },
                    logging: false, //TODO: Please provide a function here to handle logging...
                };

                const sequelize = new Sequelize(config.database, config.username, config.password, options);
                this._sequelize = sequelize;
                resolve(true);
            } catch (error) {
                reject(error);
                Logger.instance().log(error.message);
            }
        });
    };

    //Creates DB if does not exist
    public sync = async () => {
        try {
            await this._sequelize.sync({force: true});
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
        }
        return false;
    };

    //Creates DB if does not exist
    public createDatabase = async () => {
        try {
            var client = this.getClient();
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
            var client = this.getClient();
            await client.dropDb();
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
        }
        return false;
    };

    //Drops DB if exists
    public executeQuery = async (query: String) => {
        try {
            var client = this.getClient();
            await client.executeQuery(query);
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
        }
        return false;
    };

    public migrate = async () => {
        try {
            var output = execSync('npx sequelize-cli db:migrate');
            console.log('Database migrated successfully!\n');
            return true;
        } catch (error) {
            console.log(error.message);
        }
        return false;
    };

    //Private methods

    private getDialect(): Dialect {
        var dialect: Dialect = 'postgres';
        const config = DbConfig.config;
        if (config.dialect === 'mysql') {
            dialect = 'mysql';
        }
        if (config.dialect === 'mssql') {
            dialect = 'mssql';
        }
        return dialect;
    }

    private getClient() {
        const config = DbConfig.config;
        if (config.dialect === 'mysql') {
            return MysqlClient;
        }
        if (config.dialect === 'postgres') {
            return PostgresqlClient;
        }
        return PostgresqlClient;
    }
}
