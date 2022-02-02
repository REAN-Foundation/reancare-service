import { GoalDto } from "../goal/goal.dto";

export interface GoalSearchFilters {
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
    CreatedDateFrom?     : Date;
    CreatedDateTo?       : Date;
    Order?               : string;
    OrderBy?             : string;
    PageIndex?           : number;
    ItemsPerPage?        : number;
}

export interface GoalSearchResults {
    TotalCount    : number;
    RetrievedCount: number;
    PageIndex     : number;
    ItemsPerPage  : number;
    Order         : string;
    OrderedBy     : string;
    Items         : GoalDto[];
}
