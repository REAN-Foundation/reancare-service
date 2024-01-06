import { injectable } from "tsyringe";
import { Logger } from "../../../common/logger";
import { CareplanActivityDto } from "../../../domain.types/clinical/careplan/activity/careplan.activity.dto";
import { PatientDetailsDto } from "../../../domain.types/users/patient/patient/patient.dto";
import { CareplanService } from "../../../services/clinical/careplan.service";
import { PatientService } from "../../../services/users/patient/patient.service";
import { Injector } from "../../../startup/injector";
import { EHRAnalyticsHandler } from "../ehr.analytics.handler";
import { PatientAppNameCache } from "../patient.appname.cache";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class EHRCareplanActivityService {
    _patientService = Injector.Container.resolve(PatientService);

    _careplanService = Injector.Container.resolve(CareplanService);

    _ehrAnalyticsHandler: EHRAnalyticsHandler = new EHRAnalyticsHandler();

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
            var eligibleAppNames = await PatientAppNameCache.get(patientDetails.UserId);
            if (eligibleAppNames.length === 0) {
                return;
            }
            for await (var activity of careplanActivities) {
                for await (var appName of eligibleAppNames) {
                    const shouldAdd = (appName == 'HF Helper' && activity.PlanCode == 'HFMotivator') ||
                        (appName == 'Heart &amp; Stroke Helper™' && (activity.PlanCode == 'Cholesterol' || activity.PlanCode == 'Stroke')) ||
                        (appName == 'REAN HealthGuru' && (activity.PlanCode == 'Cholesterol' || activity.PlanCode == 'Stroke' || activity.PlanCode == 'HFMotivator'));
                    if (shouldAdd) {
                        this.addEHRRecord(
                            activity,
                            appName,
                            patientDetails
                        );
                    }
                }
            }
        } catch (error) {
            Logger.instance().log(`[AddCareplanActivitiesToEHR]: ${JSON.stringify(error)}`);
        }
    }
}


