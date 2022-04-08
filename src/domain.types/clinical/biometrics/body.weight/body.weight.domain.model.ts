import { uuid } from "../../../../domain.types/miscellaneous/system.types";

export interface BodyWeightDomainModel {
    id?              : uuid;
    EhrId?           : string;
    PatientUserId    : uuid;
    BodyWeight       : number;
    Unit             : string;
    RecordDate?      : Date;
    RecordedByUserId?: uuid;
    RecordedByEhrId? : uuid;
}
