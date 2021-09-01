export interface BloodPressureDomainModel {
    id?: string;
    EhrId?: string;
    PersonId: string;
    PatientUserId?: string;
    Systolic: number;
    Diastolic: number;
    Unit: string;
    RecordDate?: Date;
    RecordedByUserId?: string;
}
