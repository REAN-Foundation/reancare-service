import { uuid } from "../../domain.types/miscellaneous/system.types";
import { BaseSearchFilters, BaseSearchResults } from "../miscellaneous/base.search.types";
import { ActionPlanDto } from "./goal.action.plan.dto";

export interface ActionPlanSearchFilters extends BaseSearchFilters{
    PatientUserId?       : uuid;
    Provider?            : string;
    PrividerCareplanCode?: string;
    PrividerCareplanName?: string;
    ProviderEnrollmentId?: string;
    GoalId?              : string;
    Title?               : string;
    StartedAt?           : Date;
    ScheduledEndDate?    : Date;
}

export interface ActionPlanSearchResults extends BaseSearchResults{
    Items: ActionPlanDto[];
}
