export interface StepCountDomainModel {
    id?: string;
    PersonId: string;
    PatientUserId?: string;
    StepCount: number;
    Unit: string;
    RecordDate?: Date;
}
