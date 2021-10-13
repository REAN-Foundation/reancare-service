export interface CalorieBalanceDomainModel {
    id?: string;
    PersonId: string;
    PatientUserId?: string;
    CaloriesConsumed?: number;
    CaloriesBurned?: number;
    Unit?: string;
    RecordDate?: Date;
}
