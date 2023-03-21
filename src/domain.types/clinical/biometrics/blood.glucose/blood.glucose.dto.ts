export interface BloodGlucoseDto {
    id?               : string;
    EhrId?            : string;
    PatientUserId     : string;
    TerraSummaryId?   : string;
    Provider?         : string;
    BloodGlucose      : number;
    Unit              : string;
    RecordDate?       : Date;
    RecordedByUserId? : string;
}
