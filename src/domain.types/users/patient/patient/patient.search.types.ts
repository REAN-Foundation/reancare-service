import { BaseSearchFilters, BaseSearchResults } from "../../../miscellaneous/base.search.types";
import { Gender } from "../../../miscellaneous/system.types";
import { PatientDetailsDto, PatientDto } from "./patient.dto";

//////////////////////////////////////////////////////////////////////////////////

export interface PatientSearchFilters extends BaseSearchFilters{
    Phone?          : string;
    Email?          : string;
    Name?           : string;
    Gender?         : Gender;
    DonorAcceptance?: string;
    BirthdateFrom?  : Date;
    BirthdateTo?    : Date;
    UserName?       : string;
}

export interface PatientSearchResults extends BaseSearchResults {
    Items: PatientDto[];
}

export interface PatientDetailsSearchResults extends BaseSearchResults {
    Items: PatientDetailsDto[];
}
