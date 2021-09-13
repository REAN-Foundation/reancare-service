import { EmergencyContactDto } from "./emergency.contact.dto";
import { EmergencyContactRoles } from "./emergency.contact.types";

//////////////////////////////////////////////////////////////////////

export interface EmergencyContactSearchFilters {
    PatientUserId?: string;
    ContactPersonId?: string;
    IsAvailableForEmergency?: boolean;
    ContactRelation?: EmergencyContactRoles;
    OrderBy: string;
    Order: string;
    PageIndex: number;
    ItemsPerPage: number;
}

export interface EmergencyContactSearchResults {
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order: string;
    OrderedBy: string;
    Items: EmergencyContactDto[];
}
