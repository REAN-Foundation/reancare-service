import { injectable } from "tsyringe";
import { EHRAnalyticsHandler } from "../ehr.analytics.handler";
import { PatientAppNameCache } from "../patient.appname.cache";
import { UserTaskDto } from "../../../domain.types/users/user.task/user.task.dto";
import { PatientDetailsDto } from "../../../domain.types/users/patient/patient/patient.dto";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class EHRUserTaskService {

    private addEHRRecord = (updated?: UserTaskDto, appName?: string, healthSystem?: PatientDetailsDto) => {
        EHRAnalyticsHandler.addCareplanActivityRecord(
            appName,
            updated.Action.PatientUserId,
            updated.Action.id,
            updated.Action.EnrollmentId,
            updated.Action.Provider,
            updated.Action.PlanName,
            updated.Action.PlanCode,
            updated.Action.Type,
            updated.Action.Category,
            updated.Action.ProviderActionId,
            updated.Action.Title,
            updated.Action.Description,
            updated.Action.Url,
            'English',
            updated.Action.ScheduledAt,
            updated.Action.CompletedAt,
            updated.Action.Sequence,
            updated.Action.Frequency,
            updated.Action.Status,
            healthSystem.HealthSystem ? healthSystem.HealthSystem : null,
            healthSystem.AssociatedHospital ? healthSystem.AssociatedHospital : null,
            updated.CreatedAt ? new Date(updated.CreatedAt) : null
        );
    };

    public async addEHRUserTaskForAppNames(r: UserTaskDto, healthSystem?: PatientDetailsDto) {
        const eligibleToAddEhrRecord = await PatientAppNameCache.getEligibility(r.Action.PatientUserId);
        if (eligibleToAddEhrRecord) {
            this.addEHRRecord(r, null, healthSystem);
        }
    }

}
