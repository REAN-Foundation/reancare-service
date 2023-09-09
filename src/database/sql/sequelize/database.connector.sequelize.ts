import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { Dialect } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Logger } from '../../../common/logger';
import { IPrimaryDatabaseConnector } from '../../database.connector.interface';
import { DatabaseSchemaType, databaseConfig } from '../../../common/database.utils/database.config';
import { DatabaseClient } from '../../../common/database.utils/dialect.clients/database.client';
import { Loader } from '../../../startup/loader';

//////////////////////////////////////////////////////////////

export class DatabaseConnector_Sequelize implements IPrimaryDatabaseConnector {

    private _sequelize: Sequelize = null;

    public static db: Sequelize = null;

    public connect = async (): Promise<boolean> => {
        try {

            const config = databaseConfig(DatabaseSchemaType.Primary);
            const modelsFolder = path.join(__dirname, '/models');
            const modelsPath = getFoldersRecursively(modelsFolder);
            const options = {
                host    : config.Host,
                dialect : config.Dialect as Dialect,
                models  : modelsPath,
                pool    : {
                    max     : config.Pool.Max,
                    min     : config.Pool.Min,
                    acquire : config.Pool.Acquire,
                    idle    : config.Pool.Idle,
                },
                logging : false, //TODO: Please provide a function here to handle logging...
            };

            const sequelize = new Sequelize(config.DatabaseName, config.Username, config.Password, options);
            this._sequelize = sequelize;

            Logger.instance().log(`Connecting to database '${config.DatabaseName}' ...`);

            const databaseClient = Loader.container.resolve(DatabaseClient);
            await databaseClient.createDb(DatabaseSchemaType.Primary);

            await this._sequelize.authenticate();
            await this._sequelize.sync({ force: false, alter: true });

            Logger.instance().log(`Connected to database '${config.DatabaseName}'.`);

            DatabaseConnector_Sequelize.db = this._sequelize;

            return true;

        } catch (error) {
            Logger.instance().log(error.message);
            return false;
        }
    };

    public db = (): Sequelize => {
        return this._sequelize;
    };

    public sync = async () => {
        try {
            await this._sequelize.sync({ alter: true });
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

}

///////////////////////////////////////////////////////////////////////////////////////////

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
