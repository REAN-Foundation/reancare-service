import { inject, injectable } from 'tsyringe';
import { Logger } from '../../../common/logger';
import { AssessmentDto } from '../../../domain.types/clinical/assessment/assessment.dto';
import { IPersonRepo } from '../../../database/repository.interfaces/person/person.repo.interface';
import { IUserRepo } from '../../../database/repository.interfaces/users/user/user.repo.interface';
import {
    BiometricQueryAnswer,
    FloatQueryAnswer,
    IntegerQueryAnswer,
    MessageAnswer,
    MultipleChoiceQueryAnswer,
    CAssessmentQuestionNode,
    SingleChoiceQueryAnswer,
    TextQueryAnswer,
    DateQueryAnswer,
    FileQueryAnswer,
    BooleanQueryAnswer,
    SkipQueryAnswer,
    QueryResponseType
} from '../../../domain.types/clinical/assessment/assessment.types';
import { IHealthProfileRepo } from '../../../database/repository.interfaces/users/patient/health.profile.repo.interface';
import { PulseService } from '../biometrics/pulse.service';
import { Injector } from '../../../startup/injector';
import { PulseDomainModel } from '../../../domain.types/clinical/biometrics/pulse/pulse.domain.model';
import { use } from 'chai';
import { EHRVitalService } from '../../../modules/ehr.analytics/ehr.services/ehr.vital.service';
import { BodyTemperatureDomainModel } from '../../../domain.types/clinical/biometrics/body.temperature/body.temperature.domain.model';
import BodyTemperature from '../../../database/sql/sequelize/models/clinical/biometrics/body.temperature.model';
import { BodyTemperatureService } from '../biometrics/body.temperature.service';
import { BodyWeightDomainModel } from '../../../domain.types/clinical/biometrics/body.weight/body.weight.domain.model';
import { BodyWeightService } from '../biometrics/body.weight.service';
import { BodyHeightDomainModel } from '../../../domain.types/clinical/biometrics/body.height/body.height.domain.model';
import { BodyHeightService } from '../biometrics/body.height.service';
import { BloodOxygenSaturationDomainModel } from '../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.domain.model';
import BloodOxygenSaturation from '../../../database/sql/sequelize/models/clinical/biometrics/blood.oxygen.saturation.model';
import { BloodOxygenSaturationService } from '../biometrics/blood.oxygen.saturation.service';
import { BloodGlucoseDomainModel } from '../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.domain.model';
import { BloodGlucoseService } from '../biometrics/blood.glucose.service';
import { BloodPressureDomainModel } from '../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.domain.model';
import  BloodPressure from '../../../database/sql/sequelize/models/clinical/biometrics/blood.pressure.model';
import { BloodPressureService } from '../biometrics/blood.pressure.service';
import { BodyWeightDto } from '../../../domain.types/clinical/biometrics/body.weight/body.weight.dto';
import { PulseDto } from '../../../domain.types/clinical/biometrics/pulse/pulse.dto';
@injectable()
export class AssessmentVitalsHelper {
    
    _ehrVitalService: EHRVitalService = Injector.Container.resolve(EHRVitalService);
    
    constructor(
        @inject('IPulseRepo') private _pulseRepo: PulseService,
        @inject('IBodyTemperatureRepo') private _bodyTemperatureService: BodyTemperatureService,
        @inject('IBodyWeightRepo') private _bodyWeightService: BodyWeightService,
        @inject('IBodyHeightRepo') private _bodyHeightService: BodyHeightService,
        @inject('IBloodOxygenSaturationRepo') private _bloodOxygenSaturationService: BloodOxygenSaturationService,
        @inject('IBloodGlucoseRepo') private _bloodGlucoseService: BloodGlucoseService,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IPatientHealthProfileRepo') private _patientHealthProfileRepo: IHealthProfileRepo,
        @inject('IBloodPressureRepo') private _bloodPressureService: BloodPressureService
    ) {
    }

