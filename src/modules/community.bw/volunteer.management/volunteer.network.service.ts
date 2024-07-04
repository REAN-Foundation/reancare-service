import { CareplanActivity } from "../../../domain.types/clinical/careplan/activity/careplan.activity";
import { IBloodWarriorService } from "../interface/community.network.interface";
import * as VolunteerMessages from '../volunteer.management/volunteer.messages.json';
import { injectable } from "tsyringe";
import { TimeHelper } from "../../../common/time.helper";
import { DurationType } from "../../../domain.types/miscellaneous/time.types";
import { UserTaskCategory } from "../../../domain.types/users/user.task/user.task.types";
import { Logger } from "../../../common/logger";

@injectable()
export class VolunteerNetworkService implements IBloodWarriorService {

    public fetchActivities = async (careplanCode: string, enrollmentId: string, participantId?: string,
        startDate?: Date, endDate?: Date): Promise<CareplanActivity[]> => {
            
        const activities = VolunteerMessages['default'];
        var activityEntities: CareplanActivity[] = [];
        Logger.instance().log(`EndDate is: ${endDate}`);

        activities.forEach(async activity => {
            const activityDate = TimeHelper.addDuration(startDate, 540, DurationType.Minute); // At 9 AM
            var entity: CareplanActivity = {
                ParticipantId          : participantId,
                EnrollmentId           : enrollmentId,
                Provider               : this.providerName(),
                Category               : UserTaskCategory.Message,
                ProviderActionId       : activity.Sequence,
                Title                  : activity.Name,
                Type                   : UserTaskCategory.Message,
                PlanCode               : careplanCode,
                Description            : activity.Name,
                Language               : 'English',
                ScheduledAt            : activityDate,
                TimeSlot               : activity.TimeSlot,
                IsRegistrationActivity : activity.IsRegistrationActivity,
                RawContent             : JSON.stringify(activity.Message)
            };

            activityEntities.push(entity);

        });

        return activityEntities;
    };

    providerName(): string {
        return "REAN_BW";
    }
    
}
