export interface GoalDomainModel {
    id?          : string;
    PatientUserId: string;
    CarePlanId: number;
    ActionId: string;
    TypeCode?    : number;
    TypeName?    : string;
    GoalId?      : string;
    GoalAchieved : boolean;
    GoalAbandoned: boolean;
}
