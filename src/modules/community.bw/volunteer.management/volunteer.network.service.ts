import { CareplanActivity } from "../../../domain.types/clinical/careplan/activity/careplan.activity";
import { IBloodWarriorService } from "../interface/community.network.interface";
import * as VolunteerMessages from '../volunteer.management/volunteer.messages.json';
import { injectable } from "tsyringe";
import { TimeHelper } from "../../../common/time.helper";
import { DurationType } from "../../../domain.types/miscellaneous/time.types";

@injectable()
export class VolunteerNetworkService implements IBloodWarriorService {

    public fetchActivities = async (careplanCode: string, enrollmentId: string, participantId?: string,
        startDate?: Date, endDate?: Date): Promise<CareplanActivity[]> => {
            
        const activities = VolunteerMessages['default'];
        var activityEntities: CareplanActivity[] = [];

        activities.forEach(async activity => {
            const activityDate = TimeHelper.addDuration(startDate, 210, DurationType.Minute);
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

    providerName(): string {
        return "REAN_BW";
    }
    
}
