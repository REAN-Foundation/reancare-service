export interface CalorieBalanceDto {
    id?: string;
    PatientUserId: string;
    PatientId?: string;
    CaloriesConsumed: number;
    CaloriesBurned: number;
    CalorieBalance: number;
    Unit: string;
    RecordDate?: Date;
}
