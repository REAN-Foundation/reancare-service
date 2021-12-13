import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { ProgressStatus } from "../../../miscellaneous/system.types";

export interface SymptomAssessmentDomainModel {
    id?                  : uuid,
    EhrId?               : uuid;
    PatientUserId?       : uuid;
    Title?               : string;
    AssessmentTemplateId?: uuid;
    OverallStatus?       : ProgressStatus;
    AssessmentDate?      : Date;
}
