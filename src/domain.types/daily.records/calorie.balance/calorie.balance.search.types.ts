import { CalorieBalanceDto } from "./calorie.balance.dto";

export interface CalorieBalanceSearchFilters {
    PersonId?: string;
    PatientUserId?: string;
    MinCaloriesConsumedValue?: number;
    MaxCaloriesConsumedValue?: number;
    MinCaloriesBurnedValue?: number;
    MaxCaloriesBurnedValue?: number;
    MinCalorieBalanceValue?: number;
    MaxCalorieBalanceValue?: number;
    CreatedDateFrom?: Date;
    CreatedDateTo?: Date;
    OrderBy: string;
    Order: string;
    PageIndex: number;
    ItemsPerPage: number;
}

export interface CalorieBalanceSearchResults {
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order: string;
    OrderedBy: string;
    Items: CalorieBalanceDto[];
}
