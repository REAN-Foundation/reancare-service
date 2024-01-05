import { injectable } from "tsyringe";
import { EHRAnalyticsHandler } from "../ehr.analytics.handler";
import { Injector } from "../../../startup/injector";
import { PatientAppNameCache } from "../patient.appname.cache";
import { UserTaskService } from "../../../services/users/user/user.task.service";
import { UserTaskDto } from "../../../domain.types/users/user.task/user.task.dto";
import { PatientDetailsDto } from "../../../domain.types/users/patient/patient/patient.dto";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class EHRUserTaskService {
    _ehrAnalyticsHandler: EHRAnalyticsHandler = new EHRAnalyticsHandler();

    _userTaskService: UserTaskService = Injector.Container.resolve(UserTaskService);

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
        const eligibleAppNames = await PatientAppNameCache.get(r.Action.PatientUserId);
        for (var appName of eligibleAppNames) {
            this.addEHRRecord(r, appName, healthSystem);
        }
    }

}
