export interface BloodOxygenSaturationDomainModel {
    id?: string;
    EhrId?: string;
    PersonId: string;
    PatientUserId?: string;
    BloodOxygenSaturation: number;
    Unit: string;
    RecordDate?: Date;
    RecordedByUserId?: string;
}
