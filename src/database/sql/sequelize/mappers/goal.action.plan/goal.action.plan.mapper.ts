import GoalAction from "../../models/patient/goal.action.model";
import { ActionPlanDto } from "../../../../../domain.types/goal.action.plan/goal.action.plan.dto";

///////////////////////////////////////////////////////////////////////////////////

export class ActionPlanMapper {

    static toDto = (actionPlan: GoalAction): ActionPlanDto => {

        if (actionPlan == null){
            return null;
        }

        const dto: ActionPlanDto = {
            id                   : actionPlan.id,
            PatientUserId        : actionPlan.PatientUserId,
            ProviderEnrollmentId : actionPlan.ProviderEnrollmentId,
            Provider             : actionPlan.Provider,
            ProviderCareplanName : actionPlan.ProviderCareplanName,
            ProviderCareplanCode : actionPlan.ProviderCareplanCode,
            GoalId               : actionPlan.GoalId,
            Title                : actionPlan.Title,
            StartedAt            : actionPlan.StartedAt,
            ScheduledEndDate     : actionPlan.ScheduledEndDate,
        };
        
        return dto;
    }

}
