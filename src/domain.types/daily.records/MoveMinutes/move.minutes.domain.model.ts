export interface MoveMinutesDomainModel {
    id?: string;
    PersonId: string;
    PatientUserId?: string;
    MoveMinutes: number;
    Unit: string;
    RecordDate?: Date;
}
