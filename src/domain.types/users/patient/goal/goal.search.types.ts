import { BaseSearchFilters, BaseSearchResults } from "../../../miscellaneous/base.search.types";
import { GoalDto } from "./goal.dto";

export interface GoalSearchFilters extends BaseSearchFilters {
    PatientUserId        : string;
    Provider?            : string;
    ProviderEnrollmentId?: string;
    ProviderCareplanName?: string;
    ProviderCareplanCode?: string;
    ProviderGoalCode?    : string;
    Title?               : string;
    Sequence?            : string;
    CategoryCode?        : string;
    HealthPriorityId?    : string;
    GoalAchieved?        : boolean;
    GoalAbandoned?       : boolean;
    StartedAt?           : Date;
    ScheduledEndDate?    : Date;
}

export interface GoalSearchResults extends BaseSearchResults {
    Items         : GoalDto[];
}
