import { AddressDto } from "../address/address.dto";
import { OrganizationDto } from "../organization/organization.dto";
import { PersonDetailsDto } from "../person/person.dto";
import { RoleDto } from "../role/role.dto";

///////////////////////////////////////////////////////////////////////////////

export interface EmergencyContactDto {
    id?: string;
    Person: PersonDetailsDto;
    PatientUserId: string;
    Address?: AddressDto;
    Organization?: OrganizationDto;
    IsAvailableForEmergency?: boolean;
    Role: RoleDto;
    Relation?: string;
    TimeOfAvailability?: string;
    Description?: string;
    AdditionalPhoneNumbers?: string;
}
