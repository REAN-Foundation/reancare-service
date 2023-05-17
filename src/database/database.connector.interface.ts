
export interface IPrimaryDatabaseConnector {

    connect(): Promise<boolean>;

    sync(): Promise<boolean>;

    migrate(): Promise<boolean>;
}
