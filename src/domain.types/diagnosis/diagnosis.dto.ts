import { ClinicalInterpretation, ClinicalValidationStatus } from "../miscellaneous/clinical.types";
import { PatientDto } from "../patient/patient/patient.dto";
import { MedicalConditionDto } from "../static.types/medical.condition/medical.condition.dto";

export interface DiagnosisDto {
    id?: string;
    EhrId?: string;
    Patient: PatientDto;
    MedicalPractitionerUserId?: string;
    VisitId?: string;
    MedicalCondition?: MedicalConditionDto;
    Comments?: string;
    IsClinicallyActive?: boolean;
    ValidationStatus?: ClinicalValidationStatus;
    Interpretation?: ClinicalInterpretation;
    OnsetDate?: Date;
    EndDate?: Date;
}
