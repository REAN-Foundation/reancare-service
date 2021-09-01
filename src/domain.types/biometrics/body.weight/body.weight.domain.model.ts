export interface BodyWeightDomainModel {
    id?: string;
    EhrId?: string;
    PersonId: string;
    PatientUserId?: string;
    BodyWeight: number;
    Unit: string;
    RecordDate?: Date;
    RecordedByUserId?: string;
}
