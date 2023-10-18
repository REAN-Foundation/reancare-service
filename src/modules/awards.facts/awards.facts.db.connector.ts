/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { DataSource } from "typeorm";
import { MedicationFact } from './models/medication.fact.model';
import { Logger } from "../../common/logger";
import { DatabaseDialect } from '../../domain.types/miscellaneous/system.types';
import { NutritionChoiceFact } from "./models/nutrition.choice.fact.model";
import { Loader } from "../../startup/loader";
import { DatabaseClient } from "../../common/database.utils/dialect.clients/database.client";
import { DatabaseSchemaType } from "../../common/database.utils/database.config";
import { ExercisePhysicalActivityFact } from "./models/exercise.physical.activity.fact.model";
import { VitalFact } from "./models/vital.fact.model";
import { MentalHealthFact } from "./models/mental.health.fact.model";
import { BadgeFact } from "./models/badge.fact.model";
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";

///////////////////////////////////////////////////////////////////////////////////

class AwardsFactsDatabaseConnector {

    static dialect = process.env.DB_DIALECT as DatabaseDialect;

    static _entities = [
        MedicationFact,
        BadgeFact,
        NutritionChoiceFact,
        ExercisePhysicalActivityFact,
        VitalFact,
        MentalHealthFact
    ];

    static _options : MysqlConnectionOptions | PostgresConnectionOptions | SqliteConnectionOptions =
        this.getDataSourceOptions(this._entities);

    static _source = new DataSource(this._options);

    static connect = async (): Promise<boolean> => {

        const databaseClient = Loader.container.resolve(DatabaseClient);
        await databaseClient.createDb(DatabaseSchemaType.AwardsFacts);

        return new Promise((resolve, reject) => {
            this._source
                .initialize()
                .then(() => {
                    Logger.instance().log(`Connected to database '${process.env.DB_NAME_AWARDS_FACTS}'.`);
                    resolve(true);
                })
                .catch(error => {
                    Logger.instance().log('Unable to connect to the database awards_facts:' + error.message);
                    reject(false);
                });
        });

    };

    private static getDataSourceOptions(entities: any[])
        : MysqlConnectionOptions | PostgresConnectionOptions | SqliteConnectionOptions {

        const dialect = process.env.DB_DIALECT as DatabaseDialect;
        var tempOptions = {
            name        : process.env.DB_NAME_AWARDS_FACTS,
            host        : process.env.DB_HOST,
            port        : parseInt(process.env.DB_PORT),
            username    : process.env.DB_USER_NAME,
            password    : process.env.DB_USER_PASSWORD,
            database    : process.env.DB_NAME_AWARDS_FACTS,
            entities    : entities,
            synchronize : true,
            migrations  : [],
            subscribers : [],
            logging     : process.env.NODE_ENV !== 'test',
            cache       : true,
        };

        if (dialect === 'mysql') {
            const mysqlOptions : MysqlConnectionOptions = {
                ...tempOptions,
                type     : 'mysql',
                logger   : 'advanced-console', //Use console for the typeorm logging
                poolSize : 20,
            };
            return mysqlOptions;
        }
        else if (dialect === 'postgres') {
            const postgresOptions : PostgresConnectionOptions = {
                ...tempOptions,
                type     : 'postgres',
                logger   : 'advanced-console',
                poolSize : 20,
            };
            return postgresOptions;
        }
        else if (dialect === 'sqlite') {
            const sqliteOptions : SqliteConnectionOptions = {
                ...tempOptions,
                type   : 'sqlite',
                logger : 'advanced-console', //Use console for the typeorm logging
            };
            return sqliteOptions;
        }
        return null;
    }

}

///////////////////////////////////////////////////////////////////////////////////

const AwardsFactsSource = AwardsFactsDatabaseConnector._source;

export { AwardsFactsDatabaseConnector as AwardsFactsDBConnector, AwardsFactsSource };
