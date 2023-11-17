import { uuid } from "../../miscellaneous/system.types";
import { BaseSearchFilters, BaseSearchResults } from "../../miscellaneous/base.search.types";
import { HospitalDto } from "./hospital.dto";

export interface HospitalSearchFilters extends BaseSearchFilters {
    Name?          : string;
    HealthSystemId?: uuid;
    Tags?          : string[];
}

export interface HospitalSearchResults extends BaseSearchResults {
    Items : HospitalDto[];
}
