import Goal from '../../../models/users/patient/goal.model';
import { GoalDto } from '../../../../../../domain.types/users/patient/goal/goal.dto';
import { GoalTypeDto } from '../../../../../../domain.types/users/patient/goal.type/goal.type.dto';
import GoalTypeModel from '../../../models/users/patient/goal.type.model';

///////////////////////////////////////////////////////////////////////////////////

export class GoalMapper {

    static toDto = (goal: Goal): GoalDto => {
        if (goal == null) {
            return null;
        }

        const dto: GoalDto = {
            id                   : goal.id ?? null,
            PatientUserId        : goal.PatientUserId ?? null,
            ProviderEnrollmentId : goal.ProviderEnrollmentId ?? null,
            Provider             : goal.Provider ?? null,
            ProviderCareplanCode : goal.ProviderCareplanCode ?? null,
            ProviderCareplanName : goal.ProviderCareplanName ?? null,
            ProviderGoalCode     : goal.ProviderGoalCode ?? null,
            Title                : goal.Title ?? null,
            Sequence             : goal.Sequence ?? null,
            HealthPriorityId     : goal.HealthPriorityId ?? null,
            StartedAt            : goal.StartedAt ?? null,
            CompletedAt          : goal.CompletedAt ?? null,
            ScheduledEndDate     : goal.ScheduledEndDate ?? null,
            GoalAchieved         : goal.GoalAchieved,
            GoalAbandoned        : goal.GoalAbandoned
        };
        return dto;
    };

    static toTypeDto = (goalType: GoalTypeModel): GoalTypeDto => {

        if (goalType == null){
            return null;
        }

        const typeDto: GoalTypeDto = {
            id        : goalType.id,
            Type      : goalType.Type,
            Tags      : goalType.Tags ? JSON.parse(goalType.Tags) : [],
            CreatedAt : goalType.CreatedAt,
        };

        return typeDto;
    };

}
