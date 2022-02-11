export interface ActionPlanDomainModel {
    id?                  : string;
    PatientUserId?       : string;
    Provider?            : string;
    ProviderCareplanCode?: string;
    ProviderCareplanName?: string;
    ProviderEnrollmentId?: string;
    GoalId?              : string;
    Title?               : string;
    StartedAt?           : Date;
    ScheduledEndDate?    : Date;
}
