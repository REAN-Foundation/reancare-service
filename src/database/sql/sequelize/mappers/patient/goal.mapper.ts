import Goal from '../../models/patient/goal.model';
import { GoalDto } from '../../../../../domain.types/patient/goal/goal.dto';

///////////////////////////////////////////////////////////////////////////////////

export class GoalMapper {

    static toDto = (goal: Goal): GoalDto => {
        if (goal == null) {
            return null;
        }

        const dto: GoalDto = {
            id            : goal.id ?? null,
            PatientUserId : goal.PatientUserId ?? null,
            CarePlanId    : goal.CarePlanId ?? null,
            TypeCode      : goal.TypeCode,
            TypeName      : goal.TypeName,
            GoalId        : goal.GoalId ?? null,
            GoalAchieved  : goal.GoalAchieved,
            GoalAbandoned : goal.GoalAbandoned
        };
        return dto;
    };

}
