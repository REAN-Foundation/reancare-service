import { ClinicalValidationStatus } from "../../miscellaneous/clinical.types";

export interface DoctorNoteDto {
    id?                       : string,
    EhrId?                    : string;
    PatientUserId?            : string;
    MedicalPractitionerUserId?: string;
    VisitId?                  : string;
    Notes?                    : string;
    ValidationStatus?         : ClinicalValidationStatus;
    RecordDate?               : Date;
}
