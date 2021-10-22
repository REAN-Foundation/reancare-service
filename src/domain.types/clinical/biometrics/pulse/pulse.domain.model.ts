export interface PulseDomainModel {
    id?: string;
    EhrId?: string;
    PatientUserId: string;
    Pulse: number;
    Unit: string;
    RecordDate?: Date;
    RecordedByUserId?: string;
}
