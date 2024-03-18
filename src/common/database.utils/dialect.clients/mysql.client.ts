
// eslint-disable-next-line @typescript-eslint/no-var-requires
import mysql, { Connection } from 'mysql2/promise';
import { Logger } from '../../logger';
import { DatabaseSchemaType, databaseConfig } from '../database.config';
import { IDatabaseClient } from './database.client.interface';

//////////////////////////////////////////////////////////////////////////////

export class MysqlClient implements IDatabaseClient {

    private connection: Connection = null;

    private static instance: MysqlClient = null;
   
    private constructor() {}

    public static getInstance() {
        return this.instance || (this.instance = new MysqlClient());
    }

    public connect = async (schemaType: DatabaseSchemaType): Promise<any> => {
        try {
            const config = databaseConfig(schemaType);
            this.connection = await mysql.createConnection({
                database : config.DatabaseName,
                host     : config.Host,
                user     : config.Username,
                password : config.Password,
            });

        } catch (error) {
            Logger.instance().log(error.message);
            Logger.instance().log(`Error trace: ${error.stack}`);
        }
    };

    public createDb = async (schemaType: DatabaseSchemaType): Promise<boolean> => {
        try {
            const config = databaseConfig(schemaType);
            //var query = `CREATE DATABASE ${config.database} CHARACTER SET utf8 COLLATE utf8_general_ci;`;
            const query = `CREATE DATABASE ${config.DatabaseName}`;
            return await this.execute(schemaType, query);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public dropDb = async (schemaType: DatabaseSchemaType): Promise<boolean> => {
        try {
            const config = databaseConfig(schemaType);
            const query = `DROP DATABASE IF EXISTS ${config.DatabaseName}`;
            return await this.execute(schemaType, query);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public executeQuery = async (query: string): Promise<any> => {
        try {
            const result = await this.connection.query(query);
            return result;
        } catch (error) {
            Logger.instance().log(error.message);
            Logger.instance().log(`Error trace: ${error.stack}`);
        }
        return null;
    };

    public execute = async (schemaType: DatabaseSchemaType, query: string): Promise<boolean> => {

        try {
            const config = databaseConfig(schemaType);

            const connection = await mysql.createConnection({
                host     : config.Host,
                user     : config.Username,
                password : config.Password,
            });

            await connection.query(query);
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public closeDbConnection = async () => {
        try {
            await this.connection.end();
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

}
