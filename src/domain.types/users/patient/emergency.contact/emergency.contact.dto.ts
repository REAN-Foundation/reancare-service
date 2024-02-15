import { AddressDto } from "../../../general/address/address.dto";
import { OrganizationDto } from "../../../general/organization/organization.dto";
import { PersonDto } from "../../../person/person.dto";
import { EmergencyContactRoles } from "./emergency.contact.types";

export interface EmergencyContactDto {
    id?                     : string,
    PatientUserId?          : string;
    ContactPersonId?        : string;
    ContactPerson?          : PersonDto;
    ContactRelation?        : EmergencyContactRoles;
    AddressId?              : string;
    Address?                : AddressDto;
    OrganizationId?         : string;
    Organization?           : OrganizationDto;
    IsAvailableForEmergency?: boolean;
    TimeOfAvailability?     : string;
    Description?            : string;
    AdditionalPhoneNumbers? : string;
}
