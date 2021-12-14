export interface EnrollmentDto {
    id?             : string;
    UserId          : string;
    CareplanCode?   : string;
    CareplanProvider: string;
    CareplanName    : string;
    ParticipantId   : number;
    IsActive        : boolean;
    EnrollmentId    : number;
    StartAt?        : Date;
    EndAt?          : Date;
   
}
