export interface GoalDto {
    id?                  : string;
    PatientUserId?       : string;
    Provider?            : string;
    ProviderEnrollmentId?: string;
    ProviderCareplanName?: string;
    ProviderCareplanCode?: string;
    ProviderGoalCode?    : string;
    Title?               : string;
    Sequence?            : string;
    HealthPriorityId?    : string;
    GoalAchieved?        : boolean;
    GoalAbandoned?       : boolean;
    StartedAt?           : Date;
    CompletedAt?         : Date;
    ScheduledEndDate?    : Date;
}
