
export interface TenantDto {
    id         ?: string;
    Name        : string;
    Description?: string;
    Code       ?: string;
    Phone      ?: string;
    Email      ?: string;
}

export interface TenantSchemaDto {
    SchemaName  ?: string;
    Environment ?: string;
}
