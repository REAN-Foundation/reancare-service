export interface BodyTemperatureDomainModel {
    id?: string;
    EhrId?: string;
    PersonId: string;
    PatientUserId?: string;
    BodyTemperature: number;
    Unit: string;
    RecordDate?: Date;
    RecordedByUserId?: string;
}
