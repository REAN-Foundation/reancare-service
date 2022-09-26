export interface FamilyHistoryDomainModel {
    PatientUserId?: string;
    EhrId?        : string;
    Relationship? : string;
    Condition?    : string;
    ConditionId?  : string;
    Status?       : string;
    Date?         : Date;
}
