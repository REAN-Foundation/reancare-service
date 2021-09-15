import { EmergencyContactRoles } from "./emergency.contact.types";

export interface EmergencyContactDomainModel {
    id?: string,
    PatientUserId?: string;
    ContactPersonId?: string;
    ContactRelation?: EmergencyContactRoles;
    AddressId?: string;
    OrganizationId?: string;
    IsAvailableForEmergency?: boolean;
    TimeOfAvailability?: string;
    Description?: string;
    AdditionalPhoneNumbers?: string;
}
