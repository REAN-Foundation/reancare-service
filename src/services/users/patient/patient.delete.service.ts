import { inject, injectable } from 'tsyringe';
import * as asyncLib from 'async';
import { Logger } from '../../../common/logger';
import { IMedicationConsumptionRepo } from '../../../database/repository.interfaces/clinical/medication/medication.consumption.repo.interface';
import { IUserTaskRepo } from '../../../database/repository.interfaces/users/user/user.task.repo.interface';
import { IBloodCholesterolRepo } from '../../../database/repository.interfaces/clinical/biometrics/blood.cholesterol.repo.interface';
import { IBloodGlucoseRepo } from '../../../database/repository.interfaces/clinical/biometrics/blood.glucose.repo.interface';
import { IBloodOxygenSaturationRepo } from '../../../database/repository.interfaces/clinical/biometrics/blood.oxygen.saturation.repo.interface';
import { IBloodPressureRepo } from '../../../database/repository.interfaces/clinical/biometrics/blood.pressure.repo.interface';
import { IBodyHeightRepo } from '../../../database/repository.interfaces/clinical/biometrics/body.height.repo.interface';
import { IBodyTemperatureRepo } from '../../../database/repository.interfaces/clinical/biometrics/body.temperature.repo.interface';
import { IBodyWeightRepo } from '../../../database/repository.interfaces/clinical/biometrics/body.weight.repo.interface';
import { IPulseRepo } from '../../../database/repository.interfaces/clinical/biometrics/pulse.repo.interface ';
import { ICareplanRepo } from '../../../database/repository.interfaces/clinical/careplan.repo.interface';
import { ISymptomAssessmentRepo } from '../../../database/repository.interfaces/clinical/symptom/symptom.assessment.repo.interface';
import { IAssessmentRepo } from '../../../database/repository.interfaces/clinical/assessment/assessment.repo.interface';
import { IReminderScheduleRepo } from '../../../database/repository.interfaces/general/reminder.schedule.repo.interface';
import { IReminderRepo } from '../../../database/repository.interfaces/general/reminder.repo.interface';
import { IFoodConsumptionRepo } from '../../../database/repository.interfaces/wellness/nutrition/food.consumption.repo.interface';
import { IWaterConsumptionRepo } from '../../../database/repository.interfaces/wellness/nutrition/water.consumption.repo.interface';
import { IMeditationRepo } from '../../../database/repository.interfaces/wellness/exercise/meditation.repo.interface';
import { IPhysicalActivityRepo } from '../../../database/repository.interfaces/wellness/exercise/physical.activity.repo.interface';
import { IEmergencyContactRepo } from '../../../database/repository.interfaces/users/patient/emergency.contact.repo.interface';
import { IUserDeviceDetailsRepo } from '../../../database/repository.interfaces/users/user/user.device.details.repo.interface ';
import { CareplanHandler } from '../../../modules/careplan/careplan.handler';

////////////////////////////////////////////////////////////////////////////////////////////////////////

const ASYNC_TASK_COUNT = 4;
@injectable()
export class PatientDeleteService {

 _handler: CareplanHandler = new CareplanHandler();

