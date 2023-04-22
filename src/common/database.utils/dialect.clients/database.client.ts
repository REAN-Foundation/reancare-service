import { inject, injectable } from "tsyringe";
import { IDatabaseClient } from "./database.client.interface";
import { DatabaseSchemaType } from "../database.config";

//////////////////////////////////////////////////////////////////////////////

@injectable()
export class DatabaseClient {

    constructor(
        @inject('IDatabaseClient') private _client: IDatabaseClient,
    ) {}

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
