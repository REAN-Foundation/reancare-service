import { ProgressStatus } from "../../../miscellaneous/system.types";

export interface SymptomAssessmentDomainModel {
    id?                  : string,
    EhrId?               : string;
    PatientUserId?       : string;
    Title?               : string;
    AssessmentTemplateId?: string;
    OverallStatus?       : ProgressStatus;
    AssessmentDate?      : Date;
}
