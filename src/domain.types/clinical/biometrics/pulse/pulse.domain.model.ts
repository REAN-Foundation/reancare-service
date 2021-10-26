import { uuid } from "../../../../domain.types/miscellaneous/system.types";

export interface PulseDomainModel {
    id?              : uuid;
    EhrId?           : string;
    PatientUserId    : uuid;
    Pulse            : number;
    Unit             : string;
    RecordDate?      : Date;
    RecordedByUserId?: uuid;
}
