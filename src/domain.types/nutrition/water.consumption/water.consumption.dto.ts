
export interface WaterConsumptionDto {
    EhrId?: string;
    PatientUserId?: string;
    Volume: number;
    Time?: Date;
}

export interface WaterConsumptionForDayDto {
    PatientUserId?: string;
    Date: Date;
    Consumptions: WaterConsumptionDto[];
    TotalVolume: number;
}
