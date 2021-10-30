import { BaseSearchResults } from "../../../../domain.types/miscellaneous/base.search.types";
import { BaseSearchFilters } from "../../../../domain.types/miscellaneous/base.search.types";
import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { BloodOxygenSaturationDto } from "./blood.oxygen.saturation.dto";

export interface BloodOxygenSaturationSearchFilters extends BaseSearchFilters  {
    PersonId?        : uuid;
    PatientUserId?   : uuid;
    MinValue?        : number;
    MaxValue?        : number;
    CreatedDateFrom? : Date;
    CreatedDateTo?   : Date;
    RecordedByUserId?: uuid;
}

export interface BloodOxygenSaturationSearchResults extends BaseSearchResults {
    Items: BloodOxygenSaturationDto[];
}
