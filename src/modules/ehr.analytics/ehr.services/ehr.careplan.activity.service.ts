import { injectable } from "tsyringe";
import { Logger } from "../../../common/logger";
import { CareplanActivityDto } from "../../../domain.types/clinical/careplan/activity/careplan.activity.dto";
import { PatientDetailsDto } from "../../../domain.types/users/patient/patient/patient.dto";
import { EHRAnalyticsHandler } from "../ehr.analytics.handler";
import { PatientAppNameCache } from "../patient.appname.cache";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class EHRCareplanActivityService {

    public addEHRRecord = (
        model: CareplanActivityDto,
        appName?: string,
        patientDetails?: PatientDetailsDto
    ) => {
        EHRAnalyticsHandler.addCareplanActivityRecord(
            appName,
            model.PatientUserId,
            model.id,
            model.EnrollmentId,
            model.Provider,
            model.PlanName,
            model.PlanCode,
            model.Type,
            model.Category,
            model.ProviderActionId,
            model.Title,
            model.Description,
            model.Url,
            'English',
            model.ScheduledAt,
            model.CompletedAt,
            model.Sequence,
            model.Frequency,
            model.Status,
            patientDetails.HealthSystem ? patientDetails.HealthSystem : null,
            patientDetails.AssociatedHospital ? patientDetails.AssociatedHospital : null,
            model.CreatedAt ? new Date(model.CreatedAt) : null
        );
    };

    public addCareplanActivitiesToEHR = async (
        careplanActivities: CareplanActivityDto[],
        patientDetails: PatientDetailsDto) => {
        try {
            if (careplanActivities.length === 0) {
                return;
            }
            const eligibleToAddEhrRecord = await PatientAppNameCache.getEligibility(patientDetails.UserId);
            if (eligibleToAddEhrRecord) {
                for await (var activity of careplanActivities) {
                    this.addEHRRecord(activity, null, patientDetails);
                }
            }
            
        } catch (error) {
            Logger.instance().log(`[AddCareplanActivitiesToEHR]: ${JSON.stringify(error)}`);
        }
    };

}
