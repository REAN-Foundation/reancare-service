import { ClinicalInterpretation, ClinicalValidationStatus } from "../miscellaneous/clinical.types";

export interface DiagnosisDomainModel {
    id?: string,
    EhrId?: string;
    PatientUserId?: string;
    MedicalPractitionerUserId?: string;
    VisitId?: string;
    MedicalConditionId?: string;
    Comments?: string;
    IsClinicallyActive?: boolean;
    ValidationStatus?: ClinicalValidationStatus;
    Interpretation?: ClinicalInterpretation;
    OnsetDate?: Date;
    EndDate?: Date;
}
