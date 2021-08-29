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
    Longitude: number;
    Lattitude: number;
}
