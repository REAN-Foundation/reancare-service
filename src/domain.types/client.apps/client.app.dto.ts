
export interface ClientAppDto {
    id          : string;
    ClientName  : string;
    ClientCode  : string;
    IsPrivileged: boolean;
    Phone       : string;
    Email       : string;
    IsActive    : boolean;
}

export interface ApiKeyDto {
    id        : string;
    ClientName: string;
    ClientCode: string;
    ApiKey    : string;
    ValidFrom : Date;
    ValidTill : Date;
}
