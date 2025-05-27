import { BaseSearchResults, BaseSearchFilters } from "../../../miscellaneous/base.search.types";
import { BreastfeedingDto } from "./breastfeeding.dto";
import { BreastfeedingStatus } from "./breastfeeding.status.type";

//////////////////////////////////////////////////////////////////////

export interface BreastfeedingSearchFilters extends BaseSearchFilters {
    VisitId?                 : string;
    PostNatalVisitId?        : string;
    BreastFeedingStatus?     : BreastfeedingStatus;
    BreastfeedingFrequency?  : string;
    CreatedAtFrom?           : Date;
    CreatedAtTo?             : Date;
}

export interface BreastfeedingSearchResults extends BaseSearchResults {
    Items: BreastfeedingDto[];
}
