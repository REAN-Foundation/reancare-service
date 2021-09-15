import { DiagnosisInterpretation, ValidationStatus } from "./diagnosis.types";

export interface DiagnosisDomainModel {
    id?: string,
    EhrId?: string;
    PatientUserId?: string;
    MedicalPractitionerUserId?: string;
    VisitId?: string;
    MedicalConditionId?: string;
    Comments?: string;
    IsClinicallyActive?: boolean;
    ValidationStatus?: ValidationStatus;
    Interpretation?: DiagnosisInterpretation;
    OnsetDate?: Date;
    EndDate?: Date;
}
