import { AddressDomainModel } from "../../../domain.types/address/address.domain.model";
import { PersonDomainModel } from "../../../domain.types/person/person.domain.model";
import { EmergencyContactRoles } from "./emergency.contact.types";

export interface EmergencyContactDomainModel {
    id?: string,
    PatientUserId?: string;
    ContactPersonId?: string;
    ContactPerson?: PersonDomainModel;
    ContactRelation?: EmergencyContactRoles;
    AddressId?: string;
    Address?: AddressDomainModel;
    OrganizationId?: string;
    IsAvailableForEmergency?: boolean;
    TimeOfAvailability?: string;
    Description?: string;
    AdditionalPhoneNumbers?: string;
}
