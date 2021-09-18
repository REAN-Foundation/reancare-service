export enum MedicationConsumptionStatus {
    Overdue   = 'Overdue',
    Cancelled = 'Cancelled',
    Taken     = 'Taken',
    Missed    = 'Missed',
    Upcoming  = 'Upcoming',
    Unknown   = 'Unknown'
}

export const MedicationConsumptionStatusList: MedicationConsumptionStatus [] = [
    MedicationConsumptionStatus.Overdue,
    MedicationConsumptionStatus.Cancelled,
    MedicationConsumptionStatus.Taken,
    MedicationConsumptionStatus.Missed,
    MedicationConsumptionStatus.Upcoming,
    MedicationConsumptionStatus.Unknown,
];
