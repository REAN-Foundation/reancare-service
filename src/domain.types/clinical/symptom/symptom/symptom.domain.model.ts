import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { ClinicalValidationStatus, ClinicalInterpretation } from "../../../../domain.types/miscellaneous/clinical.types";
import { Severity } from "../../../../domain.types/miscellaneous/system.types";

export interface SymptomDomainModel {
    id?                       : uuid,
    EhrId?                    : uuid;
    PatientUserId?            : uuid;
    MedicalPractitionerUserId?: uuid;
    VisitId?                  : uuid;
    AssessmentId?             : uuid;
    AssessmentTemplateId?     : uuid;
    SymptomTypeId?            : uuid;
    Symptom?                  : string;
    IsPresent?                : boolean;
    Severity?                 : Severity;
    ValidationStatus?         : ClinicalValidationStatus;
    Interpretation?           : ClinicalInterpretation;
    Comments?                 : string;
    RecordDate?               : Date;
}
