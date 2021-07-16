
export interface AddressDomainModel {
    id?: string;
    Type: string;
    UserId?: string;
    OrganizationId?: string;
    AddressLine?: string;
    City?: string;
    District?: string;
    State?: string;
    Country?: string;
    PostalCode?: string;
    LocationCoordsLongitude?: number;
    LocationCoordsLattitude?: number;
};

export interface AddressDto {
    id: string;
    Type: string;
    UserId?: string;
    OrganizationId?: string;
    AddressLine: string;
    City: string;
    District: string;
    State: string;
    Country: string;
    PostalCode: string;
    LocationCoordsLongitude: number;
    LocationCoordsLattitude: number;
};