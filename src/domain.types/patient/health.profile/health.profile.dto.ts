export interface HealthProfileDto {
    id: string;
    PatientUserId?: string;
    BloodGroup?: string;
    MajorAilment?: string;
    OtherConditions?: string;
    IsDiabetic?: boolean;
    HasHeartAilment?: boolean;
    MaritalStatus?: string;
    Ethnicity?: string;
    Nationality?: string;
    Occupation?: string;
    SedentaryLifestyle?: boolean;
    IsSmoker?: boolean;
    SmokingSeverity?: string;
    SmokingSince?: Date;
    IsDrinker?: boolean;
    DrinkingSeverity?: string;
    DrinkingSince?: Date;
    SubstanceAbuse?: boolean;
    ProcedureHistory?: string;
    ObstetricHistory?: string;
    OtherInformation?: string;
}
