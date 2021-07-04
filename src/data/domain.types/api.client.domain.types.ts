
//#region Domain models

export interface ApiClientDomainModel {
    id?: string;
    ClientName: string;
    ClientCode: string;
    Password?: string;
    Phone?: string;
    Email?: string;
    ValidFrom?: Date;
    ValidTo?: Date;
};

export interface ClientLoginDomainModel {
    ClientCode: string;
    Password: string;
    ValidFrom: Date;
    ValidTo: Date;
}

//#endregion

export interface ApiClientDto {
    id: string;
    ClientName: string;
    ClientCode: string;
    Phone: string;
    Email: string;
    IsActive: boolean;
};

export interface ClientApiKeyDto {
    id: string;
    ClientId: string;
    ClientName: string;
    ClientCode: string;
    APIKey: string;
    ValidFrom: Date;
    ValidTo: Date;
}
