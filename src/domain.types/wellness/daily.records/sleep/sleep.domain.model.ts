import { uuid } from "../../../../domain.types/miscellaneous/system.types";

export interface SleepDomainModel {
    id?            : uuid;
    PatientUserId? : string;
    SleepDuration? : number;
    SleepMinutes?  : number;
    Unit?          : string;
    RecordDate?    : Date;
}
