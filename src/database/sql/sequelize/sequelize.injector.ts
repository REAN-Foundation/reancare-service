import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';
import { DatabaseConnector_Sequelize } from './database.connector.sequelize';
import { AddressRepo } from './repositories/general/address.repo';
import { ApiClientRepo } from './repositories/api.client/api.client.repo';
import { AllergyRepo } from './repositories/clinical/allergy.repo';
import { BloodGlucoseRepo } from './repositories/clinical/biometrics/blood.glucose.repo';
import { BloodOxygenSaturationRepo } from './repositories/clinical/biometrics/blood.oxygen.saturation.repo';
import { BloodPressureRepo } from './repositories/clinical/biometrics/blood.pressure.repo';
import { BodyHeightRepo } from './repositories/clinical/biometrics/body.height.repo';
import { BodyTemperatureRepo } from './repositories/clinical/biometrics/body.temperature.repo';
import { BodyWeightRepo } from './repositories/clinical/biometrics/body.weight.repo';
import { PulseRepo } from './repositories/clinical/biometrics/pulse.repo';
import { ComplaintRepo } from './repositories/clinical/complaint.repo';
import { DailyAssessmentRepo } from './repositories/clinical/daily.assessment/daily.assessment.repo';
import { DiagnosisRepo } from './repositories/clinical/diagnosis.repo';
import { DoctorNoteRepo } from './repositories/clinical/doctor.note.repo';
import { EmergencyEventRepo } from './repositories/clinical/emergency.event.repo';
import { MedicalConditionRepo } from './repositories/clinical/medical.condition.repo';
import { DrugRepo } from './repositories/clinical/medication/drug.repo';
import { MedicationConsumptionRepo } from './repositories/clinical/medication/medication.consumption.repo';
import { MedicationRepo } from './repositories/clinical/medication/medication.repo';
import { MedicationStockImageRepo } from './repositories/clinical/medication/medication.stock.image.repo';
import { OrderRepo } from './repositories/clinical/order.repo';
import { HowDoYouFeelRepo } from './repositories/clinical/symptom/how.do.you.feel.repo';
import { SymptomAssessmentRepo } from './repositories/clinical/symptom/symptom.assessment.repo';
import { SymptomAssessmentTemplateRepo } from './repositories/clinical/symptom/symptom.assessment.template.repo';
import { SymptomRepo } from './repositories/clinical/symptom/symptom.repo';
import { SymptomTypeRepo } from './repositories/clinical/symptom/symptom.type.repo';
import { DoctorRepo } from './repositories/users/doctor.repo';
import { KnowledgeNuggetRepo } from './repositories/educational/knowledge.nugget.repo';
import { FileResourceRepo } from './repositories/general/file.resource.repo';
import { InternalTestUserRepo } from './repositories/users/user/internal.test.user.repo';
import { OrganizationRepo } from './repositories/general/organization.repo';
import { OtpRepo } from './repositories/users/user/otp.repo';
import { DocumentRepo } from './repositories/users/patient/document.repo';
import { EmergencyContactRepo } from './repositories/users/patient/emergency.contact.repo';
import { GoalRepo } from './repositories/users/patient/goal.repo';
import { HealthProfileRepo } from './repositories/users/patient/health.profile.repo';
import { PatientRepo } from './repositories/users/patient/patient.repo';
import { PersonRepo } from './repositories/person/person.repo';
import { PersonRoleRepo } from './repositories/person/person.role.repo';
import { RolePrivilegeRepo } from './repositories/role/role.privilege.repo';
import { RoleRepo } from './repositories/role/role.repo';
import { UserDeviceDetailsRepo } from './repositories/users/user/user.device.details.repo';
import { UserRepo } from './repositories/users/user/user.repo';
import { UserTaskRepo } from './repositories/users/user/user.task.repo';
import { CalorieBalanceRepo } from './repositories/wellness/daily.records/calorie.balance.repo';
import { HeartPointsRepo } from './repositories/wellness/daily.records/heart.points.repo';
import { MoveMinutesRepo } from './repositories/wellness/daily.records/move.minutes.repo';
import { SleepRepo } from './repositories/wellness/daily.records/sleep.repo';
import { StepCountRepo } from './repositories/wellness/daily.records/step.count.repo';
import { MeditationRepo } from './repositories/wellness/exercise/meditation.repo';
import { PhysicalActivityRepo } from './repositories/wellness/exercise/physical.activity.repo';
import { FoodConsumptionRepo } from './repositories/wellness/nutrition/food.consumption.repo';
import { WaterConsumptionRepo } from './repositories/wellness/nutrition/water.consumption.repo';
import { CareplanRepo } from './repositories/clinical/careplan/careplan.repo';
import { AssessmentRepo } from './repositories/clinical/assessment/assessment.repo';
import { AssessmentTemplateRepo } from './repositories/clinical/assessment/assessment.template.repo';
import { AssessmentHelperRepo } from './repositories/clinical/assessment/assessment.helper.repo';
import { HealthPriorityRepo } from './repositories/users/patient/health.priority.repo';
import { ActionPlanRepo } from './repositories/users/patient/action.plan.repo';
import { ThirdpartyApiRepo } from './repositories/general/thirdparty.api.repo';
import { CustomTaskRepo } from './repositories/users/user/custom.task.repo';
import { FoodComponentMonitoringRepo } from './repositories/wellness/food.component.monitoring/food.component.monitoring.repo';
import { UserLoginSessionRepo } from './repositories/users/user/user.login.session.repo';
import { BloodCholesterolRepo } from './repositories/clinical/biometrics/blood.cholesterol.repo';
import { StandRepo } from './repositories/wellness/daily.records/stand.repo';
import { NoticeRepo } from './repositories/general/notice.repo';
import { LearningPathRepo } from './repositories/educational/learning/learning.path.repo';
import { CourseRepo } from './repositories/educational/learning/course.repo';
import { CourseModuleRepo } from './repositories/educational/learning/course.module.repo';
import { CourseContentRepo } from './repositories/educational/learning/course.content.repo';
import { UserLearningRepo } from './repositories/educational/learning/user.learning.repo';
import { LabRecordRepo } from './repositories/clinical/lab.record/lab.record.repo';
import { DonorRepo } from './repositories/users/donor.repo';
import { HealthSystemRepo } from './repositories/users/patient/health.system.repo';
import { NotificationRepo } from './repositories/general/notification.repo';
import { VolunteerRepo } from './repositories/users/volunteer.repo';
import { ChatRepo } from './repositories/general/chat.repo';
import { RssfeedRepo } from './repositories/general/rss.feed/rss.feed.repo';
import { RssfeedItemRepo } from './repositories/general/rss.feed/rss.feed.item.repo';
import { PatientDonorsRepo } from './repositories/clinical/donation/patient.donors.repo';
import { DonationRecordRepo } from './repositories/clinical/donation/donation.record.repo';
import { WebhookRawDataRepo } from './repositories/webhook/webhook.rawdata.repo';

