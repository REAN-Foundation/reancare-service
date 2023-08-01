import { LessThanOrEqual, Repository } from 'typeorm';
import { AwardsFactsSource } from './awards.facts.db.connector';
import { AwardsFact } from './awards.facts.service';
import { SleepService } from '../../services/wellness/daily.records/sleep.service';
import { Loader } from '../../startup/loader';
import { Logger } from '../../common/logger';
import { MentalHealthFact } from './models/mental.health.fact.model';
import { MeditationService } from '../../services/wellness/exercise/meditation.service';
import { HelperRepo } from '../../database/sql/sequelize/repositories/common/helper.repo';
import { TimeHelper } from '../../common/time.helper';
import { DurationType } from '../../domain.types/miscellaneous/time.types';

//////////////////////////////////////////////////////////////////////////////

export const updateMentalHealthFact = async (model: AwardsFact) => {

    const mentalHealthfactRepository: Repository<MentalHealthFact> = AwardsFactsSource.getRepository(MentalHealthFact);
    
    const mentalHealthService = await getService(model.Facts.Name);

    const lastRecords = await mentalHealthfactRepository.find({
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

    await addOrUpdateMentalHealthRecord(model);

    const lastRecord = lastRecords.length > 0 ? lastRecords[0] : null;
    var unpopulatedRecords = [];
    if (lastRecord == null) {
        unpopulatedRecords = await mentalHealthService.getAllUserResponsesBefore(
            model.PatientUserId, new Date());
    }
    else {
        unpopulatedRecords = await mentalHealthService.getAllUserResponsesBetween(
            model.PatientUserId, lastRecord.RecordDate, new Date());
    }
    for await (var r of unpopulatedRecords) {
        const model_: AwardsFact = {
            PatientUserId  : model.PatientUserId,
            RecordId       : r.RecordId,
            RecordDate     : r.RecordDate,
            RecordDateStr  : r.RecordDateStr,
            FactType       : 'Mental-Health',
            RecordTimeZone : r.RecordTimeZone,
            Facts          : {
                Name     : r.Name,
                Duration : r.Duration,
                Unit     : r.Unit
            }
        };
        await addOrUpdateMentalHealthRecord(model_);
    }

    async function addOrUpdateMentalHealthRecord(model: AwardsFact) {
        const mentalHealthfactRepository: Repository<MentalHealthFact> = AwardsFactsSource.getRepository(MentalHealthFact);
        const existing = await mentalHealthfactRepository.findOne({
            where : {
                RecordId : model.RecordId
            }
        });
        if (!existing) {
            const fact = {
                RecordId           : model.RecordId,
                ContextReferenceId : model.PatientUserId,
                Name               : model.Facts.Name,
                Duration           : model.Facts.Duration,
                Unit               : model.Facts.Unit,
                RecordDate         : model.RecordDate,
                RecordDateStr      : model.RecordDateStr,
                RecordTimeZone     : model.RecordTimeZone,
            };
            const record = await mentalHealthfactRepository.create(fact);
            const saved = await mentalHealthfactRepository.save(record);
            Logger.instance().log(`${JSON.stringify(saved, null, 2)}`);
        }
        else {
            existing.Duration = model.Facts.Duration ?? (await existing).Duration;
            const saved = await mentalHealthfactRepository.save(existing);
            Logger.instance().log(`${JSON.stringify(saved, null, 2)}`);
        }
    }

    async function getService(Name) {
        const service = {
            "Sleep"      : Loader.container.resolve(SleepService),
            "Meditation" : Loader.container.resolve(MeditationService)
        };
        return service[Name];
    }

};
