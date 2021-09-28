import {
    MedicationConsumptionStatus,
} from "./medication.consumption.types";

export interface MedicationConsumptionDetailsDto {
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
    Status?           : MedicationConsumptionStatus;
}

export interface MedicationConsumptionDto {
    id?               : string,
    DrugName?         : string;
    Details?          : string;
    TimeScheduleStart?: Date;
    TimeScheduleEnd?  : Date;
    Status?           : MedicationConsumptionStatus;
}

export interface ConsumptionSummaryDto {
    Missed  : number,
    Taken   : number,
    Unknown : number,
    Upcoming: number,
    Overdue : number
}

export interface ConsumptionSummaryByDrugDto {
    Drug?       : string;
    DrugSummary?: ConsumptionSummaryDto;
    Schedule?   : MedicationConsumptionDto[];
}

export interface ConsumptionSummaryForMonthDto {
    Month?          : string;
    SummaryForMonth?: ConsumptionSummaryByDrugDto[];
}
