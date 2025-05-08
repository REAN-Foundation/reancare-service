import express from "express";
import { Logger } from "../common/logger";
import { register as registerAddressRoutes } from "./general/address/address.routes";
import { register as registerRoleRoutes } from "./role/role.routes";
import { register as registerClientRoutes } from "./client.apps/client.app.routes";
import { register as registerAllergyRoutes } from './clinical/allergy/allergy.routes';
import { register as registerBloodGlucoseRoutes } from './clinical/biometrics/blood.glucose/blood.glucose.routes';
import { register as registerBiometricsBloodOxygenSaturationRoutes } from './clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.routes';
import { register as registerBloodPressureRoutes } from './clinical/biometrics/blood.pressure/blood.pressure.routes';
import { register as registerBodyHeightRoutes } from './clinical/biometrics/body.height/body.height.routes';
import { register as registerBodyTemperatureRoutes } from './clinical/biometrics/body.temperature/body.temperature.routes';
import { register as registerBodyWeightRoutes } from './clinical/biometrics/body.weight/body.weight.routes';
import { register as registerBiometricsPulse } from './clinical/biometrics/pulse/pulse.routes';
import { register as registerComplaintRoutes } from './clinical/complaint/complaint.routes';
import { register as registerDailyAssessmentRoutes } from './clinical/assessment/daily.assessment/daily.assessment.routes';
import { register as registerDiagnosisRoutes } from './clinical/diagnosis/diagnosis.routes';
import { register as registerDoctorNoteRoutes } from './clinical/doctor.note/doctor.note.routes';
import { register as registerEmergencyEventRoutes } from './clinical/emergency.event/emergency.event.routes';
import { register as registerMedicalConditionRoutes } from './clinical/medical.condition/medical.condition.routes';
import { register as registerDrugRoutes } from './clinical/medication/drug/drug.routes';
import { register as registerMedicationConsumptionRoutes } from './clinical/medication/medication.consumption/medication.consumption.routes';
import { register as registerMedicationRoutes } from './clinical/medication/medication/medication.routes';
import { register as registerOrderRoutes } from './clinical/order/order.routes';
import { register as registerHowDoYouFeelRoutes } from './clinical/symptom/how.do.you.feel/how.do.you.feel.routes';
import { register as registerSymptomAssessmentRoutes } from './clinical/assessment/symptom.assessment/symptom.assessment.routes';
import { register as registerSymptomAssessmentTemplateRoutes } from './clinical/assessment/symptom.assessment.template/symptom.assessment.template.routes';
import { register as registerSymptomRoutes } from './clinical/symptom/symptom/symptom.routes';
import { register as registerSymptomTypeRoutes } from './clinical/symptom/symptom.type/symptom.type.routes';
import { register as registerDoctorRoutes } from "./users/doctor/doctor.routes";
import { register as registerKnowledgeNuggetRoutes } from './educational/knowledge.nugget/knowledge.nugget.routes';
import { register as registerFileResourceRoutes } from './general/file.resource/file.resource.routes';
import { register as registerOrganizationRoutes } from './general/organization/organization.routes';
import { register as registerPatientDocumentRoutes, registerSharingRoutes as registerDocumentSharingRoutes } from './users/patient/document/document.routes';
import { register as registerEmergencyContactRoutes } from './users/patient/emergency.contact/emergency.contact.routes';
import { register as registerGoalRoutes } from './users/patient/goal/goal.routes';
import { register as registerPatientHealthProfileRoutes } from './users/patient/health.profile/health.profile.routes';
import { register as registerPatientRoutes } from "./users/patient/patient/patient.routes";
import { register as registerPersonRoutes } from './person/person.routes';
import { register as registerTypesRoutes } from './general/types/types.routes';
import { register as registerUserDeviceDetailsRoutes } from './users/user.device.details/user.device.details.routes';
import { register as registerUserRoutes } from "./users/user/user.routes";
import { register as registerUserTaskRoutes } from './users/user.task/user.task.routes';
import { register as registerCalorieBalanceRoute } from './wellness/daily.records/calorie.balance/calorie.balance.routes';
import { register as registerHeartPointRoutes } from './wellness/daily.records/heart.points/heart.points.routes';
import { register as registerMoveMinutesRoutes } from './wellness/daily.records/move.minutes/move.minutes.routes';
import { register as registerSleepRoutes } from './wellness/daily.records/sleep/sleep.routes';
import { register as registerStepCountRoutes } from './wellness/daily.records/step.count/step.count.routes';
import { register as registerMeditationtRoutes } from './wellness/exercise/meditation/meditation.routes';
import { register as registerPhysicalActivityRoutes } from './wellness/exercise/physical.activity/physical.activity.routes';
import { register as registerNutritionFoodConsumptionRoutes } from './wellness/nutrition/food.consumption/food.consumption.routes';
import { register as registerWaterConsumptionRoutes } from './wellness/nutrition/water.consumption/water.consumption.routes';
import { register as registerCareplanRoutes } from './clinical/careplan/careplan.routes';
import { register as registerAssessmentRoutes } from './clinical/assessment/assessment/assessment.routes';
import { register as registerAssessmentTemplateRoutes } from './clinical/assessment/assessment.template/assessment.template.routes';
import { register as registerHealthPriorityRoutes } from './users/patient/health.priority/health.priority.routes';
import { register as registerActionPlanRoutes } from './users/patient/action.plan/action.plan.routes';
import { register as registerFormsRoutes } from './clinical/assessment/forms/forms.routes';
import { register as registerCustomTaskRoutes } from './users/custom.task/custom.task.routes';
import { register as registerBloodCholesterolRoutes } from './clinical/biometrics/blood.cholesterol/blood.cholesterol.routes';
import { register as registerStandRoutes } from './wellness/daily.records/stand/stand.routes';
import { register as registerFoodComponentMonitoringRoutes } from './wellness/nutrition/food.component.monitoring/food.component.monitoring.routes';
import { register as registerNoticeRoutes } from './community/notice/notice.routes';
import { register as registerLearningPathRoutes } from './educational/learning/learning.path/learning.path.routes';
import { register as registerCourseRoutes } from './educational/learning/course/course.routes';
import { register as registerCourseModuleRoutes } from './educational/learning/course.module/course.module.routes';
import { register as registerCourseContentRoutes } from './educational/learning/course.content/course.content.routes';
import { register as registerUserLearningRoutes } from './educational/learning/user.learning/user.learning.routes';
import { register as registerLabRecordRoutes } from './clinical/lab.record/lab.record.routes';
import { register as registerTestRoutes } from './general/test/test.routes';
import { register as registerDonorRoutes } from './assorted/blood.donation/donor/donor.routes';
import { register as registerNotificationRoutes } from './general/notification/notification.routes';
import { register as registerVolunteerRoutes } from './assorted/blood.donation/volunteer/volunteer.routes';
import { register as registerChatRoutes } from './community/chat/chat.routes';
import { register as registerPatientStatisticsRoutes } from './users/patient/statistics/statistics.routes';
import { register as registerRssfeedRoutes } from './community/rss.feed/rss.feed.routes';
import { register as registerPatientDonorsRoutes } from './assorted/blood.donation/bridge/bridge.routes';
import { register as registerDonationRoutes } from './assorted/blood.donation/donation/donation.routes';
import { register as registerWearableWebhookTerraRoutes } from './webhooks/providers/terra/terra.webhook.routes';
import { register as registerWearableDeviceDetailsRoutes } from './devices/wearables/wearable.device.details.routes';
import { register as registerDonationCommunicationRoutes } from './assorted/blood.donation/communication/communication.routes';
import { register as registerUserGroupRoutes } from './community/user.groups/user.group.routes';
import { register as registerReminderRoutes } from './general/reminder/reminder.routes';
import { register as registerTenantRoutes } from './tenant/tenants/tenant.routes';
import { register as registerCohortRoutes } from './community/cohorts/cohort.routes';
import { register as registerCustomQueryRoutes } from './statistics/custom.query/custom.query.routes';
import { register as registerConsentRoutes } from './auth/consent/consent.routes';
import { register as registerHealthSystemRoutes } from './hospitals/health.system/health.system.routes';
import { register as registerHospitalRoutes } from './hospitals/hospital/hospital.routes';
import { register as registerDailyStatisticsRoutes } from './statistics/daily.statistics/daily.statistics.routes';
import { register as registerTenantFeatureSettingRoutes } from './tenant/settings/tenant.settings.routes';
import { register as registerFollowUpCancellationRoutes } from './tenant/followups/cancellations/followup.cancellation.routes';
import { register as registerPregnancyRoutes } from './clinical/maternity/pregnancy/pregnancy.route';
import { register as registerDeliveryRoutes } from './clinical/maternity/delivery/delivery.route';
import { register as registerVisitRoutes } from './clinical/visit/visit.routes';


