
export interface ClientDomainModel {
    id?: string;
    ClientName: string;
    ClientCode: string;
    Password?: string;
    Phone?: string;
    Email?: string;
    APIKey?: string;
    ValidFrom?: Date;
    ValidTo?: Date;
};

export interface ClientDto {
    id: string;
    ClientName: string;
    ClientCode: string;
    Phone: string;
    Email: string;
    IsActive: boolean;
};

export interface ClientSecretsDto {
    id: string;
    ClientName: string;
    ClientCode: string;
    APIKey: string;
    ValidFrom: Date;
    ValidTo: Date;
}