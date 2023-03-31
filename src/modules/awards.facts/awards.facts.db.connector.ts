/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { DataSource } from "typeorm";
import { MedicationFact } from './models/medication.fact.model';
import { Logger } from "../../common/logger";
import mysql from 'mysql2';

///////////////////////////////////////////////////////////////////////////////////

Logger.instance().log(`environment : ${process.env.NODE_ENV}`);
Logger.instance().log(`db name     : awards_facts`);
Logger.instance().log(`db username : ${process.env.DB_USER_NAME}`);
Logger.instance().log(`db host     : ${process.env.DB_HOST}`);

const DATABASE_NAME = `awards_facts`;

///////////////////////////////////////////////////////////////////////////////////

class AwardsFactsDatabaseConnector {

    static _source = new DataSource({
        name        : 'mysql',
        type        : 'mysql',
        host        : process.env.DB_HOST,
        port        : 3306,
        username    : process.env.DB_USER_NAME,
        password    : process.env.DB_USER_PASSWORD,
        database    : DATABASE_NAME,
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

    public static executeQuery = (query): Promise<boolean> => {

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return new Promise((resolve, reject) => {
            try {
                const connection = mysql.createConnection({
                    host     : process.env.DB_HOST,
                    user     : process.env.DB_USER_NAME,
                    password : process.env.DB_USER_PASSWORD,
                });
                connection.connect(function (err) {
                    if (err) {
                        throw err;
                    }
                    //Logger.instance().log('Connected!');
                    connection.query(query, function (err, result) {
                        if (err) {
                            Logger.instance().log(err.message);
                            var str = (result !== undefined && result !== null) ? result.toString() : null;
                            if (str != null){
                                Logger.instance().log(str);
                            }
                            else {
                                Logger.instance().log(`Query: ${query}`);
                            }
                        }
                        resolve(true);
                    });
                });
            } catch (error) {
                Logger.instance().log(error.message);
            }
        });
    };

    public static createDatabase = async () => {
        try {
            const query = `CREATE DATABASE ${DATABASE_NAME}`;
            await this.executeQuery(query);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    //Drops DB if exists
    public static dropDatabase = async () => {
        try {
            const query = `DROP DATABASE IF EXISTS ${DATABASE_NAME}`;
            await this.executeQuery(query);
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
        }
        return false;
    };

}

///////////////////////////////////////////////////////////////////////////////////

const AwardsFactsSource = AwardsFactsDatabaseConnector._source;

export { AwardsFactsDatabaseConnector as AwardsFactsDBConnector, AwardsFactsSource };
