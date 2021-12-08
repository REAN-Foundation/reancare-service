//////////////////////////////////////////////////////////////////////

import { PhysicalActivityDto, PhysicalActivityForDayDto } from "./physical.activity.dto";
import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { BaseSearchFilters, BaseSearchResults } from "../../../../domain.types/miscellaneous/base.search.types";

export interface PhysicalActivitySearchFilters extends BaseSearchFilters{
    PatientUserId?: uuid;
    Exercise?     : string;
    Category?     : string;
}

export interface PhysicalActivitySearchResults extends BaseSearchResults{
    Items: PhysicalActivityDto[] | PhysicalActivityForDayDto[];
}
