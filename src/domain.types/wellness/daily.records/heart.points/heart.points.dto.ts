export interface HeartPointsDto {
    id?          : string;
    EhrId?       : string;
    PatientUserId: string;
    HeartPoints  : number;
    Unit         : string;
    RecordDate?  : Date;
}
