import { inject, injectable } from 'tsyringe';
import { IBloodGlucoseRepo } from '../../../database/repository.interfaces/clinical/biometrics/blood.glucose.repo.interface';
import { IBloodOxygenSaturationRepo } from '../../../database/repository.interfaces/clinical/biometrics/blood.oxygen.saturation.repo.interface';
import { IBloodPressureRepo } from '../../../database/repository.interfaces/clinical/biometrics/blood.pressure.repo.interface';
import { IBodyHeightRepo } from '../../../database/repository.interfaces/clinical/biometrics/body.height.repo.interface';
import { IBodyTemperatureRepo } from '../../../database/repository.interfaces/clinical/biometrics/body.temperature.repo.interface';
import { IBodyWeightRepo } from '../../../database/repository.interfaces/clinical/biometrics/body.weight.repo.interface';
import { IPulseRepo } from '../../../database/repository.interfaces/clinical/biometrics/pulse.repo.interface ';
import { AssessmentBiometrics, BiometricQueryAnswer } from '../../../domain.types/clinical/assessment/assessment.types';
import { BiometricsType } from '../../../domain.types/clinical/biometrics/biometrics.types';
import { BloodGlucoseDomainModel } from '../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.domain.model';
import { BloodGlucoseDto } from '../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.dto';
import { BloodOxygenSaturationDomainModel } from '../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.domain.model';
import { BloodOxygenSaturationDto } from '../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.dto';
import { BloodPressureDomainModel } from '../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.domain.model';
import { BloodPressureDto } from '../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.dto';
import { BodyHeightDomainModel } from '../../../domain.types/clinical/biometrics/body.height/body.height.domain.model';
import { BodyHeightDto } from '../../../domain.types/clinical/biometrics/body.height/body.height.dto';
import { BodyTemperatureDomainModel } from '../../../domain.types/clinical/biometrics/body.temperature/body.temperature.domain.model';
import { BodyTemperatureDto } from '../../../domain.types/clinical/biometrics/body.temperature/body.temperature.dto';
import { BodyWeightDomainModel } from '../../../domain.types/clinical/biometrics/body.weight/body.weight.domain.model';
import { BodyWeightDto } from '../../../domain.types/clinical/biometrics/body.weight/body.weight.dto';
import { PulseDomainModel } from '../../../domain.types/clinical/biometrics/pulse/pulse.domain.model';
import { PulseDto } from '../../../domain.types/clinical/biometrics/pulse/pulse.dto';
import { uuid } from '../../../domain.types/miscellaneous/system.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class AssessmentBiometricsHelper {
    
    constructor(
        @inject('IBloodGlucoseRepo') private _bloodGlucoseRepo: IBloodGlucoseRepo,
        @inject('IBloodOxygenSaturationRepo') private _bloodOxygenSaturationRepo: IBloodOxygenSaturationRepo,
        @inject('IBloodPressureRepo') private _bloodPressureRepo: IBloodPressureRepo,
        @inject('IBodyWeightRepo') private _bodyWeightRepo: IBodyWeightRepo,
        @inject('IBodyHeightRepo') private _bodyHeightRepo: IBodyHeightRepo,
        @inject('IBodyTemperatureRepo') private _bodyTemperatureRepo: IBodyTemperatureRepo,
        @inject('IPulseRepo') private _pulseRepo: IPulseRepo,
    ) {
    }

    public persistBiometrics = async (patientUserId: uuid, answer: BiometricQueryAnswer) => {
        
        if (answer.Values.length === 0) {
            throw new Error(`Invalid biometrics values!`);
        }
        for await (var v of answer.Values) {
            
            const type = v.BiometricsType;

            switch (type) {
                case BiometricsType.BloodGlucose: {
                    await this.addBloodGlucose(v, patientUserId);
                    break;
                }
                case BiometricsType.BloodOxygenSaturation: {
                    await this.addBloodOxygenSaturation(v, patientUserId);
                    break;
                }
                case BiometricsType.BloodPressure: {
                    await this.addBloodPressure(v, patientUserId);
                    break;
                }
                case BiometricsType.BodyHeight: {
                    await this.addBodyHeight(v, patientUserId);
                    break;
                }
                case BiometricsType.BodyWeight: {
                    await this.addBodyWeight(v, patientUserId);
                    break;
                }
                case BiometricsType.BodyTemperature: {
                    await this.addBodyTemperature(v, patientUserId);
                    break;
                }
                case BiometricsType.Pulse: {
                    await this.addPulse(v, patientUserId);
                    break;
                }
            }
        }
    };

    //#region Privates

    private async addBloodGlucose(biometrics: AssessmentBiometrics, patientUserId: string) {
        const b = biometrics.Value as BloodGlucoseDto;
        const model: BloodGlucoseDomainModel = {
            PatientUserId : patientUserId,
            BloodGlucose  : b.BloodGlucose,
            Unit          : b.Unit,
            RecordDate    : b.RecordDate ?? new Date()
        };
        await this._bloodGlucoseRepo.create(model);
    }

    private async addBloodOxygenSaturation(biometrics: AssessmentBiometrics, patientUserId: string) {
        const b = biometrics.Value as BloodOxygenSaturationDto;
        const model: BloodOxygenSaturationDomainModel = {
            PatientUserId         : patientUserId,
            BloodOxygenSaturation : b.BloodOxygenSaturation,
            Unit                  : b.Unit,
            RecordDate            : b.RecordDate ?? new Date()
        };
        await this._bloodOxygenSaturationRepo.create(model);
    }

    private async addBloodPressure(biometrics: AssessmentBiometrics, patientUserId: string) {
        const b = biometrics.Value as BloodPressureDto;
        const model: BloodPressureDomainModel = {
            PatientUserId : patientUserId,
            Diastolic     : b.Diastolic,
            Systolic      : b.Systolic,
            Unit          : b.Unit,
            RecordDate    : b.RecordDate ?? new Date()
        };
        await this._bloodPressureRepo.create(model);
    }

    private async addBodyHeight(biometrics: AssessmentBiometrics, patientUserId: string) {
        const b = biometrics.Value as BodyHeightDto;
        const model: BodyHeightDomainModel = {
            PatientUserId : patientUserId,
            BodyHeight    : b.BodyHeight,
            Unit          : b.Unit,
            RecordDate    : b.RecordDate ?? new Date()
        };
        await this._bodyHeightRepo.create(model);
    }

    private async addBodyWeight(biometrics: AssessmentBiometrics, patientUserId: string) {
        const b = biometrics.Value as BodyWeightDto;
        const model: BodyWeightDomainModel = {
            PatientUserId : patientUserId,
            BodyWeight    : b.BodyWeight,
            Unit          : b.Unit,
            RecordDate    : b.RecordDate ?? new Date()
        };
        await this._bodyWeightRepo.create(model);
    }

    private async addBodyTemperature(biometrics: AssessmentBiometrics, patientUserId: string) {
        const b = biometrics.Value as BodyTemperatureDto;
        const model: BodyTemperatureDomainModel = {
            PatientUserId   : patientUserId,
            BodyTemperature : b.BodyTemperature,
            Unit            : b.Unit,
            RecordDate      : b.RecordDate ?? new Date()
        };
        await this._bodyTemperatureRepo.create(model);
    }

    private async addPulse(biometrics: AssessmentBiometrics, patientUserId: string) {
        const b = biometrics.Value as PulseDto;
        const model: PulseDomainModel = {
            PatientUserId : patientUserId,
            Pulse         : b.Pulse,
            Unit          : b.Unit,
            RecordDate    : b.RecordDate ?? new Date()
        };
        await this._pulseRepo.create(model);
    }

    //#endregion

}
