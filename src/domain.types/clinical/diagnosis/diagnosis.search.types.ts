import { DiagnosisDto } from "./diagnosis.dto";
import { ClinicalInterpretation, ClinicalValidationStatus } from "../../miscellaneous/clinical.types";
import { BaseSearchFilters, BaseSearchResults } from "../../../domain.types/miscellaneous/base.search.types";
import { uuid } from "../../../domain.types/miscellaneous/system.types";

//////////////////////////////////////////////////////////////////////

export interface DiagnosisSearchFilters extends BaseSearchFilters{
    Type?                     : string;
    PatientUserId?            : uuid;
    MedicalPractitionerUserId?: uuid;
    VisitId?                  : uuid;
    MedicalConditionId?       : uuid;
    IsClinicallyActive?       : boolean;
    FulfilledByOrganizationId?: uuid;
    ValidationStatus?         : ClinicalValidationStatus;
    Interpretation?           : ClinicalInterpretation;
    OnsetDateFrom?            : Date;
    OnsetDateTo?              : Date;
}

export interface DiagnosisSearchResults extends BaseSearchResults{
    Items: DiagnosisDto[];
}
