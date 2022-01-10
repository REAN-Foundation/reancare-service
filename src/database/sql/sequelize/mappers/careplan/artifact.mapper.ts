import { UserTaskCategory } from "../../../../../domain.types/user/user.task/user.task.types";
import { CareplanActivityDto } from "../../../../../domain.types/clinical/careplan/activity/careplan.activity.dto";
import CareplanActivity from "../../models/careplan/careplan.activity.model";

///////////////////////////////////////////////////////////////////////////////////

export class CareplanArtifactMapper {

    static toDto = (activity: CareplanActivity): CareplanActivityDto => {

        if (activity == null){
            return null;
        }

        const dto: CareplanActivityDto = {
            id               : activity.id,
            PatientUserId    : activity.PatientUserId,
            EnrollmentId     : activity.EnrollmentId,
            Provider         : activity.Provider,
            PlanName         : activity.PlanName,
            PlanCode         : activity.PlanCode,
            Type             : activity.Type,
            Category         : activity.Category as UserTaskCategory,
            ProviderActionId : activity.ProviderActionId,
            Title            : activity.Title,
            ScheduledAt      : activity.ScheduledAt,
            StartedAt        : activity.StartedAt,
            CompletedAt      : activity.CompletedAt,
            Comments         : activity.Comments,
            Sequence         : activity.Sequence,
            Frequency        : activity.Frequency,
            Status           : activity.Status,
        };
        return dto;
    }

}
