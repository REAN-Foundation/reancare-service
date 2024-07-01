/* eslint-disable @typescript-eslint/no-unused-vars */
import { CareplanActivity } from "../../../domain.types/clinical/careplan/activity/careplan.activity";
import { IBloodWarriorService } from "../interface/community.network.interface";
import * as PatientMessages from '../patient.management/patient.messages.json';
import * as PatientConfirmationMessage from '../patient.management/patient.confirmation.message.json';
import { TimeHelper } from "../../../common/time.helper";
import { DurationType } from "../../../domain.types/miscellaneous/time.types";
import { CareplanConfig } from "../../../config/configuration.types";
import { ConfigurationManager } from "../../../config/configuration.manager";
import { Logger } from "./../../../common/logger";
import { UserTaskCategory } from "../../../domain.types/users/user.task/user.task.types";

export class PatientNetworkService implements IBloodWarriorService {

    public providerName(): string {
        return "REAN_BW";
    }

    public fetchActivities = async (
        careplanCode: string,
        enrollmentId: string,
        participantId?: string,
        startDate?: Date,
        bloodTransfusionDate?: Date,
        toDate?: Date)
            : Promise<CareplanActivity[]> => {
        let activities = [];
        if (careplanCode === 'Patient-Donation-Confirmation') {
            activities = PatientConfirmationMessage['default'];
        } else {
            activities = PatientMessages['default'];
        }
        var activityEntities: CareplanActivity[] = [];

        activities.forEach(async activity => {
            Logger.instance().log(`Blood transfusion date: ${bloodTransfusionDate}`);
            let scedulingVariable = "Day";
            if (process.env.REAN_CAREPLAN_SCHEDULING_VARIABLE) {
                scedulingVariable = process.env.REAN_CAREPLAN_SCHEDULING_VARIABLE;
            }
            let activityDate = null;
            if (careplanCode === 'Patient-Donation-Confirmation') {
                activityDate = TimeHelper.addDuration(startDate, 540, DurationType.Minute);  // At 9 AM 9 * 60
            } else {
                activityDate = TimeHelper.subtractDuration(bloodTransfusionDate, activity[`${scedulingVariable}`], DurationType.Day);
                activityDate = TimeHelper.addDuration(activityDate, 540, DurationType.Minute); // At 9 AM 9 * 60
            }
            
            Logger.instance().log(`Date of patient reminder  ${activity.Sequence}: ${activityDate}`);

            var entity: CareplanActivity = {
                ParticipantId          : participantId,
                EnrollmentId           : enrollmentId,
                Provider               : this.providerName(),
                ProviderActionId       : activity.Sequence,
                Title                  : activity.Name,
                Type                   : UserTaskCategory.Message,
                Category               : UserTaskCategory.Message,
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