////////////////////////////////////////////////////////////////////////////////

export class SequelizeInjector {

    static registerInjections(container: DependencyContainer) {

        container.register('IDatabaseConnector', DatabaseConnector_Sequelize);

        container.register('IPersonRepo', PersonRepo);
        container.register('IUserRepo', UserRepo);
        container.register('IPersonRoleRepo', PersonRoleRepo);
        container.register('IRoleRepo', RoleRepo);
        container.register('IOtpRepo', OtpRepo);
        container.register('IApiClientRepo', ApiClientRepo);
        container.register('IPatientRepo', PatientRepo);
        container.register('IAddressRepo', AddressRepo);
        container.register('IRolePrivilegeRepo', RolePrivilegeRepo);
        container.register('IOrganizationRepo', OrganizationRepo);
        container.register('IDoctorRepo', DoctorRepo);
        container.register('IBloodPressureRepo', BloodPressureRepo);
        container.register('IBodyWeightRepo', BodyWeightRepo);
        container.register('IBodyHeightRepo', BodyHeightRepo);
        container.register('IPatientHealthProfileRepo', HealthProfileRepo);
        container.register('IBloodOxygenSaturationRepo', BloodOxygenSaturationRepo);
        container.register('IHealthProfileRepo', HealthProfileRepo);
        container.register('IInternalTestUserRepo', InternalTestUserRepo);
        container.register('IStepCountRepo', StepCountRepo);
        container.register('IPulseRepo', PulseRepo);
        container.register('IBodyTemperatureRepo', BodyTemperatureRepo);
        container.register('IMedicationStockImageRepo', MedicationStockImageRepo);
        container.register('IFoodConsumptionRepo', FoodConsumptionRepo);
        container.register('IMoveMinutesRepo', MoveMinutesRepo);
        container.register('ICalorieBalanceRepo', CalorieBalanceRepo);
        container.register('IHeartPointsRepo', HeartPointsRepo);
        container.register('IComplaintRepo', ComplaintRepo);
        container.register('IAllergyRepo', AllergyRepo);
        container.register('IDoctorNoteRepo', DoctorNoteRepo);
        container.register('IPhysicalActivityRepo', PhysicalActivityRepo);
        container.register('IKnowledgeNuggetRepo', KnowledgeNuggetRepo);
        container.register('IOrderRepo', OrderRepo);
        container.register('IWaterConsumptionRepo', WaterConsumptionRepo);
        container.register('IEmergencyContactRepo', EmergencyContactRepo);
        container.register('ISleepRepo', SleepRepo);
        container.register('IEmergencyEventRepo', EmergencyEventRepo);
        container.register('IMeditationRepo', MeditationRepo);
        container.register('IDocumentRepo', DocumentRepo);
        container.register('ISymptomTypeRepo', SymptomTypeRepo);
        container.register('ISymptomRepo', SymptomRepo);
        container.register('ISymptomAssessmentRepo', SymptomAssessmentRepo);
        container.register('ISymptomAssessmentTemplateRepo', SymptomAssessmentTemplateRepo);
        container.register('IFileResourceRepo', FileResourceRepo);
        container.register('IBloodGlucoseRepo', BloodGlucoseRepo);
        container.register('IDiagnosisRepo', DiagnosisRepo);
        container.register('IHowDoYouFeelRepo', HowDoYouFeelRepo);
        container.register('IDrugRepo', DrugRepo);
        container.register('IUserDeviceDetailsRepo', UserDeviceDetailsRepo);
        container.register('IGoalRepo', GoalRepo);
        container.register('IMedicationRepo', MedicationRepo);
        container.register('IMedicationConsumptionRepo', MedicationConsumptionRepo);
        container.register('IUserTaskRepo', UserTaskRepo);
        container.register('IMedicalConditionRepo', MedicalConditionRepo);
        container.register('IDailyAssessmentRepo', DailyAssessmentRepo);
        container.register('ICareplanRepo', CareplanRepo);
        container.register('IAssessmentRepo', AssessmentRepo);
        container.register('IAssessmentTemplateRepo', AssessmentTemplateRepo);
        container.register('IAssessmentHelperRepo', AssessmentHelperRepo);
        container.register('IHealthPriorityRepo', HealthPriorityRepo);
        container.register('IActionPlanRepo', ActionPlanRepo);
        container.register('IThirdpartyApiRepo', ThirdpartyApiRepo);
        container.register('ICustomTaskRepo', CustomTaskRepo);
        container.register('IFoodComponentMonitoringRepo', FoodComponentMonitoringRepo);
        container.register('IUserLoginSessionRepo', UserLoginSessionRepo);
        container.register('IBloodCholesterolRepo', BloodCholesterolRepo);
        container.register('IStandRepo', StandRepo);
        container.register('INoticeRepo', NoticeRepo);
        container.register('ILearningPathRepo', LearningPathRepo);
        container.register('ICourseRepo', CourseRepo);
        container.register('ICourseModuleRepo', CourseModuleRepo);
        container.register('ICourseContentRepo', CourseContentRepo);
        container.register('IUserLearningRepo', UserLearningRepo);
        container.register('ILabRecordRepo', LabRecordRepo);
        container.register('IDonorRepo', DonorRepo);
        container.register('IHealthSystemRepo', HealthSystemRepo);
        container.register('INotificationRepo', NotificationRepo);
        container.register('IVolunteerRepo', VolunteerRepo);
        container.register('IChatRepo', ChatRepo);
        container.register('IRssfeedRepo', RssfeedRepo);
        container.register('IRssfeedItemRepo', RssfeedItemRepo);
        container.register('IPatientDonorsRepo', PatientDonorsRepo);
        container.register('IDonationRecordRepo', DonationRecordRepo);
        container.register('IWebhookRawDataRepo', WebhookRawDataRepo);

    }

}
