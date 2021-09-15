import { DiagnosisInterpretation, ValidationStatus } from "./diagnosis.types";
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
    ValidationStatus?: ValidationStatus;
    Interpretation?: DiagnosisInterpretation;
    OnsetDate?: Date;
    EndDate?: Date;
}
