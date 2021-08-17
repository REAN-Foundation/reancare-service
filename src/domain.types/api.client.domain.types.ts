
//#region Domain models

export interface ApiClientDomainModel {
    id?: string;
    ClientName: string;
    ClientCode?: string;
    Password?: string;
    Phone?: string;
    Email?: string;
    ApiKey?: string;
    ValidFrom?: Date;
    ValidTill?: Date;
}

export interface ApiClientVerificationDomainModel {
    ClientCode: string;
    Password: string;
    ValidFrom: Date;
    ValidTill: Date;
}

//#endregion

export interface ApiClientDto {
    id: string;
    ClientName: string;
    ClientCode: string;
    Phone: string;
    Email: string;
    IsActive: boolean;
}

export interface ClientApiKeyDto {
    id: string;
    ClientName: string;
    ClientCode: string;
    ApiKey: string;
    ValidFrom: Date;
    ValidTill: Date;
}
