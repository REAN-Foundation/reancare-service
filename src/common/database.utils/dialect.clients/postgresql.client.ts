import { Client } from 'pg';
import { Logger } from '../../logger';
import { IDatabaseClient } from './database.client.interface';
import { DatabaseSchemaType, databaseConfig } from '../database.config';
import { ApiError } from '../../api.error';

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
                port     : config.Port,
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
            if (!this.connection) {
                throw new Error('No active database connection. Call connect() before executing a query.');
            }
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
                port     : config.Port,
            });
            await client.connect();
            await client.query(query);
            await client.end();
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public schemaExists = async (schemaName: string): Promise<boolean> => {
        const config = databaseConfig(DatabaseSchemaType.Primary);
        const client = new Client({
            user     : config.Username,
            host     : config.Host,
            password : config.Password,
            database : config.DatabaseName,
            port     : config.Port,
        });
        try {
            await client.connect();
            const result = await client.query(
                'SELECT 1 FROM pg_database WHERE datname = $1',
                [schemaName]
            );
            return result.rowCount > 0;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, `Failed to check if schema '${schemaName}' exists: ${error.message}`);
        } finally {
            await client.end();
        }
    };

    public disconnect = async (): Promise<void> => {
        try {
            if (this.connection) {
                await this.connection.end();
                this.connection = null;
            }
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public createSchema = async (schemaName: string): Promise<boolean> => {
        const config = databaseConfig(DatabaseSchemaType.Primary);
        const client = new Client({
            user     : config.Username,
            host     : config.Host,
            password : config.Password,
            database : config.DatabaseName,
            port     : config.Port,
        });
        try {
            await client.connect();
            await client.query(`CREATE DATABASE "${schemaName}"`);
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, `Failed to create schema '${schemaName}': ${error.message}`);
        } finally {
            await client.end();
        }
    };

}
