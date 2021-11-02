import { BaseSearchFilters, BaseSearchResults } from "../../../../domain.types/miscellaneous/base.search.types";
import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { BodyTemperatureDto } from "./body.temperature.dto";

export interface BodyTemperatureSearchFilters extends BaseSearchFilters {
    PatientUserId?   : uuid;
    MinValue?        : number;
    MaxValue?        : number;
    CreatedDateFrom? : Date;
    CreatedDateTo?   : Date;
    RecordedByUserId?: uuid;
}

export interface BodyTemperatureSearchResults extends BaseSearchResults{
    Items: BodyTemperatureDto[];
}
