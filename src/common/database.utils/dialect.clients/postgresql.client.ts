import { Client } from 'pg';
import { Logger } from '../../logger';
import { IDatabaseClient } from './database.client.interface';
import { DatabaseSchemaType, databaseConfig } from '../database.config';

////////////////////////////////////////////////////////////////

export class PostgresqlClient  implements IDatabaseClient {

    private connection: Client = null;

    private static instance: PostgresqlClient = null;
   
    private constructor() {}

    public static getInstance() {
        return this.instance || (this.instance = new PostgresqlClient());
    }

    public connect = async (schemaType: DatabaseSchemaType): Promise<any> => {
        try {
            const config = databaseConfig(schemaType);
            this.connection = new Client({
                database : config.DatabaseName,
                host     : config.Host,
                user     : config.Username,
                password : config.Password,
            });
            await this.connection.connect();
        } catch (error) {
            Logger.instance().log(error.message);
            Logger.instance().log(`Error trace: ${error.stack}`);
        }
    };
    
    public createDb = async (schemaType: DatabaseSchemaType): Promise<boolean> => {
        try {
            const config = databaseConfig(schemaType);
            const query = `CREATE DATABASE ${config.DatabaseName}`;
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
    
    public dropDb = async (schemaType: DatabaseSchemaType): Promise<boolean> => {
        try {
            const config = databaseConfig(schemaType);
            const query = `DROP DATABASE IF EXISTS ${config.DatabaseName}`;
            return await this.execute(schemaType, query);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public execute = async (schemaType: DatabaseSchemaType, query: string): Promise<boolean> => {
        try {
            const config = databaseConfig(schemaType);
            const client = new Client({
                user     : config.Username,
                host     : config.Host,
                password : config.Password,
                port     : 5432,
            });
            await client.connect();
            await client.query(query);
            await client.end();
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

}
