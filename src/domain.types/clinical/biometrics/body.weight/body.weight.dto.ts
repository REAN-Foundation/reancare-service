export interface BodyWeightDto {
    id?              : string;
    EhrId?           : string;
    PatientUserId    : string;
    BodyWeight       : number;
    Unit             : string;
    RecordDate?      : Date;
    RecordedByUserId?: string;
}
