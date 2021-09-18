
export interface MedicationConsumptionDomainModel {
    id?               : string,
    EhrId?            : string;
    PatientUserId?    : string;
    MedicationId?     : string;
    DrugName?         : string;
    DrugId?           : string;
    Dose?             : number;
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
