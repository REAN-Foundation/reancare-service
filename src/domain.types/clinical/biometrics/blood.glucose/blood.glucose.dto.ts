export interface BloodGlucoseDto {
    id?               : string;
    EhrId?            : string;
    PatientUserId     : string;
    BloodGlucose      : number;
    A1CLevel?         : number;
    Unit              : string;
    RecordDate?       : Date;
    RecordedByUserId? : string;
}
