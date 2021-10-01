export interface BloodGlucoseDto {
    id?: string;
    EhrId?: string;
    PatientUserId: string;
    PatientId?: string;
    BloodGlucose: number;
    Unit: string;
    RecordDate?: Date;
    RecordedByUserId?: string;
}
