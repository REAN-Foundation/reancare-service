import { AddressDomainModel } from "../../../general/address/address.domain.model";
import { PersonDomainModel } from "../../../person/person.domain.model";
import { EmergencyContactRoles } from "./emergency.contact.types";
import { uuid } from "../../../miscellaneous/system.types";

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
