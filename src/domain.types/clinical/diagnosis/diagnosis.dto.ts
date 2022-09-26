import { ClinicalInterpretation, ClinicalValidationStatus } from "../../miscellaneous/clinical.types";
import { PatientDto } from "../../users/patient/patient/patient.dto";
import { MedicalConditionDto } from "../medical.condition/medical.condition.dto";

export interface DiagnosisDto {
    id?                       : string;
    EhrId?                    : string;
    Patient                   : PatientDto;
    MedicalPractitionerUserId?: string;
    VisitId?                  : string;
    MedicalCondition?         : MedicalConditionDto;
    Comments?                 : string;
    IsClinicallyActive?       : boolean;
    ValidationStatus?         : ClinicalValidationStatus;
    Interpretation?           : ClinicalInterpretation;
    OnsetDate?                : Date;
    EndDate?                  : Date;
}
