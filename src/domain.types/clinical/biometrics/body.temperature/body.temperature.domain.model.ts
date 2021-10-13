export interface BodyTemperatureDomainModel {
    id?: string;
    EhrId?: string;
    PatientUserId: string;
    BodyTemperature: number;
    Unit: string;
    RecordDate?: Date;
    RecordedByUserId?: string;
}
