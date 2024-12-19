import { ActivityTrackerDto } from "../../../../../../domain.types/users/patient/activity.tracker/activity.tracker.dto";
import PatientActivityTracker from "../../../models/users/patient/activity.tracking.model";

///////////////////////////////////////////////////////////////////////////////////

export class ActivityTrackerMapper {

    static toDto = (activityTracker: PatientActivityTracker): ActivityTrackerDto => {

        if (activityTracker == null){
            return null;
        }

        const dto : ActivityTrackerDto = {
            id                  : activityTracker.id,
            PatientUserId       : activityTracker.PatientUserId,
            LastLoginDate       : activityTracker.LastLoginDate,
            LastVitalUpdateDate : activityTracker.LastVitalUpdateDate,
            UpdatedVitalDetails : activityTracker.UpdatedVitalDetails,
            LastUserTaskDate    : activityTracker.LastUserTaskDate,
            UserTaskDetails     : activityTracker.UserTaskDetails,
            LastActivityDate    : activityTracker.LastActivityDate,
            CreatedAt           : activityTracker.createdAt,
            UpdatedAt           : activityTracker.updatedAt
        };

        return dto;
    };

}
