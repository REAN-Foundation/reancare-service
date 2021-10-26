export interface PulseDto {
    id?              : string;
    EhrId?           : string;
    PatientUserId    : string;
    PatientId?       : string;
    Pulse            : number;
    Unit             : string;
    RecordDate?      : Date;
    RecordedByUserId?: string;
}
