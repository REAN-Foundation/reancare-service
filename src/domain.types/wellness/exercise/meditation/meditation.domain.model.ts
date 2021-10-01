
export interface MeditationDomainModel {
    id?: string,
    EhrId?: string;
    PatientUserId: string;
    Meditation: string;
    Description?: string;
    Category?: string;
    StartTime: Date;
    EndTime: Date;
}
