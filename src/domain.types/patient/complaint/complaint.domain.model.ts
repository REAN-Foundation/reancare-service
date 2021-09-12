import { Severity } from "../../miscellaneous/system.types";

export interface AllergyDomainModel {
    id?: string;
    PatientUserId: string;
    MedicalPractitionerUserId?: string;
    VisitId?: string;
    EhrId?: string;
    Complaint: string;
    Severity?: Severity;
    RecordDate?: Date;
}
