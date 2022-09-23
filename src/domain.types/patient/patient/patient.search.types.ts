import { BaseSearchFilters, BaseSearchResults } from "../../../domain.types/miscellaneous/base.search.types";
import { Gender } from "../../miscellaneous/system.types";
import { PatientDetailsDto, PatientDto } from "./patient.dto";

//////////////////////////////////////////////////////////////////////////////////

export interface PatientSearchFilters extends BaseSearchFilters{
    Phone?         : string;
    Email?         : string;
    Name?          : string;
    Gender?        : Gender;
    BirthdateFrom? : Date;
    BirthdateTo?   : Date;
}

export interface PatientSearchResults extends BaseSearchResults {
    Items: PatientDto[];
}

export interface PatientDetailsSearchResults extends BaseSearchResults {
    Items: PatientDetailsDto[];
}
