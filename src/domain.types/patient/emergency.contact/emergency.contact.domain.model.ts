import { AddressDomainModel } from "../../../domain.types/address/address.domain.model";
import { PersonDomainModel } from "../../../domain.types/person/person.domain.model";
import { EmergencyContactRoles } from "./emergency.contact.types";
import { uuid } from "../../../domain.types/miscellaneous/system.types";

export interface EmergencyContactDomainModel {
    id?                     : uuid,
    PatientUserId?          : uuid;
    ContactPersonId?        : uuid;
    ContactPerson?          : PersonDomainModel;
    ContactRelation?        : EmergencyContactRoles;
    AddressId?              : uuid;
    Address?                : AddressDomainModel;
    OrganizationId?         : uuid;
    IsAvailableForEmergency?: boolean;
    TimeOfAvailability?     : string;
    Description?            : string;
    AdditionalPhoneNumbers? : string;
}
