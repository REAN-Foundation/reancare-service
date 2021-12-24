export interface ParticipantDto {
    id?          : string;
    PatientUserId: string;
    ParticipantId: string;
    Provider     : string;
    IsActive?    : boolean;
}
