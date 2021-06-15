

export interface IDatabaseConnector {

    connect(): Promise<boolean>;

    createDatabase(): Promise<boolean>;

    dropDatabase(): Promise<boolean>;

    executeQuery(query: string): Promise<boolean>;
    
    migrate(): Promise<boolean>;
}
