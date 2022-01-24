import { CareplanGoalDto } from "../../../../../modules/careplan/domain.types/goal/goal.dto";
import CareplanGoal from "../../models/careplan/careplan.goal.model";

///////////////////////////////////////////////////////////////////////////////////

export class CareplanGoalMapper {

    static toDto = (careplanGoal: CareplanGoal): CareplanGoalDto => {

        if (careplanGoal == null){
            return null;
        }

        const dto: CareplanGoalDto = {
            id               : careplanGoal.id,
            PatientUserId    : careplanGoal.PatientUserId,
            EnrollmentId     : careplanGoal.EnrollmentId,
            Provider         : careplanGoal.Provider,
            PlanName         : careplanGoal.PlanName,
            PlanCode         : careplanGoal.PlanCode,
            ProviderActionId : careplanGoal.ProviderActionId,
            GoalId           : careplanGoal.GoalId,
            Name             : careplanGoal.Name,
            Sequence         : careplanGoal.Sequence,
            Categories       : careplanGoal.Categories ? JSON.parse(careplanGoal.Categories) : [],
            ScheduledAt      : careplanGoal.ScheduledAt,

        };
        return dto;
    }

}
