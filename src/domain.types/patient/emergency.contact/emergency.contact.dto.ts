import { OrganizationDto } from "../../organization/organization.dto";
import { AddressDto } from "../../address/address.dto";
import { PersonDto } from "../../person/person.dto";
import { EmergencyContactRoles } from "./emergency.contact.types";

export interface EmergencyContactDto {
    id?: string,
    PatientUserId?: string;
    ContactPerson: PersonDto;
    ContactRelation?: EmergencyContactRoles;
    Address?: AddressDto;
    Organization?: OrganizationDto;
    IsAvailableForEmergency?: boolean;
    TimeOfAvailability?: string;
    Description?: string;
    AdditionalPhoneNumbers?: string;
}
