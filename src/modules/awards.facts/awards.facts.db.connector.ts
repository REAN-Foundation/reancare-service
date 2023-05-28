/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { DataSource } from "typeorm";
import { MedicationFact } from './models/medication.fact.model';
import { Logger } from "../../common/logger";
import { MysqlClient } from '../../common/database.utils/dialect.clients/mysql.client';
import { PostgresqlClient } from '../../common/database.utils/dialect.clients/postgresql.client';
import { DatabaseDialect } from '../../domain.types/miscellaneous/system.types';
import { NutritionChoiceFact } from "./models/nutrition.choice.fact.model";
import { Loader } from "../../startup/loader";
import { DatabaseClient } from "../../common/database.utils/dialect.clients/database.client";
import { DatabaseSchemaType } from "../../common/database.utils/database.config";
import { ExercisePhysicalActivityFact } from "./models/exercise.physical.activity.fact.model";

///////////////////////////////////////////////////////////////////////////////////

class AwardsFactsDatabaseConnector {

    static dialect = process.env.DB_DIALECT as DatabaseDialect;

    static _source = new DataSource({
        name        : process.env.DB_NAME_AWARDS_FACTS,
        type        : AwardsFactsDatabaseConnector.dialect,
        host        : process.env.DB_HOST,
        port        : parseInt(process.env.DB_PORT),
        username    : process.env.DB_USER_NAME,
        password    : process.env.DB_USER_PASSWORD,
        database    : process.env.DB_NAME_AWARDS_FACTS,
        synchronize : true,
        //entities    : [this._basePath + '/**/**{.model.ts}'],
        entities    : [
            MedicationFact,
            NutritionChoiceFact,
            ExercisePhysicalActivityFact,
        ],
        migrations  : [],
        subscribers : [],
        logger      : 'advanced-console', //Use console for the typeorm logging
        logging     : true,
        poolSize    : 20,
        cache       : true,
    });

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

}

///////////////////////////////////////////////////////////////////////////////////

const AwardsFactsSource = AwardsFactsDatabaseConnector._source;

export { AwardsFactsDatabaseConnector as AwardsFactsDBConnector, AwardsFactsSource };
