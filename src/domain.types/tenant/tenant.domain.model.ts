
export interface TenantDomainModel {
    id         ?: string;
    Name        : string;
    Description?: string;
    Code       ?: string;
    Phone      ?: string;
    Email      ?: string;
    UserName   ?: string;
    Password   ?: string;
}

export interface TenantSecretDomainModel {
    SecretName     ?: string;
    SecretValue    ?: object;
    Environment    ?: string;
}

export interface GetSecretDomainModel{
    SecretName     ?: string;
}

export interface TenantSchemaDomainModel {
    SchemaName       ?: string;
    Environment      ?: string;
}