////////////////////////////////////////////////////////////////////////////////////

export class Router {

    private _app = null;

    constructor(app: express.Application) {
        this._app = app;
    }

    public init = async (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            try {

                //Handling the base route
                this._app.get('/api/v1/', (req, res) => {
                    res.send({
                        message : `REANCare API [Version ${process.env.API_VERSION}]`,
                    });
                });

                registerUserRoutes(this._app);
                registerAddressRoutes(this._app);
                registerRoleRoutes(this._app);
                registerClientRoutes(this._app);
                registerPatientRoutes(this._app);
                registerDoctorRoutes(this._app);
                registerTypesRoutes(this._app);
                registerBodyWeightRoutes(this._app);
                registerBiometricsBloodOxygenSaturationRoutes(this._app);
                registerPersonRoutes(this._app);
                registerOrganizationRoutes(this._app);
                registerBloodPressureRoutes(this._app);
                registerBodyHeightRoutes(this._app);
                registerPatientHealthProfileRoutes(this._app);
                registerPatientHealthProfileRoutes(this._app);
                registerNutritionFoodConsumptionRoutes(this._app);
                registerStepCountRoutes(this._app);
                registerBiometricsPulse(this._app);
                registerBodyTemperatureRoutes(this._app);
                registerMoveMinutesRoutes(this._app);
                registerCalorieBalanceRoute(this._app);
                registerComplaintRoutes(this._app);
                registerAllergyRoutes(this._app);
                registerHeartPointRoutes(this._app);
                registerDoctorNoteRoutes(this._app);
                registerPhysicalActivityRoutes(this._app);
                registerKnowledgeNuggetRoutes(this._app);
                registerOrderRoutes(this._app);
                registerWaterConsumptionRoutes(this._app);
                registerEmergencyContactRoutes(this._app);
                registerSleepRoutes(this._app);
                registerEmergencyEventRoutes(this._app);
                registerMeditationtRoutes(this._app);
                registerPatientDocumentRoutes(this._app);
                registerDocumentSharingRoutes(this._app);
                registerSymptomTypeRoutes(this._app);
                registerSymptomRoutes(this._app);
                registerSymptomAssessmentRoutes(this._app);
                registerSymptomAssessmentTemplateRoutes(this._app);
                registerBloodGlucoseRoutes(this._app);
                registerDiagnosisRoutes(this._app);
                registerHowDoYouFeelRoutes(this._app);
                registerDrugRoutes(this._app);
                registerUserDeviceDetailsRoutes(this._app);
                registerGoalRoutes(this._app);
                registerFileResourceRoutes(this._app);
                registerMedicationRoutes(this._app);
                registerMedicationConsumptionRoutes(this._app);
                registerUserTaskRoutes(this._app);
                registerMedicalConditionRoutes(this._app);
                registerDailyAssessmentRoutes(this._app);
                registerCareplanRoutes(this._app);
                registerAssessmentRoutes(this._app);
                registerAssessmentTemplateRoutes(this._app);
                registerHealthPriorityRoutes(this._app);
                registerActionPlanRoutes(this._app);
                registerFormsRoutes(this._app);
                registerCustomTaskRoutes(this._app);
                registerBloodCholesterolRoutes(this._app);
                registerStandRoutes(this._app);
                registerFoodComponentMonitoringRoutes(this._app);
                registerNoticeRoutes(this._app);
                registerLearningPathRoutes(this._app);
                registerCourseRoutes(this._app);
                registerCourseModuleRoutes(this._app);
                registerCourseContentRoutes(this._app);
                registerUserLearningRoutes(this._app);
                registerLabRecordRoutes(this._app);
                registerTestRoutes(this._app);
                registerDonorRoutes(this._app);
                registerNotificationRoutes(this._app);
                registerVolunteerRoutes(this._app);
                registerChatRoutes(this._app);
                registerPatientStatisticsRoutes(this._app);
                registerRssfeedRoutes(this._app);
                registerPatientDonorsRoutes(this._app);
                registerDonationRoutes(this._app);
                registerWearableWebhookTerraRoutes(this._app);
                registerWearableDeviceDetailsRoutes(this._app);
                registerDonationCommunicationRoutes(this._app);
                registerUserGroupRoutes(this._app);
                registerReminderRoutes(this._app);
                registerTenantRoutes(this._app);
                registerCohortRoutes(this._app);
                registerCustomQueryRoutes(this._app);
                registerConsentRoutes(this._app);
                registerHealthSystemRoutes(this._app);
                registerHospitalRoutes(this._app);
                registerDailyStatisticsRoutes(this._app);
                registerTenantFeatureSettingRoutes(this._app);
                registerFollowUpCancellationRoutes(this._app);
                registerPregnancyRoutes(this._app);
                registerDeliveryRoutes(this._app);
                registerVisitRoutes(this._app);

                resolve(true);

            } catch (error) {
                Logger.instance().log('Error initializing the router: ' + error.message);
                reject(false);
            }
        });
    };

}
