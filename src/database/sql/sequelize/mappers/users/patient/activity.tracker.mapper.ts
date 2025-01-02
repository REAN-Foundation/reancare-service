import { ActivityTrackerDto } from "../../../../../../domain.types/users/patient/activity.tracker/activity.tracker.dto";
import PatientActivityTracker from "../../../models/users/patient/activity.tracker.model";

///////////////////////////////////////////////////////////////////////////////////

export class ActivityTrackerMapper {

    static toDto = (activityTracker: PatientActivityTracker): ActivityTrackerDto => {

        if (activityTracker == null){
            return null;
        }

        const dto : ActivityTrackerDto = {
            id                 : activityTracker.id,
            RecentActivityDate : activityTracker.RecentActivityDate,

        };

        return dto;
    };

}
