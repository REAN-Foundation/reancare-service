import {
    MedicationAdministrationRoutes, MedicationDosageUnits, MedicationDurationUnits,
    MedicationFrequencyUnits, MedicationTimeSchedules
} from "./medication.types";

export interface MedicationDomainModel {
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
    RefillNeeded?             : boolean;
    RefillCount?              : number;
    Instructions?             : string;
    ImageResourceId?          : string;
    IsExistingMedication?     : boolean;
    TakenForLastNDays?        : number;
    ToBeTakenForNextNDays?    : number;
    IsCancelled?              : boolean;
}
