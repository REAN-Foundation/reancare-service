import { BaseSearchResults, BaseSearchFilters } from "../../../miscellaneous/base.search.types";
import { uuid } from "../../../miscellaneous/system.types";
import { BloodCholesterolDto } from "./blood.cholesterol.dto";

export interface BloodCholesterolSearchFilters extends BaseSearchFilters{
    PatientUserId?       : uuid;
    MinTotalCholesterol? : number;
    MaxTotalCholesterol? : number;
    MinRatio?            : number;
    MaxRatio?            : number;
    MinHDL?              : number;
    MaxHDL?              : number;
    MinLDL?              : number;
    MaxLDL?              : number;
    MinA1CLevel?         : number;
    MaxA1CLevel?         : number;
    CreatedDateFrom?     : Date;
    CreatedDateTo?       : Date;
    RecordedByUserId?    : uuid;
}

export interface BloodCholesterolSearchResults extends BaseSearchResults{
    Items: BloodCholesterolDto[];
}
