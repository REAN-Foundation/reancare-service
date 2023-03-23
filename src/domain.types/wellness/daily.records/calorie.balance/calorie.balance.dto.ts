import { uuid } from "../../../../domain.types/miscellaneous/system.types";

export interface CalorieBalanceDto {
    id?             : uuid;
    PatientUserId   : uuid;
    TerraSummaryId? : string;
    Provider?       : string;
    CaloriesConsumed: number;
    CaloriesBurned  : number;
    CalorieBalance  : number;
    Unit            : string;
    RecordDate?     : Date;
}
