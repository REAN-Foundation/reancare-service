/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { DataSource, QueryRunner } from "typeorm";
import { MedicationFact } from './models/medication.fact.model';
import { Logger } from "../../common/logger";

///////////////////////////////////////////////////////////////////////////////////

Logger.instance().log(`environment : ${process.env.NODE_ENV}`);
Logger.instance().log(`db name     : awards_facts`);
Logger.instance().log(`db username : ${process.env.DB_USER_NAME}`);
Logger.instance().log(`db host     : ${process.env.DB_HOST}`);

class AwardsFactsDatabaseConnector {

    static _source = new DataSource({
        name        : 'mysql',
        type        : 'mysql',
        host        : process.env.DB_HOST,
        port        : 3306,
        username    : process.env.DB_USER_NAME,
        password    : process.env.DB_USER_PASSWORD,
        database    : `awards_facts`,
        synchronize : true,
        //entities    : [this._basePath + '/**/**{.model.ts}'],
        entities    : [
            MedicationFact,
        ],
        migrations  : [],
        subscribers : [],
        logger      : 'advanced-console', //Use console for the typeorm logging
        logging     : true,
        poolSize    : 20,
        cache       : true,
    });

    static initialize = (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            this._source
                .initialize()
                .then(() => {
                    Logger.instance().log('Database connection to awards_facts has been established successfully.');
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
