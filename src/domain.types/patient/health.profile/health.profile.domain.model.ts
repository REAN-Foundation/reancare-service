import { BloodGroup, MaritalStatus, Severity } from "../../miscellaneous/system.types";

export interface HealthProfileDomainModel {
    id?: string;
    PatientUserId?: string;
    BloodGroup?: BloodGroup;
    MajorAilment?: string;
    OtherConditions?: string;
    IsDiabetic?: boolean;
    HasHeartAilment?: boolean;
    MaritalStatus?: MaritalStatus;
    Ethnicity?: string;
    Nationality?: string;
    Occupation?: string;
    SedentaryLifestyle?: boolean;
    IsSmoker?: boolean;
    SmokingSeverity?: Severity;
    SmokingSince?: Date;
    IsDrinker?: boolean;
    DrinkingSeverity?: Severity;
    DrinkingSince?: Date;
    SubstanceAbuse?: boolean;
    ProcedureHistory?: string;
    ObstetricHistory?: string;
    OtherInformation?: string;
    TobaccoQuestion?: string;
    TobaccoQuestionAns?: boolean;
}
