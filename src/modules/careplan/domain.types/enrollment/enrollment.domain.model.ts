export interface EnrollmentDomainModel {
    id?             : string;
    UserId          : string;
    EnrollmentId    : number;
    ParticipantId   : number;
    CareplanProvider: string;
    CareplanName    : string;
    CareplanCode?   : string;
    StartDate?      : Date;
    EndDate?        : Date;
    Gender          : string;
}
