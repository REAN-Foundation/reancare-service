
///////////////////////////////////////////////////////////////////////////////

export interface BodyWeightDto {
    id?: string;
    EhrId?: string;
    PatientUserId: string;
    PatientId?: string;
    BodyWeight: number;
    Unit: string;
    RecordDate?: Date;
    RecordedByUserId?: string;
}
