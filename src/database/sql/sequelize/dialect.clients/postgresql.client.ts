
import { Client } from 'pg';
import { Logger } from '../../../../common/logger';
import { DbConfig } from '../database.config';

////////////////////////////////////////////////////////////////

export class PostgresqlClient {

    public static createDb = async () => {
        try {
            const config = DbConfig.config;
            const query = `CREATE DATABASE ${config.database}`;
            await PostgresqlClient.executeQuery(query);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public static dropDb = async () => {
        try {
            const config = DbConfig.config;
            const query = `DROP DATABASE IF EXISTS ${config.database}`;
            await PostgresqlClient.executeQuery(query);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public static executeQuery = async (query) => {
        try {
            const config = DbConfig.config;
            const client = new Client({
                user     : config.username,
                host     : config.host,
                password : config.password,
                port     : 5432,
            });
            await client.connect();
            await client.query(query);
            await client.end();
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

}
