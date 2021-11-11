import { EmergencyContactDto } from "./emergency.contact.dto";
import { EmergencyContactRoles } from "./emergency.contact.types";
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { BaseSearchFilters, BaseSearchResults } from "../../../domain.types/miscellaneous/base.search.types";

//////////////////////////////////////////////////////////////////////

export interface EmergencyContactSearchFilters extends BaseSearchFilters{
    PatientUserId?          : uuid;
    ContactPersonId?        : uuid;
    IsAvailableForEmergency?: boolean;
    ContactRelation?        : EmergencyContactRoles;
}

export interface EmergencyContactSearchResults extends BaseSearchResults{
    Items: EmergencyContactDto[];
}
