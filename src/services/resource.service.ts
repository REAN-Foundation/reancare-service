import express from 'express';
import { Logger } from '../common/logger';
import { Injector } from '../startup/injector';
import { AddressService } from './general/address.service';
import { uuid } from '../domain.types/miscellaneous/system.types';
import { ConsentService } from './auth/consent.service';
import { ClientAppService } from './client.apps/client.app.service';
import { AllergyService } from './clinical/allergy.service';
import { ComplaintService } from './clinical/complaint.service';
import { AssessmentService } from './clinical/assessment/assessment.service';
import { AssessmentTemplateService } from './clinical/assessment/assessment.template.service';
import { DailyAssessmentService } from './clinical/daily.assessment/daily.assessment.service';
import { SymptomAssessmentService } from './clinical/symptom/symptom.assessment.service';
import { BloodPressureService } from './clinical/biometrics/blood.pressure.service';
import { BloodGlucoseService } from './clinical/biometrics/blood.glucose.service';
import { BloodOxygenSaturationService } from './clinical/biometrics/blood.oxygen.saturation.service';
import { BodyTemperatureService } from './clinical/biometrics/body.temperature.service';
import { BodyWeightService } from './clinical/biometrics/body.weight.service';
import { BodyHeightService } from './clinical/biometrics/body.height.service';
import { BloodCholesterolService } from './clinical/biometrics/blood.cholesterol.service';
import { PulseService } from './clinical/biometrics/pulse.service';
import { HowDoYouFeelService } from './clinical/symptom/how.do.you.feel.service';
import { OrderService } from './clinical/order.service';
import { CareplanService } from './clinical/careplan.service';
import { DiagnosisService } from './clinical/diagnosis.service';
import { DoctorNoteService } from './clinical/doctor.note.service';
import { EmergencyEventService } from './clinical/emergency.event.service';
import { LabRecordService } from './clinical/lab.record/lab.record.service';
import { MedicalConditionService } from './clinical/medical.condition.service';
import { DrugService } from './clinical/medication/drug.service';
import { MedicationService } from './clinical/medication/medication.service';
import { MedicationConsumptionService } from './clinical/medication/medication.consumption.service';
import { SymptomService } from './clinical/symptom/symptom.service';
import { SymptomTypeService } from './clinical/symptom/symptom.type.service';
import { ChatService } from './community/chat.service';
import { CohortService } from './community/cohort.service';
import { NoticeService } from './general/notice.service';
import { RssfeedService } from './general/rss.feed.service';
import { UserGroupService } from './community/user.group.service';
import { WearableDeviceDetailsService } from './webhook/wearable.device.details.service';
import { CourseService } from './educational/learning/course.service';
import { CourseContentService } from './educational/learning/course.content.service';
import { CourseModuleService } from './educational/learning/course.module.service';
import { LearningPathService } from './educational/learning/learning.path.service';
import { KnowledgeNuggetService } from './educational/knowledge.nugget.service';
import { UserLearningService } from './educational/learning/user.learning.service';
import { FileResourceService } from './general/file.resource.service';
import { NotificationService } from './general/notification.service';
import { OrganizationService } from './general/organization.service';
import { ReminderService } from './general/reminder.service';
import { TypesService } from './general/types.service';
import { PersonService } from './person/person.service';
import { RoleService } from './role/role.service';
import { RolePrivilegeService } from './role/role.privilege.service';
import { PatientStatisticsService } from './users/patient/statistics/patient.statistics.service';
import { StatisticsService } from './statistics/statistics.service';
import { CustomQueryService } from './statistics/custom.query.service';
import { UserEngagementService } from './statistics/user.engagement.service';
import { TenantService } from './tenant/tenant.service';
import { CustomTaskService } from './users/user/custom.task.service';
import { UserDeviceDetailsService } from './users/user/user.device.details.service';
import { DoctorService } from './users/doctor.service';
import { ActionPlanService } from './users/patient/action.plan.service';
import { DocumentService } from './users/patient/document.service';
import { EmergencyContactService } from './users/patient/emergency.contact.service';
import { GoalService } from './users/patient/goal.service';
import { HealthPriorityService } from './users/patient/health.priority.service';
import { PatientService } from './users/patient/patient.service';
import { UserService } from './users/user/user.service';
import { UserTaskService } from './users/user/user.task.service';
import { CalorieBalanceService } from './wellness/daily.records/calorie.balance.service';
import { HeartPointsService } from './wellness/daily.records/heart.points.service';
import { MoveMinutesService } from './wellness/daily.records/move.minutes.service';
import { SleepService } from './wellness/daily.records/sleep.service';
import { StepCountService } from './wellness/daily.records/step.count.service';
import { StandService } from './wellness/daily.records/stand.service';
import { MeditationService } from './wellness/exercise/meditation.service';
import { PhysicalActivityService } from './wellness/exercise/physical.activity.service';
import { FoodComponentMonitoringService } from './wellness/food.component.monitoring/food.component.monitoring.service';
import { FoodConsumptionService } from './wellness/nutrition/food.consumption.service';
import { WaterConsumptionService } from './wellness/nutrition/water.consumption.service';

///////////////////////////////////////////////////////////////////////////////////

export default class ResourceService
{

