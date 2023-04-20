/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { DataSource } from "typeorm";
import { MedicationFact } from './models/medication.fact.model';
import { Logger } from "../../common/logger";
import { MysqlClient } from '../../database/sql/sequelize/dialect.clients/mysql.client';
import { PostgresqlClient } from '../../database/sql/sequelize/dialect.clients/postgresql.client';
import { DatabaseDialect } from '../../domain.types/miscellaneous/system.types';
import { NutritionChoiceFact } from "./models/nutrition.choice.fact.model";

///////////////////////////////////////////////////////////////////////////////////

Logger.instance().log(`environment : ${process.env.NODE_ENV}`);
Logger.instance().log(`db name     : ${process.env.DB_NAME_AWARDS_FACTS}`);
Logger.instance().log(`db username : ${process.env.DB_USER_NAME}`);
Logger.instance().log(`db host     : ${process.env.DB_HOST}`);

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
        ],
        migrations  : [],
        subscribers : [],
        logger      : 'advanced-console', //Use console for the typeorm logging
        logging     : true,
        poolSize    : 20,
        cache       : true,
    });

    static connect = async (): Promise<boolean> => {

        await this.createDatabase();

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

    public static executeQuery = async (query: string) => {
        try {
            const client = AwardsFactsDatabaseConnector.getClient();
            await client.executeQuery(query);
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
        }
        return false;
    };

    public static createDatabase = async () => {
        try {
            const query = `CREATE DATABASE ${process.env.DB_NAME_AWARDS_FACTS}`;
            await this.executeQuery(query);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    //Drops DB if exists
    public static dropDatabase = async () => {
        try {
            const query = `DROP DATABASE IF EXISTS ${process.env.DB_NAME_AWARDS_FACTS}`;
            await this.executeQuery(query);
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
        }
        return false;
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

}

///////////////////////////////////////////////////////////////////////////////////

const AwardsFactsSource = AwardsFactsDatabaseConnector._source;

export { AwardsFactsDatabaseConnector as AwardsFactsDBConnector, AwardsFactsSource };
