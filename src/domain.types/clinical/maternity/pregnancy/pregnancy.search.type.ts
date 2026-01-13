import { BaseSearchResults, BaseSearchFilters } from "../../../miscellaneous/base.search.types";
import { PregnancyDto } from "./pregnancy.dto";

//////////////////////////////////////////////////////////////////////

export interface PregnancySearchFilters extends BaseSearchFilters {
    DateOfLastMenstrualPeriod?  : Date;
    EstimatedDateOfChildBirth?  : Date;
    Gravidity?                  : number;
    Parity?                     : number;
}

export interface PregnancySearchResults extends BaseSearchResults {
    Items: PregnancyDto[];
}
