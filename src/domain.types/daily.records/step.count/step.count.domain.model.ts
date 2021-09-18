export interface StepCountDomainModel {
    id?          : string;
    PatientUserId: string;
    StepCount    : number;
    Unit         : string;
    RecordDate?  : Date;
}
