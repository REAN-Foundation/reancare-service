import { uuid } from "../../../../domain.types/miscellaneous/system.types";

export interface StepCountDomainModel {
    id?           : uuid;
    PatientUserId?: uuid;
    StepCount?    : number;
    Unit?         : string;
    RecordDate    : Date;
}
