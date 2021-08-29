export interface EmergencyContactDomainModel {
    id?: string;
    PersonId: string;
    PatientUserId: string;
    AddressId?: string;
    OrganizationId?: string;
    IsAvailableForEmergency?: boolean;
    RoleId?: string;
    Relation?: string;
    TimeOfAvailability?: string;
    Description?: string;
    AdditionalPhoneNumbers?: string;
}
