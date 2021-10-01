
export interface WaterConsumptionDomainModel {
    id?: string,
    EhrId?: string;
    PatientUserId: string;
    Volume: number;
    Time?: Date;
}
