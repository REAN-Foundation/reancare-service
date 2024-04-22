import { Uuid } from "aws-sdk/clients/ssmcontacts";
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { ClinicalInterpretation, ClinicalValidationStatus } from "../../miscellaneous/clinical.types";

export interface DiagnosisDto {
    id?                       : string;
    EhrId?                    : string;
    PatientUserId             : uuid;
    MedicalPractitionerUserId?: string;
    VisitId?                  : string;
    MedicalConditionId?       : Uuid;
    Comments?                 : string;
    IsClinicallyActive?       : boolean;
    ValidationStatus?         : ClinicalValidationStatus;
    Interpretation?           : ClinicalInterpretation;
    OnsetDate?                : Date;
    EndDate?                  : Date;
}
