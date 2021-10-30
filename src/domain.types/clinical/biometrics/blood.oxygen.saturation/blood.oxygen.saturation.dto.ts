export interface BloodOxygenSaturationDto {
    id?                  : string;
    EhrId?               : string;
    PatientUserId        : string;
    PatientId?           : string;
    BloodOxygenSaturation: number;
    Unit                 : string;
    RecordDate?          : Date;
    RecordedByUserId?    : string;
}
