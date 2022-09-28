import { uuid } from "../../miscellaneous/system.types";

export interface DiagnosticConditionDomainModel {
    id?: uuid;
    PatientUserId: uuid;
    EhrId?: uuid;
    DoctorUserId: uuid;
    DoctorEhrId?: uuid;
    MedicalConditionId?: uuid;
    MedicalConditionEhrId?: uuid;
    MedicalCondition?: MedicalConditionDomainModel;
    OnsetDate?:Date;
    EndDate?:Date;
    Comments?: string;
    ClinicalStatus: string;
    ValidationStatus?: number;
    Interpretation?: number;

    }

//#endregion

export interface DiagnosticConditionSearchFilters {
    PatientUserId: uuid,
    RecordDate: Date;
}

export interface MedicalConditionDomainModel {
    id?: uuid;
    FhirId?: uuid;
    Condition?: string;
    Description?: string;
    BodySite?: string;
    Language?: string
}
