import { DiagnosisDto } from "./diagnosis.dto";
import { ClinicalInterpretation, ClinicalValidationStatus } from "../miscellaneous/clinical.types";

//////////////////////////////////////////////////////////////////////

export interface DiagnosisSearchFilters {
    Type?: string;
    PatientUserId?: string;
    MedicalPractitionerUserId?: string;
    VisitId?: string;
    MedicalConditionId?: string;
    IsClinicallyActive?: boolean;
    FulfilledByOrganizationId?: string;
    ValidationStatus?: ClinicalValidationStatus;
    Interpretation?: ClinicalInterpretation;
    OnsetDateFrom?: Date;
    OnsetDateTo?: Date;
    OrderBy: string;
    Order: string;
    PageIndex: number;
    ItemsPerPage: number;
}

export interface DiagnosisSearchResults {
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order: string;
    OrderedBy: string;
    Items: DiagnosisDto[];
}
