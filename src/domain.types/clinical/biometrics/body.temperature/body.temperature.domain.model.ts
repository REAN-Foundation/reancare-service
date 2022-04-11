import { uuid } from "../../../../domain.types/miscellaneous/system.types";

export interface BodyTemperatureDomainModel {
    id?              : uuid;
    EhrId?           : string;
    PatientUserId    : uuid;
    BodyTemperature  : number;
    Unit             : string;
    RecordDate?      : Date;
    RecordedByUserId?: uuid;
    RecordedByEhrId?: uuid;
}
