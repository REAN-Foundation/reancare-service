import { Severity } from "../../miscellaneous/system.types";
import { uuid } from "../../../domain.types/miscellaneous/system.types";

export interface ComplaintDomainModel {
    id?                       : uuid;
    PatientUserId             : uuid;
    MedicalPractitionerUserId?: uuid;
    VisitId?                  : uuid;
    EhrId?                    : uuid;
    Complaint                 : string;
    Severity?                 : Severity;
    RecordDate?               : Date;
}
