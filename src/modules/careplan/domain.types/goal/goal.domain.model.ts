export interface CareplanGoalDomainModel {
    id?             : string;
    PatientUserId?  : string;
    Provider?       : string;
    PlanCode?       : string;
    PlanName?       : string;
    ParticipantId?  : string;
    EnrollmentId?   : string;
    ProviderActionId: string;
    GoalId?         : number;
    GoalCode?       : number;
    Name?           : string;
    Sequence?       : number;
    Categories?     : [];
    ScheduledAt?    : Date;
}
