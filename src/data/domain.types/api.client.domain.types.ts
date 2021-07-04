
//#region Domain models

export interface ApiClientDomainModel {
    id?: string;
    ClientName: string;
    ClientCode: string;
    Password?: string;
    Phone?: string;
    Email?: string;
    ApiKey: string;
    ValidFrom?: Date;
    ValidTo?: Date;
};

export interface ApiClientVerificationDomainModel {
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
    ClientName: string;
    ClientCode: string;
    ApiKey: string;
    ValidFrom: Date;
    ValidTo: Date;
}
