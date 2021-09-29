import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';
import { DatabaseConnector_Sequelize } from './database.connector.sequelize';
import { AddressRepo } from './repositories/address.repo';
import { ApiClientRepo } from './repositories/api.client.repo';
import { BloodOxygenSaturationRepo } from './repositories/biometrics/blood.oxygen.saturation.repo';
import { PulseRepo } from './repositories/biometrics/pulse.repo';
import { BodyTemperatureRepo } from './repositories/biometrics/body.temperature.repo';
import { MoveMinutesRepo } from './repositories/daily.records/move.minutes.repo';
import { DoctorRepo } from './repositories/doctor.repo';
import { InternalTestUserRepo } from './repositories/internal.test.user.repo';
import { MedicationStockImageRepo } from './repositories/medication/medication.stock.image.repo';
import { OrganizationRepo } from './repositories/organization.repo';
import { OtpRepo } from './repositories/otp.repo';
import { HealthProfileRepo } from './repositories/patient/health.profile.repo';
import { PatientRepo } from './repositories/patient/patient.repo';
import { PersonRepo } from './repositories/person.repo';
import { PersonRoleRepo } from './repositories/person.role.repo';
import { RolePrivilegeRepo } from './repositories/role.privilege.repo';
import { RoleRepo } from './repositories/role.repo';
import { UserRepo } from './repositories/user.repo';
import { BloodPressureRepo } from './repositories/biometrics/blood.pressure.repo';
import { StepCountRepo } from './repositories/daily.records/step.count.repo';
import { BodyWeightRepo } from './repositories/biometrics/body.weight.repo';
import { BodyHeightRepo } from './repositories/biometrics/body.height.repo';
import { CalorieBalanceRepo } from './repositories/daily.records/calorie.balance.repo';
import { HeartPointsRepo } from './repositories/daily.records/heart.points.repo';
import { ComplaintRepo } from './repositories/patient/complaint.repo';
import { AllergyRepo } from './repositories/patient/allergy.repo';
import { KnowledgeNuggetRepo } from './repositories/static.types/knowledge.nugget.repo';
import { OrderRepo } from './repositories/order/order.repo';
import { WaterConsumptionRepo } from './repositories/nutrition/water.consumption.repo';
import { EmergencyContactRepo } from './repositories/patient/emergency.contact.repo';
import { SleepRepo } from './repositories/daily.records/sleep.repo';
import { EmergencyEventRepo } from './repositories/emergency.event.repo';
import { MeditationRepo } from './repositories/exercise/meditation.repo';
import { BloodGlucoseRepo } from './repositories/biometrics/blood.glucose.repo';
import { DiagnosisRepo } from './repositories/diagnosis.repo';
import { HowDoYouFeelRepo } from './repositories/symptom/howDoYouFeel/howDoYouFeel.repo';
import { DrugRepo } from './repositories/medication/drug.repo';
import { UserDeviceDetailsRepo } from './repositories/user.device.details.repo';

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
        container.register('IMoveMinutesRepo', MoveMinutesRepo);
        container.register('ICalorieBalanceRepo', CalorieBalanceRepo);
        container.register('IHeartPointsRepo', HeartPointsRepo);
        container.register('IMedicationStockImageRepo', MedicationStockImageRepo);
        container.register('IComplaintRepo', ComplaintRepo);
        container.register('IAllergyRepo', AllergyRepo);
        container.register('IKnowledgeNuggetRepo', KnowledgeNuggetRepo);
        container.register('IOrderRepo', OrderRepo);
        container.register('IWaterConsumptionRepo', WaterConsumptionRepo);
        container.register('IEmergencyContactRepo', EmergencyContactRepo);
        container.register('ISleepRepo', SleepRepo);
        container.register('IEmergencyEventRepo', EmergencyEventRepo);
        container.register('IMeditationRepo', MeditationRepo);
        container.register('IBloodGlucoseRepo', BloodGlucoseRepo);
        container.register('IDiagnosisRepo', DiagnosisRepo);
        container.register('IHowDoYouFeelRepo', HowDoYouFeelRepo);
        container.register('IDrugRepo', DrugRepo);
        container.register('IUserDeviceDetailsRepo', UserDeviceDetailsRepo);
    }

}
