import { uuid } from "../../../../domain.types/miscellaneous/system.types";

export interface CalorieBalanceDomainModel {
    id?              : uuid;
    PatientUserId?   : uuid;
    TerraSummaryId?  : string;
    Provider?        : string;
    CaloriesConsumed?: number;
    CaloriesBurned?  : number;
    Unit?            : string;
    RecordDate?      : Date;
}
