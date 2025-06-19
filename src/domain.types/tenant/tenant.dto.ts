
export interface TenantDto {
    id         ?: string;
    Name        : string;
    Description?: string;
    Code       ?: string;
    Phone      ?: string;
    Email      ?: string;
}
export interface TenantSecretDto {
    SecretName           ?: string;
    SecretValue          ?: object;
}
