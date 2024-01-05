import { injectable } from "tsyringe";
import { Logger } from "../../../common/logger";
import { EHRAnalyticsHandler } from "../ehr.analytics.handler";
import { PatientService } from "../../../services/users/patient/patient.service";
import { Loader } from "../../../startup/loader";
import { CareplanService } from "../../../services/clinical/careplan.service";
import { Injector } from "../../../startup/injector";
import { PatientDetailsDto } from "src/domain.types/users/patient/patient/patient.dto";
import { CareplanActivityDto } from "src/domain.types/clinical/careplan/activity/careplan.activity.dto";
import { EnrollmentDto } from "src/domain.types/clinical/careplan/enrollment/enrollment.dto";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class EHRCareplanActivityService {
    _patientService = Injector.Container.resolve(PatientService);

    _careplanService = Injector.Container.resolve(CareplanService);

    _ehrAnalyticsHandler: EHRAnalyticsHandler = new EHRAnalyticsHandler();

    public scheduleExistingCareplanActivityDataToEHR = async () => {
        try {
            var patientUserIds = await this._patientService.getAllPatientUserIds();
            Logger.instance().log(
                `[ScheduleExistingCareplanActivityDataToEHR] Patient User Ids :${JSON.stringify(patientUserIds)}`
            );
            for await (var p of patientUserIds) {
                var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(p);
                var healthSystemHospitalDetails = await this._patientService.getByUserId(p);
                if (eligibleAppNames.length > 0) {
                    var startTime = new Date('2020-01-01');
                    var endTime = new Date('2024-12-01');
                    var searchResults = await this._careplanService.getActivities(p, startTime, endTime);
                    for await (var m of searchResults) {
                        for await (var appName of eligibleAppNames) {
                            if (appName == 'HF Helper' && m.PlanCode == 'HFMotivator') {
                                this._careplanService.addEHRRecord(
                                    m.PlanName,
                                    m.PlanCode,
                                    m,
                                    appName,
                                    healthSystemHospitalDetails
                                );
                            } else if (
                                appName == 'Heart &amp; Stroke Helper™' &&
                                (m.PlanCode == 'Cholesterol' || m.PlanCode == 'Stroke')
                            ) {
                                this._careplanService.addEHRRecord(
                                    m.PlanName,
                                    m.PlanCode,
                                    m,
                                    appName,
                                    healthSystemHospitalDetails
                                );
                            } else if (
                                appName == 'REAN HealthGuru' &&
                                (m.PlanCode == 'Cholesterol' || m.PlanCode == 'Stroke' || m.PlanCode == 'HFMotivator')
                            ) {
                                this._careplanService.addEHRRecord(
                                    m.PlanName,
                                    m.PlanCode,
                                    m,
                                    appName,
                                    healthSystemHospitalDetails
                                );
                            }
                        }
                    }
                } else {
                    Logger.instance().log(
                        `[ScheduleExistingCareplanActivityDataToEHR] Skip adding details to EHR database as device is not eligible:${p}`
                    );
                }
            }
            Logger.instance().log(
                `[ScheduleExistingCareplanActivityDataToEHR] Processed :${searchResults.length} records for careplan activity`
            );
        } catch (error) {
            Logger.instance().log(
                `[ScheduleExistingCareplanActivityDataToEHR] Error population existing assessment data in ehr insights database :: ${JSON.stringify(
                    error
                )}`
            );
        }
    };

    public addEHRRecord = (
        planName: string,
        planCode: string,
        model: CareplanActivityDto,
        enrollmentDetails: EnrollmentDto,
        appName?: string,
        patientDetails?: PatientDetailsDto
    ) => {
        EHRAnalyticsHandler.addCareplanActivityRecord(
            appName,
            model.PatientUserId,
            model.id,
            model.EnrollmentId,
            model.Provider,
            planName,
            planCode,
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
}
