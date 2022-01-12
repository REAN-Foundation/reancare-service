import { GoalDto } from "../goal/goal.dto";

export interface GoalSearchFilters {
    PatientUserId?  : string;
    CarePlanId?     : number;
    TypeCode?       : number;
    TypeName?       : string;
    GoalId?         : string;
    ActionId?       : string;
    GoalAchieved    : boolean;
    GoalAbandoned   : boolean
    CreatedDateFrom?: Date;
    CreatedDateTo?  : Date;
    OrderBy         : string;
    Order           : string;
    PageIndex       : number;
    ItemsPerPage    : number;
}

export interface GoalSearchResults {
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order: string;
    OrderedBy: string;
    Items: GoalDto[];
}
