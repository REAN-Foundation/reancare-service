export interface CalorieBalanceDomainModel {
    id?: string;
    PatientUserId?: string;
    CaloriesConsumed?: number;
    CaloriesBurned?: number;
    Unit?: string;
    RecordDate?: Date;
}
