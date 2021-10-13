export interface BodyHeightDto {
    id?: string;
    EhrId?: string;
    PatientUserId: string;
    PatientId?: string;
    BodyHeight: number;
    Unit: string;
    RecordDate?: Date;
    RecordedByUserId?: string;
}