    public persist = async (
        assessment: AssessmentDto, node: CAssessmentQuestionNode, fieldName: string, FieldIdentifierUnit: string, answer: SingleChoiceQueryAnswer |
    MultipleChoiceQueryAnswer |
    MessageAnswer |
    TextQueryAnswer |
    DateQueryAnswer |
    IntegerQueryAnswer |
    BooleanQueryAnswer |
    FloatQueryAnswer |
    FileQueryAnswer |
    BiometricQueryAnswer |
    SkipQueryAnswer) => {
        try {
            const userId = assessment.PatientUserId;
            const user = await this._userRepo.getById(userId);
            const personId = user.PersonId;
            if (!personId) {
                Logger.instance().log(`No person found for user ${userId}`);
                return;
            }

            if (fieldName === 'Pulse') {
                const a = answer as BiometricQueryAnswer;
                if (!Array.isArray(a.Values)) {
                    const pulseRecord = a.Values;
                    if (pulseRecord) {
                        const pulseModel : PulseDomainModel = {
                            PatientUserId : userId,
                            Pulse         : Number(pulseRecord),
                            Unit          : FieldIdentifierUnit ?? 'bpm',
                            Provider      : assessment.Provider,
                            RecordDate    : new Date()
                        };
                        const personPulse = await this._pulseRepo.create(pulseModel);
                        await this._ehrVitalService.addEHRPulseForAppNames(personPulse);
                    }
                }
            }
                    
            else if (fieldName === 'Temperature') {
                const a = answer as BiometricQueryAnswer;
                if (!Array.isArray(a.Values)) {
                    const temperatureRecord = a.Values;
                    if (temperatureRecord) {
                        const temperatureModel : BodyTemperatureDomainModel = {
                            PatientUserId   : userId,
                            BodyTemperature : Number(temperatureRecord),
                            Unit            : FieldIdentifierUnit ?? '°F',
                            Provider        : assessment.Provider,
                            RecordDate      : new Date()
                        };
                        const personBodyTemperature = await this._bodyTemperatureService.create(temperatureModel);
                        await this._ehrVitalService.addEHRBodyTemperatureForAppNames(personBodyTemperature);
                    }
                }
            }
            
            else if (fieldName === 'Weight') {
                const a = answer as BiometricQueryAnswer;
                if (!Array.isArray(a.Values)) {
                    const weightRecord = a.Values;
                    if (weightRecord) {
                        const weightModel : BodyWeightDomainModel = {
                            PatientUserId : userId,
                            BodyWeight    : Number(weightRecord),
                            Unit          : FieldIdentifierUnit ?? 'kg',
                            RecordDate    : new Date()
                        };
                        const personBodyWeight = await this._bodyWeightService.create(weightModel);
                        await this._ehrVitalService.addEHRBodyWeightForAppNames(personBodyWeight);
                    }
                }
            }
                
            else if (fieldName === 'Height') {
                const a = answer as BiometricQueryAnswer;
                if (!Array.isArray(a.Values)) {
                    const heightRecord = a.Values;
                    if (heightRecord ) {
                        const heightModel : BodyHeightDomainModel = {
                            PatientUserId : userId,
                            BodyHeight    : Number(heightRecord),
                            Unit          : FieldIdentifierUnit ?? 'cm',
                            RecordDate    : new Date()
                        };
                        const personBodyHeight = await this._bodyHeightService.create(heightModel);
                        await this._ehrVitalService.addEHRBodyHeightForAppNames(personBodyHeight);
                    }
                }
            }

            else if (fieldName === 'OxygenSaturation') {
                const a = answer as BiometricQueryAnswer;
                if (!Array.isArray(a.Values)) {
                    const oxygenSaturationRecord = a.Values;
                    if (oxygenSaturationRecord ) {
                        const oxygenSaturationModel : BloodOxygenSaturationDomainModel = {
                            PatientUserId         : userId,
                            BloodOxygenSaturation : Number(oxygenSaturationRecord),
                            Unit                  : FieldIdentifierUnit ?? '%',
                            Provider              : assessment.Provider,
                            RecordDate            : new Date()
                        };
                        const personOxygenSaturation = await
                        this._bloodOxygenSaturationService.create(oxygenSaturationModel);
                        await this._ehrVitalService.addEHRBloodOxygenSaturationForAppNames(personOxygenSaturation);
                    }
                }
            }

            else if (fieldName === 'BloodGlucose') {
                const a = answer as BiometricQueryAnswer;
                if (!Array.isArray(a.Values)) {
                    const bloodGlucoseRecord = a.Values;
                    if (bloodGlucoseRecord ) {
                        const bloodGlucoseModel : BloodGlucoseDomainModel = {
                            PatientUserId : userId,
                            BloodGlucose  : Number( bloodGlucoseRecord),
                            Unit          : FieldIdentifierUnit ?? 'mg/dL',
                            Provider      : assessment.Provider,
                            RecordDate    : new Date()
                        };
                        const personBloodGlucose = await this._bloodGlucoseService.create(bloodGlucoseModel);
                        await this._ehrVitalService.addEHRBloodGlucoseForAppNames(personBloodGlucose);
                    }
                }
            }

            else if (fieldName.startsWith('BloodPressure')) {
                const a = answer as BiometricQueryAnswer;
                const systolicValue = a.Values[0];
                const diastolicValue = a.Values[1];
                const bloodPressureModel : BloodPressureDomainModel = {
                    PatientUserId : userId,
                    Systolic      : systolicValue,
                    Diastolic     : diastolicValue,
                    Unit          : FieldIdentifierUnit ?? 'mmHg',
                    RecordDate    : new Date()
                };
                const personBloodPressure = await this._bloodPressureService.create(bloodPressureModel);
                await this._ehrVitalService.addEHRBloodPressureForAppNames(personBloodPressure);
            }
        }
        catch (error) {
            Logger.instance().log(error);
        }
    };

}
