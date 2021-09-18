
//////////////////////////////////////////////////////////////////////

import { EmergencyEventDto } from "./emergency.event.dto";

export interface EmergencyEventSearchFilters {
    PatientUserId?: string;
    MedicalPractitionerUserId?: string;
    EmergencyDateFrom: Date;
    EmergencyDateTo: Date;
    OrderBy: string;
    Order: string;
    PageIndex: number;
    ItemsPerPage: number;
}

export interface EmergencyEventSearchResults {
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order: string;
    OrderedBy: string;
    Items: EmergencyEventDto[];
}
