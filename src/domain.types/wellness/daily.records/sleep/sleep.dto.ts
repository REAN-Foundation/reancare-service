export interface SleepDto {
    id?           : string;
    PatientUserId : string;
    PatientId?    : string;
    SleepDuration : number;
    Unit          : string;
    RecordDate?   : Date;
}