 constructor(
        @inject('IUserTaskRepo') private _userTaskRepo: IUserTaskRepo,
        @inject('IMedicationConsumptionRepo') private _medicationConsumptionRepo: IMedicationConsumptionRepo,
        @inject('IBloodCholesterolRepo') private _bloodCholesterolRepo: IBloodCholesterolRepo,
        @inject('IBloodGlucoseRepo') private _bloodGlucoseRepo: IBloodGlucoseRepo,
        @inject('IBloodOxygenSaturationRepo') private _bloodOxygenSaturationRepo: IBloodOxygenSaturationRepo,
        @inject('IBloodPressureRepo') private _bloodPressureRepo: IBloodPressureRepo,
        @inject('IBodyHeightRepo') private _bodyHeightRepo: IBodyHeightRepo,
        @inject('IBodyTemperatureRepo') private _bodyTemperatureRepo: IBodyTemperatureRepo,
        @inject('IBodyWeightRepo') private _bodyWeightRepo: IBodyWeightRepo,
        @inject('IPulseRepo') private _pulseRepo: IPulseRepo,
        @inject('ICareplanRepo') private _careplanRepo: ICareplanRepo,
        @inject('ISymptomAssessmentRepo') private _symptomAssessmentRepo: ISymptomAssessmentRepo,
        @inject('IAssessmentRepo') private _assessmentRepo: IAssessmentRepo,
        @inject('IReminderScheduleRepo') private _reminderScheduleRepo: IReminderScheduleRepo,
        @inject('IReminderRepo') private _reminderRepo: IReminderRepo,
        @inject('IFoodConsumptionRepo') private _foodConsumptionRepo: IFoodConsumptionRepo,
        @inject('IWaterConsumptionRepo') private _waterConsumptionRepo: IWaterConsumptionRepo,
        @inject('IMeditationRepo') private _meditationRepo: IMeditationRepo,
        @inject('IPhysicalActivityRepo') private _physicalActivityRepo: IPhysicalActivityRepo,
        @inject('IEmergencyContactRepo') private _emergencyContactRepo: IEmergencyContactRepo,
        @inject('IUserDeviceDetailsRepo') private _userDeviceDetailsRepo: IUserDeviceDetailsRepo,

 ){}

    public _q = asyncLib.queue((userId: string, onCompleted) => {
        (async () => {
            await this.deletePatientData(userId);
            onCompleted();
        })();
    }, ASYNC_TASK_COUNT);

    public enqueueDeletePatientData = async (userId: string) => {
        try {
            this.enqueue(userId);
        } catch (error) {
            Logger.instance().log(`${JSON.stringify(error.message, null, 2)}`);
        }
    };

    //#region Privates

    private enqueue = (userId: string) => {
        this._q.push(userId, (userId, error) => {
            if (error) {
                Logger.instance().log(`Error deleting patient data: ${JSON.stringify(error)}`);
                Logger.instance().log(`Error deleting patient data: ${JSON.stringify(error.stack, null, 2)}`);
            } else {
                Logger.instance().log(`Deleted Patient Data!`);
            }
        });
    };

    private deletePatientData = async (userId: string) => {
        try {

            await this._medicationConsumptionRepo.deleteByUserId(userId, true);

            await this._bloodCholesterolRepo.deleteByUserId(userId, true);

            await this._bloodGlucoseRepo.deleteByUserId(userId, true);

            await this._bloodOxygenSaturationRepo.deleteByUserId(userId, true);

            await this._bloodPressureRepo.deleteByUserId(userId, true);

            await this._bodyHeightRepo.deleteByUserId(userId, true);

            await this._bodyTemperatureRepo.deleteByUserId(userId, true);

            await this._bodyWeightRepo.deleteByUserId(userId, true);

            await this._pulseRepo.deleteByUserId(userId, true);

            await this._foodConsumptionRepo.deleteByUserId(userId, true);

            await this._waterConsumptionRepo.deleteByUserId(userId, true);

            await this._meditationRepo.deleteByUserId(userId, true);

            await this._physicalActivityRepo.deleteByUserId(userId, true);

            await this._careplanRepo.deleteEnrollmentByUserId(userId, true);

            await this._careplanRepo.deleteActivitiesByUserId(userId, true);

            await this._symptomAssessmentRepo.deleteByUserId(userId, true);

            await this._assessmentRepo.deleteByUserId(userId, true);

            await this._reminderScheduleRepo.deleteByUserId(userId, true);

            await this._reminderRepo.deleteByUserId(userId, true);

            await this._emergencyContactRepo.deleteByUserId(userId, true);

            await this._userDeviceDetailsRepo.deleteByUserId(userId, true);

            await this._userTaskRepo.deleteByUserId(userId, true);

            const participant = await this._careplanRepo.getParticipantByUserId(userId);
            
            if (participant) {
                await this._careplanRepo.deleteParticipantByUserId(userId, true);
                await this._handler.deleteParticipantData(participant.ParticipantId, participant.Provider);
            }

        } catch (error) {
            Logger.instance().log(`${JSON.stringify(error.message, null, 2)}`);
        }
    };

}
