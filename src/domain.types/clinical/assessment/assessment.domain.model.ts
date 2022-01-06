import { uuid } from "../../miscellaneous/system.types";

export interface AssessmentDomainModel {
    id?              : uuid;
    EhrId?           : uuid;
    PatientUserId?   : uuid;
    BloodGlucose     : number;
    Unit             : string;
    RecordDate?      : Date;
    RecordedByUserId?: uuid;
}
