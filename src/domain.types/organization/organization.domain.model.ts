
export interface OrganizationDomainModel {
    id?: string,
    Type: string;
    Name: string;
    ContactUserId?: string;
    ContactPhone?: string;
    ContactEmail?: string;
    ParentOrganizationId?: string;
    About?: string;
    OperationalSince?: Date;
    AddressIds?: string[];
    ImageResourceId?: string;
    IsHealthFacility?: boolean;
    NationalHealthFacilityRegistryId?: string;
}
