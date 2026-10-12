import { DatabaseSchemaType } from "../database.config";

export interface IDatabaseClient {

    createDb(schemaType: DatabaseSchemaType): Promise<boolean>;

    dropDb(schemaType: DatabaseSchemaType): Promise<boolean>;

    execute(schemaType: DatabaseSchemaType, query: string): Promise<boolean>;

    schemaExists(schemaName: string): Promise<boolean>;

    createSchema(schemaName: string): Promise<boolean>;

    disconnect(): Promise<void>;

}
