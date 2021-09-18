export interface BloodOxygenSaturationDomainModel {
    id?: string;
    EhrId?: string;
    PatientUserId: string;
    BloodOxygenSaturation: number;
    Unit: string;
    RecordDate?: Date;
    RecordedByUserId?: string;
}
