export interface SleepDto {
    id?           : string;
    PatientUserId : string;
    PatientId?    : string;
    SleepDuration : number;
    Unit          : string;
    StartTime?    : Date;
    EndTime?      : Date;
    RecordDate?   : Date;
}
