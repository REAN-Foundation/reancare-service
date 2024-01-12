
export interface MedicationConsumptionDomainModel {
    id?               : string,
    EhrId?            : string;
    PatientUserId?    : string;
    MedicationId?     : string;
    DrugName?         : string;
    DrugId?           : string;
    Dose?             : string | number;
    Details?          : string;
    TimeScheduleStart?: Date;
    TimeScheduleEnd?  : Date;
    IsTaken?          : boolean;
    TakenAt?          : Date;
    IsMissed?         : boolean;
    IsCancelled?      : boolean;
    CancelledOn?      : Date;
    Note?             : string;
}

export interface MedicationConsumptionScheduleDomainModel {
    PatientUserId?: string;
    Duration?     : string;
    When?         : string;
    Date?         : Date;
    GroupByDrug?  : boolean;
}

export interface MedicationConsumptionSummaryDomainModel {
    PatientUserId?    : string;
    Date?             : Date;
    PastMonthsCount?  : number;
    FutureMonthsCount?: number;
}
