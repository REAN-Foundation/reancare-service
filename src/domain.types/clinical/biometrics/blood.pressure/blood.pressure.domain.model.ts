import { uuid } from "../../../../domain.types/miscellaneous/system.types";

export interface BloodPressureDomainModel {
    id?              : uuid;
    EhrId?           : string;
    PatientUserId?   : uuid;
    Systolic         : number;
    Diastolic        : number;
    Unit             : string;
    RecordDate?      : Date;
    RecordedByUserId?: uuid;
    RecordedByEhrId? : uuid;
}
