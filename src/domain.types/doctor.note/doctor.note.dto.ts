import { ValidationStatus } from "../diagnosis/diagnosis.types";

export interface DoctorNoteDto {
    id?: string,
    EhrId?: string;
    PatientUserId?: string;
    MedicalPractitionerUserId?: string;
    VisitId?: string;
    Notes?: string;
    ValidationStatus?: ValidationStatus;
    RecordDate?: Date;
}
