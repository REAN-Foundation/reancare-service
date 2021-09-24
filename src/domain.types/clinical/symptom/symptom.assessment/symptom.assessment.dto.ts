import { ProgressStatus } from "../../../miscellaneous/system.types";
import { SymptomDto } from "../symptom/symptom.dto";

export interface SymptomAssessmentDto {
    id?                  : string,
    EhrId?               : string;
    PatientUserId?       : string;
    Title?               : string;
    AssessmentTemplateId?: string;
    OverallStatus?       : ProgressStatus;
    AssessmentDate?      : Date;
    SymptomsRecorded     : SymptomDto[];
}
