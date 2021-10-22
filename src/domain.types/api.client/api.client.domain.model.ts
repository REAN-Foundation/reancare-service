
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
