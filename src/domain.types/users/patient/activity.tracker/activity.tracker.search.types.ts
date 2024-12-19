import { BaseSearchFilters, BaseSearchResults } from "../../../miscellaneous/base.search.types";
import { ActivityTrackerDto } from "./activity.tracker.dto";

//////////////////////////////////////////////////////////////////////////////////

export interface ActivityTrackerSearchFilters extends BaseSearchFilters {
    PatientUserId?                : string;
    LastLoginDate?                : Date;
    LastVitalUpdateDate?          : Date;
    UpdatedVitalDetails?          : string;
    LastUserTaskDate?             : Date;
    UserTaskDetails?              : string;
    LastActivityDateFrom?         : Date;
    LastActivityDateTo?           : Date;
}

export interface ActivityTrackerSearchResults extends BaseSearchResults {
    Items: ActivityTrackerDto[];
}
