

export interface IDbConnector {

    connect(): Promise<boolean>;
    authenticate(): Promise<boolean>;
    createDb(): Promise<boolean>;
    dropDb(): Promise<boolean>;
    executeQuery(query: string): Promise<boolean>;
    migrate(): Promise<boolean>;
}
