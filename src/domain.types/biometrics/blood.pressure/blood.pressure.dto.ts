
export interface BloodPressureDto {
    id?: string;
    EhrId?: string;
    PatientUserId: string;
    PatientId?: string;
    Systolic: number;
    Diastolic: number;
    Unit: string;
    RecordDate?: Date;
    RecordedByUserId?: string;
}
