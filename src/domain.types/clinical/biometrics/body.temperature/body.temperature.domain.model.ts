import { uuid } from "../../../../domain.types/miscellaneous/system.types";

export interface BodyTemperatureDomainModel {
    id?              : uuid;
    EhrId?           : string;
    PatientUserId    : uuid;
    TerraSummaryId?   : string;
    Provider?         : string;
    BodyTemperature  : number;
    Unit             : string;
    RecordDate?      : Date;
    RecordedByUserId?: uuid;
    RecordedByEhrId?: uuid;
}
