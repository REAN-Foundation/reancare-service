import { DiagnosisDto } from "./diagnosis.dto";
import { DiagnosisInterpretation, ValidationStatus } from "./diagnosis.types";

//////////////////////////////////////////////////////////////////////

export interface DiagnosisSearchFilters {
    Type?: string;
    PatientUserId?: string;
    MedicalPractitionerUserId?: string;
    VisitId?: string;
    MedicalConditionId?: string;
    IsClinicallyActive?: boolean;
    FulfilledByOrganizationId?: string;
    ValidationStatus?: ValidationStatus;
    Interpretation?: DiagnosisInterpretation;
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
