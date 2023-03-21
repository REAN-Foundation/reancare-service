import { uuid } from "../../../../domain.types/miscellaneous/system.types";

export interface BloodPressureDomainModel {
    id?              : uuid;
    EhrId?           : string;
    PatientUserId?   : uuid;
    TerraSummaryId?   : string;
    Provider?         : string;
    Systolic         : number;
    Diastolic        : number;
    Unit             : string;
    RecordDate?      : Date;
    RecordedByUserId?: uuid;
    RecordedByEhrId? : uuid;
}
