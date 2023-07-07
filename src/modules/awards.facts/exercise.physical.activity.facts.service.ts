import { LessThanOrEqual, Repository } from 'typeorm';
import { AwardsFactsSource } from './awards.facts.db.connector';
import { AwardsFact } from './awards.facts.service';
import { Loader } from '../../startup/loader';
import { Logger } from '../../common/logger';
import { ExercisePhysicalActivityFact } from './models/exercise.physical.activity.fact.model';
import { PhysicalActivityService } from '../../services/wellness/exercise/physical.activity.service';
import { HelperRepo } from '../../database/sql/sequelize/repositories/common/helper.repo';
import { TimeHelper } from '../../common/time.helper';
import { DurationType } from '../../domain.types/miscellaneous/time.types';

//////////////////////////////////////////////////////////////////////////////

export const updatePhysicalActivityFact = async (model: AwardsFact) => {

    const physicalActivityfactRepository: Repository<ExercisePhysicalActivityFact> =
        AwardsFactsSource.getRepository(ExercisePhysicalActivityFact);
    const physicalActivityService = Loader.container.resolve(PhysicalActivityService);

    const lastRecords = await physicalActivityfactRepository.find({
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

    await addOrUpdatePhysicalActivityRecord(model);

    const lastRecord = lastRecords.length > 0 ? lastRecords[0] : null;
    var unpopulatedRecords = [];
    if (lastRecord == null) {
        unpopulatedRecords = await physicalActivityService.getAllUserResponsesBefore(
            model.PatientUserId, new Date());
    }
    else {
        unpopulatedRecords = await physicalActivityService.getAllUserResponsesBetween(
            model.PatientUserId, lastRecord.RecordDate, new Date());
    }
    for await (var r of unpopulatedRecords) {
        const model_: AwardsFact = {
            PatientUserId  : model.PatientUserId,
            RecordId       : r.RecordId,
            RecordDate     : r.RecordDate,
            RecordDateStr  : r.RecordDateStr,
            FactType       : 'Physical-Activity',
            RecordTimeZone : r.RecordTimeZone,
            Facts          : {
                PhysicalActivityQuestionAns : r.PhysicalActivityQuestionAns,
            }
        };
        await addOrUpdatePhysicalActivityRecord(model_);
    }

};

async function addOrUpdatePhysicalActivityRecord(model: AwardsFact) {
    const physicalActivityFactRepository: Repository<ExercisePhysicalActivityFact> =
        AwardsFactsSource.getRepository(ExercisePhysicalActivityFact);
    const existing = await physicalActivityFactRepository.findOne({
        where : {
            RecordId : model.RecordId
        }
    });
    if (!existing) {
        const fact = {
            RecordId                    : model.RecordId,
            ContextReferenceId          : model.PatientUserId,
            PhysicalActivityQuestionAns : model.Facts.PhysicalActivityQuestionAns,
            RecordDate                  : model.RecordDate,
            RecordDateStr               : model.RecordDateStr,
            RecordTimeZone              : model.RecordTimeZone
        };
        const record = await physicalActivityFactRepository.create(fact);
        const saved = await physicalActivityFactRepository.save(record);
        Logger.instance().log(`${JSON.stringify(saved, null, 2)}`);
    }
    else {
        existing.PhysicalActivityQuestionAns = model.Facts.UserResponse ?? (await existing).PhysicalActivityQuestionAns;
        const saved = await physicalActivityFactRepository.save(existing);
        Logger.instance().log(`${JSON.stringify(saved, null, 2)}`);
    }
}
