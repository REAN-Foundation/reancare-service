import {
    MedicationConsumptionStatus
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

export interface StatusSummaryDto {
    Missed  : number,
    Taken   : number,
    Unknown : number,
    Upcoming: number,
    Overdue : number
}

export interface SummarizedScheduleDto {
    Drug?          : string;
    SummaryForDrug?: StatusSummaryDto;
    Schedule?      : MedicationConsumptionDto[];
}

export interface SchedulesForDayDto {
    Day?     : Date;
    Schedules: MedicationConsumptionDto[];
}

export interface SummaryForDayDto {
    Day?         : Date;
    SummaryForDay: SummarizedScheduleDto[];
}

export interface SummaryForMonthDto {
    Month?          : string;
    SummaryForMonth?: SummarizedScheduleDto;
}
