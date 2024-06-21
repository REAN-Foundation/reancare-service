export interface SleepDto {
    id?            : string;
    PatientUserId  : string;
    PatientId?     : string;
    SleepDuration? : number;
    SleepMinutes?  : number;
    Unit?          : string;
    RecordDate?    : Date;
}
