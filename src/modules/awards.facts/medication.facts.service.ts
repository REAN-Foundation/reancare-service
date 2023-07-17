import { LessThanOrEqual, Repository } from 'typeorm';
import { AwardsFactsSource } from './awards.facts.db.connector';
import { AwardsFact } from './awards.facts.service';
import { MedicationFact } from './models/medication.fact.model';
import { MedicationConsumptionService } from '../../services/clinical/medication/medication.consumption.service';
import { Loader } from '../../startup/loader';
import { Logger } from '../../common/logger';
import { HelperRepo } from '../../database/sql/sequelize/repositories/common/helper.repo';
import { TimeHelper } from '../../common/time.helper';
import { DurationType } from '../../domain.types/miscellaneous/time.types';

//////////////////////////////////////////////////////////////////////////////

export const updateMedicationFact = async (model: AwardsFact) => {

    const medfactRepository: Repository<MedicationFact> = AwardsFactsSource.getRepository(MedicationFact);
    const medConsumptionService = Loader.container.resolve(MedicationConsumptionService);

    const lastRecords = await medfactRepository.find({
        where : {
            ContextReferenceId : model.PatientUserId,
            RecordDate         : LessThanOrEqual(new Date())
        },
        order : {
            RecordDate : 'DESC'
        }
    });
    Logger.instance().log(`Last records :: ${JSON.stringify(lastRecords)}`);
    const offsetMinutes = await HelperRepo.getPatientTimezoneOffsets(model.PatientUserId);
    const tempDate = TimeHelper.subtractDuration(model.RecordDate, offsetMinutes, DurationType.Minute);
    const tempDateStr = await TimeHelper.formatDateToLocal_YYYY_MM_DD(tempDate);
    model.RecordDateStr = tempDateStr;

    await addOrUpdateMedicationRecord(model);

    const lastRecord = lastRecords.length > 0 ? lastRecords[0] : null;
    Logger.instance().log(`Last record :: ${JSON.stringify(lastRecord)}`);
    var unpopulatedRecords = [];
    if (lastRecord == null) {
        unpopulatedRecords = await medConsumptionService.getAllTakenBefore(
            model.PatientUserId, new Date());
        Logger.instance().log(`Unpopulated records - taken before :: ${JSON.stringify(unpopulatedRecords)}`);

    }
    else {
        unpopulatedRecords = await medConsumptionService.getAllTakenBetween(
            model.PatientUserId, lastRecord.RecordDate, new Date());
        Logger.instance().log(`Unpopulated records - taken between :: ${JSON.stringify(unpopulatedRecords)}`);

    }
    for await (var r of unpopulatedRecords) {
        const model_: AwardsFact = {
            PatientUserId  : model.PatientUserId,
            RecordId       : r.RecordId,
            RecordDate     : r.RecordDate,
            FactType       : 'Medication',
            RecordDateStr  : r.RecordDateStr,
            RecordTimeZone : r.RecordTimeZone,
            Facts          : {
                DrugName : r.DrugName,
                Taken    : r.Taken,
            }
        };
        Logger.instance().log(`Medication model for unpopulated records:: ${JSON.stringify(model_)}`);

        await addOrUpdateMedicationRecord(model_);
    }

};

async function addOrUpdateMedicationRecord(model: AwardsFact) {
    const medfactRepository: Repository<MedicationFact> = AwardsFactsSource.getRepository(MedicationFact);
    const existing = await medfactRepository.findOne({
        where : {
            RecordId : model.RecordId
        }
    });
    Logger.instance().log(`Existing medication record :: ${JSON.stringify(existing)}`);
    if (!existing) {
        const fact = {
            RecordId           : model.RecordId,
            ContextReferenceId : model.PatientUserId,
            DrugName           : model.Facts.DrugName,
            Taken              : model.Facts.Taken,
            Missed             : model.Facts.Missed,
            RecordDate         : model.RecordDate,
            RecordDateStr      : model.RecordDateStr,
            RecordTimeZone     : model.RecordTimeZone
        };
        const record = await medfactRepository.create(fact);
        const saved = await medfactRepository.save(record);
        Logger.instance().log(`${JSON.stringify(saved, null, 2)}`);
    }
    else {
        existing.Taken = model.Facts.Taken ?? (await existing).Taken;
        existing.Missed = model.Facts.Missed ?? (await existing).Missed;
        const saved = await medfactRepository.save(existing);
        Logger.instance().log(`${JSON.stringify(saved, null, 2)}`);
    }
}
