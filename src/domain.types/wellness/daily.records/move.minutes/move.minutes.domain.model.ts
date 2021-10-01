export interface MoveMinutesDomainModel {
    id?          : string;
    PatientUserId: string;
    MoveMinutes  : number;
    Unit         : string;
    RecordDate?  : Date;
}
