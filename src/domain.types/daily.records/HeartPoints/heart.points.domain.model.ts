export interface HeartPointsDomainModel {
    id?: string;
    PersonId: string;
    PatientUserId?: string;
    HeartPoints: number;
    Unit: string;
    RecordDate?: Date;
}
