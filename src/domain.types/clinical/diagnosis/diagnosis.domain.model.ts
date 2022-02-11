import { ClinicalInterpretation, ClinicalValidationStatus } from "../../miscellaneous/clinical.types";
import { uuid } from "../../../domain.types/miscellaneous/system.types";

export interface DiagnosisDomainModel {
    id?                       : uuid,
    EhrId?                    : uuid;
    PatientUserId?            : uuid;
    MedicalPractitionerUserId?: uuid;
    VisitId?                  : uuid;
    MedicalConditionId?       : uuid;
    Comments?                 : string;
    IsClinicallyActive?       : boolean;
    ValidationStatus?         : ClinicalValidationStatus;
    Interpretation?           : ClinicalInterpretation;
    OnsetDate?                : Date;
    EndDate?                  : Date;
}
