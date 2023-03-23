
export interface WaterConsumptionDto {
    id?          : string;
    EhrId?       : string;
    PatientUserId: string;
    TerraSummaryId? : string;
    Provider?       : string;
    Volume       : number;
    Time?        : Date;
}

export interface WaterConsumptionForDayDto {
    PatientUserId?: string;
    Date          : Date;
    Consumptions  : WaterConsumptionDto[];
    TotalVolume   : number;
}
