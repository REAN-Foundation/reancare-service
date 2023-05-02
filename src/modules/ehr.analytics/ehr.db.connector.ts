import { Dialect } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Logger } from '../../common/logger';
import { DatabaseDialect } from '../../domain.types/miscellaneous/system.types';
import { DatabaseSchemaType, databaseConfig } from '../../common/database.utils/database.config';
import { DatabaseClient } from '../../common/database.utils/dialect.clients/database.client';
import { Loader } from '../../startup/loader';

//////////////////////////////////////////////////////////////

export class EHRDbConnector {

    private static _sequelize: Sequelize;

    public static connect = async (): Promise<boolean> => {
        try {
            const dialect: DatabaseDialect = process.env.DB_DIALECT as DatabaseDialect;
            const modelsPath = [
                __dirname + '/models',
            ];
            const config = databaseConfig(DatabaseSchemaType.EHRInsights);
            const options = {
                host    : config.Host,
                dialect : dialect as Dialect,
                models  : modelsPath,
                pool    : {
                    max     : config.Pool.Max,
                    min     : config.Pool.Min,
                    acquire : config.Pool.Acquire,
                    idle    : config.Pool.Idle,
                },
                logging : false, //TODO: Please provide a function here to handle logging...
            };

            const sequelize = new Sequelize(
                config.DatabaseName,
                config.Username,
                config.Password, options);

            EHRDbConnector._sequelize = sequelize;

            Logger.instance().log(`Connecting to EHR Insights database '${config.DatabaseName}' ...`);

            const databaseClient = Loader.container.resolve(DatabaseClient);
            await databaseClient.createDb(DatabaseSchemaType.EHRInsights);

            await EHRDbConnector._sequelize.authenticate();
            await EHRDbConnector._sequelize.sync({ alter: true });

            Logger.instance().log(`Connected to EHR Insights database '${config.DatabaseName}'.`);

            return true;

        } catch (error) {
            Logger.instance().log(error.message);
            return false;
        }
    };

}
