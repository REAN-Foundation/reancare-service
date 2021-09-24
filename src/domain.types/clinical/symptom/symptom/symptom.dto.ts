import { ClinicalValidationStatus, ClinicalInterpretation } from "../../../../domain.types/miscellaneous/clinical.types";
import { Severity } from "../../../../domain.types/miscellaneous/system.types";

export interface SymptomDto {
    id?                       : string,
    EhrId?                    : string;
    PatientUserId?            : string;
    MedicalPractitionerUserId?: string;
    VisitId?                  : string;
    AssessmentId?             : string;
    AssessmentTemplateId?     : string;
    SymptomTypeId?            : string;
    Symptom?                  : string;
    IsPresent?                : boolean;
    Severity?                 : Severity;
    ValidationStatus?         : ClinicalValidationStatus;
    Interpretation?           : ClinicalInterpretation;
    Comments?                 : string;
    RecordDate?               : Date;
}
