/* eslint-disable @typescript-eslint/no-unused-vars */
import { CareplanActivity } from "../../../domain.types/clinical/careplan/activity/careplan.activity";
import { IBloodWarriorService } from "../interface/community.network.interface";
import * as DonorMessages from '../donor.management/donor.messages.json';
import { injectable } from "tsyringe";
import { TimeHelper } from "../../../common/time.helper";
import { DurationType } from "../../../domain.types/miscellaneous/time.types";

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
            let activityDate = TimeHelper.addDuration(startDate, 210, DurationType.Minute);
            if (activity.Sequence === 2 ) {
                activityDate = TimeHelper.addDuration(activityDate, 600, DurationType.Minute);
            }

            var entity: CareplanActivity = {
                ParticipantId          : participantId,
                EnrollmentId           : enrollmentId,
                Provider               : this.providerName(),
                ProviderActionId       : activity.Sequence,
                Title                  : activity.Name,
                Type                   : activity.TemplateName,
                PlanCode               : careplanCode,
                Description            : activity.Message,
                Language               : 'English',
                ScheduledAt            : activityDate,
                TimeSlot               : activity.TimeSlot,
                IsRegistrationActivity : activity.IsRegistrationActivity
            };

            activityEntities.push(entity);

        });

        return activityEntities;
    };

    public providerName(): string {
        return "REAN_BW";
    }
    
}
