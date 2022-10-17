import GoalAction from "../../../models/users/patient/action.plan.model";
import { ActionPlanDto } from "../../../../../../domain.types/users/patient/action.plan/action.plan.dto";

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
            CompletedAt          : actionPlan.CompletedAt,
            Status               : actionPlan.Status,
            ScheduledEndDate     : actionPlan.ScheduledEndDate,
        };

        return dto;
    };

}
