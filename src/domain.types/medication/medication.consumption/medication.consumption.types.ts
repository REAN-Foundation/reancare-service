export enum MedicationConsumptionStatus {
    Overdue   = 'overdue',
    Cancelled = 'cancelled',
    Taken     = 'taken',
    Missed    = 'missed',
    Upcoming  = 'upcoming',
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
