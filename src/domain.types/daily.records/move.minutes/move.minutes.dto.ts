export interface MoveMinutesDto {
    id?          : string;
    PatientUserId: string;
    PatientId?   : string;
    MoveMinutes  : number;
    Unit         : string;
    RecordDate?  : Date;
}
