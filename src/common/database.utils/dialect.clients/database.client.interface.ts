import { DatabaseSchemaType } from "../database.config";

export interface IDatabaseClient {

    createDb(schemaType: DatabaseSchemaType): Promise<boolean>;

    dropDb(schemaType: DatabaseSchemaType): Promise<boolean>;

    executeQuery(schemaType: DatabaseSchemaType, query: string): Promise<boolean>;

}
