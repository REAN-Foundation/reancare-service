export interface SleepDomainModel {
    id?: string;
    PersonId: string;
    PatientUserId?: string;
    SleepDuration: number;
    Unit: string;
    RecordDate?: Date;
}
