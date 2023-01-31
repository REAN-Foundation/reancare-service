import { Gender } from "../../miscellaneous/system.types";
import { VolunteerDetailsDto, VolunteerDto } from "./volunteer.dto";

///////////////////////////////////////////////////////////////////////////////////

export interface VolunteerSearchFilters {
    Phone?: string;
    Email?: string;
    Name?: string;
    Gender?: Gender;
    BloodGroup? : string,
    MedIssues? : string,
    SelectedBloodGroup?  : string;
    SelectedBridgeId?    : string;
    IsAvailable? : boolean,
    CreatedDateFrom?: Date;
    CreatedDateTo?: Date;
    OrderBy: string;
    Order: string;
    PageIndex: number;
    ItemsPerPage: number;
}

export interface VolunteerSearchResults {
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order: string;
    OrderedBy: string;
    Items: VolunteerDto[];
}

export interface VolunteerDetailsSearchResults {
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order: string;
    OrderedBy: string;
    Items: VolunteerDetailsDto[];
}
