import { BaseSearchResults, BaseSearchFilters } from "../../../../domain.types/miscellaneous/base.search.types";
import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { BloodPressureDto } from "./blood.pressure.dto";

export interface BloodPressureSearchFilters extends BaseSearchFilters{
    PersonId?         : uuid;
    PatientUserId?    : uuid;
    MinSystolicValue? : number;
    MaxSystolicValue? : number;
    MinDiastolicValue?: number;
    MaxDiastolicValue?: number;
    CreatedDateFrom?  : Date;
    CreatedDateTo?    : Date;
    RecordedByUserId? : uuid;
}

export interface BloodPressureSearchResults extends BaseSearchResults{
    Items: BloodPressureDto[];
}
