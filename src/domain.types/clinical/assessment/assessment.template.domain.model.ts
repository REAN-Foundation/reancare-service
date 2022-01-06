import { uuid } from "../../miscellaneous/system.types";
export interface AssessmentTemplateDomainModel {
    id?              : uuid;
    EhrId?           : uuid;
    PatientUserId?   : uuid;
    BloodGlucose     : number;
    Unit             : string;
    RecordDate?      : Date;
    RecordedByUserId?: uuid;
}
