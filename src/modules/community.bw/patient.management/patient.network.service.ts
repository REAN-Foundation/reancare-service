import { CareplanActivity } from "../../../domain.types/clinical/careplan/activity/careplan.activity";
import { IBloodWarriorService } from "../interface/community.network.interface";
import * as PatientMessages from '../patient.management/patient.messages.json';
import { TimeHelper } from "../../../common/time.helper";
import { DurationType } from "../../../domain.types/miscellaneous/time.types";
import { CareplanConfig } from "../../../config/configuration.types";
import { ConfigurationManager } from "../../../config/configuration.manager";

export class PatientNetworkService implements IBloodWarriorService {

    public providerName(): string {
        return "REAN_BW";
    }

    public fetchActivities = async (careplanCode: string, enrollmentId: string,participantId?: string,
        startDate?: Date, bloodTransfusionDate?: Date, toDate?: Date): Promise<CareplanActivity[]> => {
        const activities = PatientMessages['default']; 
        var activityEntities: CareplanActivity[] = [];

        activities.forEach(async activity => {
            let activityDate = TimeHelper.addDuration(startDate, activity.Day, DurationType.Day);
            activityDate = TimeHelper.addDuration(activityDate, 210, DurationType.Minute);

            var entity: CareplanActivity = {
                ParticipantId          : participantId,
                EnrollmentId           : enrollmentId,
                Provider               : this.providerName(),
                ProviderActionId       : activity.Sequence,
                Title                  : activity.Name,
                Type                   : activity.Type ?? 'text',
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
    }

    public getPlanDetails(provider: string, planCode: string): CareplanConfig {
        var enabledProvider = this.isEnabledProvider(provider);
        if (enabledProvider) {
            var providerPlans = enabledProvider.Plans;
            const foundPlan = providerPlans.find(y => {
                return y.Code === planCode;
            });
            if (foundPlan) {
                return foundPlan;
            }
        }
        return null;
    }

    private isEnabledProvider(provider: string) {
        var careplans = ConfigurationManager.careplans();
        return careplans.find(x => {
            return x.Provider === provider && x.Enabled;
        });
    }
    
}
