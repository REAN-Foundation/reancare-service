export interface GoalDto {
    id?: string;
    PatientUserId: string;
    ActionId: string;
    CarePlanId: number;
    TypeCode?: number;
    TypeName?: string;
    GoalId?: string;
    GoalAchieved: boolean;
    GoalAbandoned: boolean;
}
