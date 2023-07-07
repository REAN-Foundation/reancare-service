import { LessThanOrEqual, Repository } from 'typeorm';
import { AwardsFactsSource } from './awards.facts.db.connector';
import { AwardsFact } from './awards.facts.service';
import { Loader } from '../../startup/loader';
import { Logger } from '../../common/logger';
import { VitalFact } from './models/vital.fact.model';
import { BloodGlucoseService } from '../../services/clinical/biometrics/blood.glucose.service';
import { BodyWeightService } from '../../services/clinical/biometrics/body.weight.service';
import { BodyTemperatureService } from '../../services/clinical/biometrics/body.temperature.service';
import { BloodPressureService } from '../../services/clinical/biometrics/blood.pressure.service';
import { BloodOxygenSaturationService } from '../../services/clinical/biometrics/blood.oxygen.saturation.service';
import { PulseService } from '../../services/clinical/biometrics/pulse.service';
import { HelperRepo } from '../../database/sql/sequelize/repositories/common/helper.repo';
import { TimeHelper } from '../../common/time.helper';
import { DurationType } from '../../domain.types/miscellaneous/time.types';

//////////////////////////////////////////////////////////////////////////////

export const updateVitalFact = async (model: AwardsFact) => {

    const vitalFactRepository: Repository<VitalFact> =
        AwardsFactsSource.getRepository(VitalFact);
    const vitalService = await getVitalService(model.Facts.VitalName);

    const lastRecords = await vitalFactRepository.find({
        where : {
            ContextReferenceId : model.PatientUserId,
            RecordDate         : LessThanOrEqual(new Date())
        },
        order : {
            RecordDate : 'DESC'
        }
    });
    const offsetMinutes = await HelperRepo.getPatientTimezoneOffsets(model.PatientUserId);
    const tempDate = TimeHelper.subtractDuration(model.RecordDate, offsetMinutes, DurationType.Minute);
    const tempDateStr = await TimeHelper.formatDateToLocal_YYYY_MM_DD(tempDate);
    model.RecordDateStr = tempDateStr;

    await addOrUpdateVitalRecord(model);

    const lastRecord = lastRecords.length > 0 ? lastRecords[0] : null;
    var unpopulatedRecords = [];
    if (lastRecord == null) {
        unpopulatedRecords = await vitalService.getAllUserResponsesBefore(
            model.PatientUserId, new Date());
    }
    else {
        unpopulatedRecords = await vitalService.getAllUserResponsesBetween(
            model.PatientUserId, lastRecord.RecordDate, new Date());
    }
    for await (var r of unpopulatedRecords) {
        const model_: AwardsFact = {
            PatientUserId  : model.PatientUserId,
            RecordId       : r.RecordId,
            RecordDate     : r.RecordDate,
            RecordDateStr  : r.RecordDateStr,
            FactType       : 'Vitals',
            RecordTimeZone : r.RecordTimeZone,
            Facts          : {
                VitalName           : r.VitalName,
                VitalPrimaryValue   : r.VitalPrimaryValue,
                VitalSecondaryValue : r.VitalSecondaryValue ?? null,
                Unit                : r.Unit,
            }
        };
        await addOrUpdateVitalRecord(model_);
    }

};

async function addOrUpdateVitalRecord(model: AwardsFact) {
    const vitalFactRepository: Repository<VitalFact> =
        AwardsFactsSource.getRepository(VitalFact);
    const existing = await vitalFactRepository.findOne({
        where : {
            RecordId : model.RecordId
        }
    });
    if (!existing) {
        const fact = {
            RecordId            : model.RecordId,
            ContextReferenceId  : model.PatientUserId,
            VitalName           : model.Facts.VitalName,
            VitalPrimaryValue   : model.Facts.VitalPrimaryValue,
            VitalSecondaryValue : model.Facts.VitalSecondaryValue ?? null,
            Unit                : model.Facts.Unit,
            RecordDate          : model.RecordDate,
            RecordDateStr       : model.RecordDateStr,
            RecordTimeZone      : model.RecordTimeZone
        };
        const record = await vitalFactRepository.create(fact);
        const saved = await vitalFactRepository.save(record);
        Logger.instance().log(`${JSON.stringify(saved, null, 2)}`);
    }
    else {
        existing.VitalPrimaryValue = model.Facts.UserResponse ?? (await existing).VitalPrimaryValue;
        const saved = await vitalFactRepository.save(existing);
        Logger.instance().log(`${JSON.stringify(saved, null, 2)}`);
    }
}

async function getVitalService(vitalName) {
    const service = {
        "BloodGlucose"          : Loader.container.resolve(BloodGlucoseService),
        "BodyWeight"            : Loader.container.resolve(BodyWeightService),
        "BodyTemperature"       : Loader.container.resolve(BodyTemperatureService),
        "BloodPressure"         : Loader.container.resolve(BloodPressureService),
        "BloodOxygenSaturation" : Loader.container.resolve(BloodOxygenSaturationService),
        "Pulse"                 : Loader.container.resolve(PulseService)
    };
    return service[vitalName];
}
