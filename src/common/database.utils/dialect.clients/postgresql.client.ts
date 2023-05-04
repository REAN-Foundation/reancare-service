import { Client } from 'pg';
import { Logger } from '../../logger';
import { IDatabaseClient } from './database.client.interface';
import { DatabaseSchemaType, databaseConfig } from '../database.config';

////////////////////////////////////////////////////////////////

export class PostgresqlClient  implements IDatabaseClient {

    public createDb = async (schemaType: DatabaseSchemaType): Promise<boolean> => {
        try {
            const config = databaseConfig(schemaType);
            const query = `CREATE DATABASE ${config.DatabaseName}`;
            return await this.executeQuery(schemaType, query);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public dropDb = async (schemaType: DatabaseSchemaType): Promise<boolean> => {
        try {
            const config = databaseConfig(schemaType);
            const query = `DROP DATABASE IF EXISTS ${config.DatabaseName}`;
            return await this.executeQuery(schemaType, query);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public executeQuery = async (schemaType: DatabaseSchemaType, query: string): Promise<boolean> => {
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
