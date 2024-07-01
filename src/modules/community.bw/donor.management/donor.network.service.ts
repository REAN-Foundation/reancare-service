/* eslint-disable @typescript-eslint/no-unused-vars */
import { CareplanActivity } from "../../../domain.types/clinical/careplan/activity/careplan.activity";
import { IBloodWarriorService } from "../interface/community.network.interface";
import * as DonorMessages from '../donor.management/donor.messages.json';
import { injectable } from "tsyringe";
import { TimeHelper } from "../../../common/time.helper";
import { DurationType } from "../../../domain.types/miscellaneous/time.types";
import { UserTaskCategory } from "../../../domain.types/users/user.task/user.task.types";

@injectable()
export class DonorNetworkService implements IBloodWarriorService {

    public fetchActivities = async (
        careplanCode: string,
        enrollmentId: string,
        participantId?: string,
        startDate?: Date,
        endDate?: Date): Promise<CareplanActivity[]> => {
            
        const activities = DonorMessages['default'];
        var activityEntities: CareplanActivity[] = [];

        activities.forEach(async activity => {
            let activityDate = TimeHelper.addDuration(startDate, 540, DurationType.Minute); // At 9 AM 9 * 60
            if (activity.Sequence === 2 ) {
                activityDate = TimeHelper.addDuration(activityDate, 600, DurationType.Minute); // At 7 PM
            }

            var entity: CareplanActivity = {
                ParticipantId          : participantId,
                EnrollmentId           : enrollmentId,
                Provider               : this.providerName(),
                ProviderActionId       : activity.Sequence,
                Category               : UserTaskCategory.Message,
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

    public providerName(): string {
        return "REAN_BW";
    }
    
}