    public static getResource = async (request: express.Request): Promise<any> => {
        try {
            const context = request.context;
            if (context == null || context === 'undefined') {
                return null;
            }
            const resourceType = request.resourceType;
            if (resourceType == null || resourceType === 'undefined') {
                return null;
            }
            const resourceId = request.resourceId;
            if (resourceId == null || resourceId === 'undefined') {
                return null;
            }

            const resource = await ResourceService.getResourceById(resourceType, resourceId);
            return resource;
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    };

    private static _serviceMap = {
        'Address'                                    : AddressService,
        'Auth.Consent'                               : ConsentService,
        'ClientApp'                                  : ClientAppService,
        'Clinical.Allergy'                           : AllergyService,
        'Clinical.Assessments.Assessment'            : AssessmentService,
        'Clinical.Assessments.AssessmentTemplate'    : AssessmentTemplateService,
        'Clinical.Assessments.DailyAssessment'       : DailyAssessmentService,
        'Clinical.Assessments.SymptomAssessment'     : SymptomAssessmentService,
        'Clinical.Biometrics.BloodPressure'          : BloodPressureService,
        'Clinical.Biometrics.BloodGlucose'           : BloodGlucoseService,
        'Clinical.Biometrics.BloodOxygenSaturation'  : BloodOxygenSaturationService,
        'Clinical.Biometrics.BodyTemperature'        : BodyTemperatureService,
        'Clinical.Biometrics.BodyWeight'             : BodyWeightService,
        'Clinical.Biometrics.BodyHeight'             : BodyHeightService,
        'Clinical.Biometrics.BloodCholesterol'       : BloodCholesterolService,
        'Clinical.Biometrics.Pulse'                  : PulseService,
        'Clinical.Careplan'                          : CareplanService,
        'Clinical.Complaint'                         : ComplaintService,
        'Clinical.Diagnosis'                         : DiagnosisService,
        'Clinical.DoctorNote'                        : DoctorNoteService,
        'Clinical.EmergencyEvent'                    : EmergencyEventService,
        'Clinical.LabRecord'                         : LabRecordService,
        'Clinical.MedicalCondition'                  : MedicalConditionService,
        'Clinical.Medications.Drug'                  : DrugService,
        'Clinical.Medications.Medication'            : MedicationService,
        'Clinical.Medications.MedicationConsumption' : MedicationConsumptionService,
        'Clinical.Order'                             : OrderService,
        'Clinical.Symptoms.HowDoYouFeel'             : HowDoYouFeelService,
        'Clinical.Symptoms.Symptom'                  : SymptomService,
        'Clinical.Symptoms.SymptomType'              : SymptomTypeService,
        'Community.Chat'                             : ChatService,
        'Community.Cohort'                           : CohortService,
        'Community.Notice'                           : NoticeService,
        'Community.RssFeed'                          : RssfeedService,
        'Community.UserGroup'                        : UserGroupService,
        'Devices.Wearables'                          : WearableDeviceDetailsService,
        'Educational.Course'                         : CourseService,
        'Educational.CourseContent'                  : CourseContentService,
        'Educational.CourseModule'                   : CourseModuleService,
        'Educational.LearningPath'                   : LearningPathService,
        'Educational.KnowledgeNugget'                : KnowledgeNuggetService,
        'Educational.UserLearning'                   : UserLearningService,
        'FileResource'                               : FileResourceService,
        'Notification'                               : NotificationService,
        'Organization'                               : OrganizationService,
        'Reminder'                                   : ReminderService,
        'Types'                                      : TypesService,
        'Person'                                     : PersonService,
        'Role'                                       : RoleService,
        'RolePrivilege'                              : RolePrivilegeService,
        'AppStats'                                   : StatisticsService,
        'CustomQuery'                                : CustomQueryService,
        'UserEngagement'                             : UserEngagementService,
        'Tenant'                                     : TenantService,
        'User.CustomTask'                           : CustomTaskService,
        'User.DeviceDetails'                        : UserDeviceDetailsService,
        'User.Doctor'                               : DoctorService,
        'User.Patient.Statistics'                  : PatientStatisticsService,
        'User.Patient.ActionPlan'                  : ActionPlanService,
        'User.Patient.Document'                    : DocumentService,
        'User.Patient.EmergencyContact'            : EmergencyContactService,
        'User.Patient.Goal'                        : GoalService,
        'User.Patient.HealthPriority'              : HealthPriorityService,
        'User.Patient.HealthProfile'               : HealthPriorityService,
        'User.Patient.Patient'                     : PatientService,
        'User.User'                                 : UserService,
        'User.UserTask'                             : UserTaskService,
        'Wellness.DailyRecords.CalorieBalance'       : CalorieBalanceService,
        'Wellness.DailyRecords.HeartPoints'          : HeartPointsService,
        'Wellness.DailyRecords.MoveMinutes'          : MoveMinutesService,
        'Wellness.DailyRecords.Sleep'                : SleepService,
        'Wellness.DailyRecords.StepCount'            : StepCountService,
        'Wellness.DailyRecords.Stand'                : StandService,
        'Wellness.Exercise.Meditation'               : MeditationService,
        'Wellness.Exercise.PhysicalActivity'         : PhysicalActivityService,
        'Wellness.Nutrition.FoodComponentMonitoring' : FoodComponentMonitoringService,
        'Wellness.Nutrition.FoodConsumption'         : FoodConsumptionService,
        'Wellness.Nutrition.WaterConsumption'        : WaterConsumptionService,
    };

    private static getResourceById = async (resourceType: string, resourceId: string | number): Promise<any> => {
        try {
            if (resourceType == null || resourceType === 'undefined') {
                return null;
            }
            if (resourceId == null || resourceId === 'undefined') {
                return null;
            }

            var keys = Object.keys(ResourceService._serviceMap);
            if (!keys.includes(resourceType)) {
                return null;
            }

            const service_ = ResourceService._serviceMap[resourceType];
            const service  = Injector.Container.resolve(service_) as any;
            const resource = await service.getById(resourceId as uuid);
            return resource;
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    };

}
