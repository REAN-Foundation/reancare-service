export interface BloodOxygenSaturationDto {
    id?                  : string;
    EhrId?               : string;
    PatientUserId        : string;
    PatientId?           : string;
    TerraSummaryId?      : string;
    Provider?            : string;
    BloodOxygenSaturation: number;
    Unit                 : string;
    RecordDate?          : Date;
    RecordedByUserId?    : string;
}
