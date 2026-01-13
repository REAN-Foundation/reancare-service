import { BaseSearchResults, BaseSearchFilters } from "../../../miscellaneous/base.search.types";
import { BabyDto } from "./baby.dto";

///////////////////////////////////////////////////////////////////////

export interface BabySearchFilters extends BaseSearchFilters {
    DeliveryId?           : string;
    PatientUserId?        : string;
    Gender?               : string;
    Status?               : string;
    WeightAtBirthGrams?   : number;
}

export interface BabySearchResults extends BaseSearchResults {
    Items: BabyDto[];
}
