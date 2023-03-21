import { uuid } from "../../../../domain.types/miscellaneous/system.types";

export interface StepCountDomainModel {
    id?           : uuid;
    PatientUserId?: uuid;
    TerraSummaryId? : string;
    Provider?       : string;
    StepCount?    : number;
    Unit?         : string;
    RecordDate    : Date;
}
