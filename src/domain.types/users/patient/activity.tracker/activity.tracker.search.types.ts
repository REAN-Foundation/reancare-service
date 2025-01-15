import { BaseSearchFilters, BaseSearchResults } from "../../../miscellaneous/base.search.types";
import { ActivityTrackerDto } from "./activity.tracker.dto";

//////////////////////////////////////////////////////////////////////////////////

export interface ActivityTrackerSearchFilters extends BaseSearchFilters {
    RecentActivityDateFrom?         : Date;
    RecentActivityDateTo?           : Date;
}

export interface ActivityTrackerSearchResults extends BaseSearchResults {
    Items: ActivityTrackerDto[];
}
