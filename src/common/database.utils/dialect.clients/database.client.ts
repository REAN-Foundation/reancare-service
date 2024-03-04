import { DatabaseSchemaType } from "../database.config";
import { DatabaseDialect } from '../../../domain.types/miscellaneous/system.types';
import { MysqlClient } from "./mysql.client";

//////////////////////////////////////////////////////////////////////////////

export class DatabaseClient {

    _client = null;

    constructor() {
        const dialect = process.env.DB_DIALECT as DatabaseDialect;
        if (dialect === 'mysql') {
            this._client = MysqlClient.getInstance();
        }

        if (dialect === 'postgres') {
            // this._client = PostgresqlClient.getInstance();
        }

    }

    public createDb = async (schemaType: DatabaseSchemaType): Promise<boolean> => {
        return await this._client.createDb(schemaType);
    };

    public dropDb = async (schemaType: DatabaseSchemaType): Promise<boolean> => {
        return await this._client.dropDb(schemaType);
    };

    public executeQuery = async (schemaType: DatabaseSchemaType, query: string): Promise<boolean> => {
        return await this._client.executeQuery(schemaType, query);
    };

}
