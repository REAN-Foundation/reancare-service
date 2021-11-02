import { ClinicalValidationStatus } from "../../miscellaneous/clinical.types";

export interface DoctorNoteDomainModel {
    id?                       : string,
    EhrId?                    : string;
    PatientUserId?            : string;
    MedicalPractitionerUserId?: string;
    VisitId?                  : string;
    Notes?                    : string;
    ValidationStatus?         : ClinicalValidationStatus;
    RecordDate?               : Date;
}
