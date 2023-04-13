import { LessThanOrEqual, Repository } from 'typeorm';
import { AwardsFactsSource } from './awards.facts.db.connector';
import { AwardsFact } from './awards.facts.service';
import { MedicationFact } from './models/medication.fact.model';
import { MedicationConsumptionService } from '../../services/clinical/medication/medication.consumption.service';
import { Loader } from '../../startup/loader';

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

    await addOrUpdateRecord(model);

    const lastRecord = lastRecords.length > 0 ? lastRecords[0] : null;
    var unpopulatedRecords = [];
    if (lastRecord == null) {
        unpopulatedRecords = await medConsumptionService.getAllBefore(
            model.PatientUserId, new Date());
    }
    else {
        unpopulatedRecords = await medConsumptionService.getAllBetween(
            model.PatientUserId, lastRecord.RecordDate, new Date());
    }
    for await (var mc of unpopulatedRecords) {
        const model_: AwardsFact = {
            PatientUserId : model.PatientUserId,
            RecordId      : mc.id,
            RecordDate    : mc.TimeScheduleEnd,
            FactType      : 'Medication',
            RecordDateStr : (mc.TimeScheduleEnd).toISOString().split('T')[0],
            Facts         : {
                DrugName : mc.DrugName,
                Taken    : mc.IsTaken,
                Missed   : mc.IsMissed,
            }
        };
        await addOrUpdateRecord(model_);
    }

};

async function addOrUpdateRecord(model: AwardsFact) {
    const medfactRepository: Repository<MedicationFact> = AwardsFactsSource.getRepository(MedicationFact);
    const existing = await medfactRepository.findOne({
        where : {
            RecordId : model.RecordId
        }
    });
    if (!existing) {
        const fact = {
            RecordId           : model.RecordId,
            ContextReferenceId : model.PatientUserId,
            DrugName           : model.Facts.DrugName,
            Taken              : model.Facts.Taken,
            Missed             : model.Facts.Missed,
            RecordDate         : model.RecordDate,
            RecordDateStr      : model.RecordDateStr
        };
        const record = await medfactRepository.create(fact);
        const saved = await medfactRepository.save(record);
    }
    else {
        existing.Taken = model.Facts.Taken ?? (await existing).Taken;
        existing.Missed = model.Facts.Missed ?? (await existing).Missed;
        const updated = await medfactRepository.save(existing);
    }
}

