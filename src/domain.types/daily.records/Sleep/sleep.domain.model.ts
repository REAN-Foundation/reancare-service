export interface SleepDomainModel {
    id?           : string;
    PatientUserId?: string;
    SleepDuration : number;
    Unit          : string;
    RecordDate?   : Date;
}
