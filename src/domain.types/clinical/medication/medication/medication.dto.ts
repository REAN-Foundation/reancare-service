import {
    MedicationAdministrationRoutes, MedicationDosageUnits, MedicationDurationUnits,
    MedicationFrequencyUnits, MedicationTimeSchedules
} from "./medication.types";

export interface ConsumptionSummaryDto {
    TotalConsumptionCount   ?: number;
    TotalDoseCount          ?: number;
    PendingConsumptionCount ?: number;
    PendingDoseCount        ?: number;
}

export interface MedicationDto {
    id?                       : string,
    EhrId?                    : string;
    PatientUserId?            : string;
    MedicalPractitionerUserId?: string;
    VisitId?                  : string;
    OrderId?                  : string;
    DrugName?                 : string;
    DrugId?                   : string;
    Dose?                     : string | number;
    DosageUnit?               : MedicationDosageUnits;
    TimeSchedules?            : MedicationTimeSchedules[];
    Frequency?                : number;
    FrequencyUnit?            : MedicationFrequencyUnits;
    Route?                    : MedicationAdministrationRoutes;
    Duration?                 : number;
    DurationUnit?             : MedicationDurationUnits;
    StartDate?                : Date;
    EndDate?                  : Date;
    ConsumptionSummary?       : ConsumptionSummaryDto;
    RefillNeeded?             : boolean;
    RefillCount?              : number;
    Instructions?             : string;
    ImageResourceId?          : string;
    IsExistingMedication?     : boolean;
    TakenForLastNDays?        : number;
    ToBeTakenForNextNDays?    : number;
    IsCancelled?              : boolean;
}
