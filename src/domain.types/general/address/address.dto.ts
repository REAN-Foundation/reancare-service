export interface AddressDto {
    id          : string;
    TenantId   ?: string;
    Type        : string;
    AddressLine : string;
    City        : string;
    District    : string;
    State       : string;
    Country     : string;
    PostalCode  : string;
    Longitude   : number;
    Lattitude   : number;
    Location?   : string;
}
