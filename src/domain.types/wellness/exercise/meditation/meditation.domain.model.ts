import { uuid } from "../../../../domain.types/miscellaneous/system.types";

export interface MeditationDomainModel {
    id?             : uuid,
    EhrId?          : string;
    PatientUserId   : uuid;
    Meditation?     : string;
    Description?    : string;
    Category?       : string;
    DurationInMins? : number;
    StartTime       : Date;
    EndTime?        : Date;
}
