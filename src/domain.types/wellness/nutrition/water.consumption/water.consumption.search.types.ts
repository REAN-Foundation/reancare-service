import { BaseSearchResults } from "../../../../domain.types/miscellaneous/base.search.types";
import { BaseSearchFilters } from "../../../../domain.types/miscellaneous/base.search.types";
import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { WaterConsumptionDto, WaterConsumptionForDayDto } from "./water.consumption.dto";

export interface WaterConsumptionSearchFilters extends BaseSearchFilters{
    PatientUserId?  : uuid;
    DailyVolumeFrom?: number;
    DailyVolumeTo?  : number;
}

export interface WaterConsumptionSearchResults extends BaseSearchResults {
    Items: WaterConsumptionDto[] | WaterConsumptionForDayDto[];
}
