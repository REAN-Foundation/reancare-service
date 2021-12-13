import { BaseSearchFilters, BaseSearchResults } from "../../../domain.types/miscellaneous/base.search.types";
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { Severity } from "../../../domain.types/miscellaneous/system.types";
import { AllergyDto } from "./allergy.dto";
import { AllergenCategories, AllergenExposureRoutes } from "./allergy.types";

export interface AllergySearchFilters extends BaseSearchFilters{
    PatientUserId?        : uuid;
    Allergy?              : string;
    AllergenCategory?     : AllergenCategories;
    AllergenExposureRoute?: AllergenExposureRoutes;
    Severity?             : Severity;
    Reaction?             : string;
}

export interface AllergySearchResults extends BaseSearchResults{
    Items: AllergyDto[];
}
