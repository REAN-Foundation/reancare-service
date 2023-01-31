import { uuid } from "../../../miscellaneous/system.types";
import { BaseSearchFilters, BaseSearchResults } from "../../../miscellaneous/base.search.types";
import { ActionPlanDto } from "./action.plan.dto";

export interface ActionPlanSearchFilters extends BaseSearchFilters{
    PatientUserId?       : uuid;
    Provider?            : string;
    ProviderCareplanCode?: string;
    ProviderCareplanName?: string;
    ProviderEnrollmentId?: string;
    GoalId?              : string;
    Title?               : string;
    Status?              : string;
    CompletedAt?         : Date;
    StartedAt?           : Date;
    ScheduledEndDate?    : Date;
}

export interface ActionPlanSearchResults extends BaseSearchResults{
    Items: ActionPlanDto[];
}
