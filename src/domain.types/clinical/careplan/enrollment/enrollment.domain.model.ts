export interface EnrollmentDomainModel {
    id?             : string;
    Name?           : string;
    PatientUserId?  : string;
    Provider?       : string;
    PlanCode?       : string;
    PlanName?       : string;
    ParticipantId?  : number | string;
    EnrollmentId?   : number | string;
    CareplanId?     : number;
    StartDateStr?   : string;
    EndDateStr?     : string;
    StartDate?      : Date;
    EndDate?        : Date;
    EnrollmentDate? : Date;
    Gender?         : string;
    BirthDate?      : Date;
    WeekOffset?     : number;
    DayOffset?      : number;
    Complication?   : string;
    Phone?          : string;
    HasHighRisk?    : boolean;
}
