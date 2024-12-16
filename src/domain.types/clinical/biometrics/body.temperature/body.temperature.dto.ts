export interface BodyTemperatureDto {
    id?              : string;
    EhrId?           : string;
    PatientUserId    : string;
    TerraSummaryId?   : string;
    Provider?         : string;
    PatientId?       : string;
    BodyTemperature  : number;
    Unit             : string;
    RecordDate?      : Date;
    RecordedByUserId?: string;
}
