
export interface AddressDomainModel {
    id?: string;
    Type: string;
    PersonId?: string;
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
    PersonId?: string;
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

export interface AddressSearchFilters {
    Type: string;
    PersonId?: string;
    OrganizationId?: string;
    AddressLine?: string;
    City?: string;
    District?: string;
    State?: string;
    Country?: string;
    PostalCode?: string;
    LongitudeFrom?: number;
    LongitudeTo: number;
    LattitudeFrom?: number;
    LattitudeTo: number;
    CreatedDateFrom?: Date;
    CreatedDateTo?: Date;
    OrderBy: string;
    Order: string;
    PageIndex: number;
    ItemsPerPage: number;
}

