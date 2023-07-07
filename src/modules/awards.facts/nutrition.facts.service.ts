import { LessThanOrEqual, Repository } from 'typeorm';
import { AwardsFactsSource } from './awards.facts.db.connector';
import { AwardsFact } from './awards.facts.service';
import { FoodConsumptionService } from '../../services/wellness/nutrition/food.consumption.service';
import { Loader } from '../../startup/loader';
import { Logger } from '../../common/logger';
import { NutritionChoiceFact } from './models/nutrition.choice.fact.model';
import { HelperRepo } from '../../database/sql/sequelize/repositories/common/helper.repo';
import { TimeHelper } from '../../common/time.helper';
import { DurationType } from '../../domain.types/miscellaneous/time.types';

//////////////////////////////////////////////////////////////////////////////

export const updateNutritionFact = async (model: AwardsFact) => {

    const nutritionfactRepository: Repository<NutritionChoiceFact> = AwardsFactsSource.getRepository(NutritionChoiceFact);
    const foodConsumptionService = Loader.container.resolve(FoodConsumptionService);

    const lastRecords = await nutritionfactRepository.find({
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

    await addOrUpdateNutritionRecord(model);

    const lastRecord = lastRecords.length > 0 ? lastRecords[0] : null;
    var unpopulatedRecords = [];
    if (lastRecord == null) {
        unpopulatedRecords = await foodConsumptionService.getAllUserResponsesBefore(
            model.PatientUserId, new Date());
    }
    else {
        unpopulatedRecords = await foodConsumptionService.getAllUserResponsesBetween(
            model.PatientUserId, lastRecord.RecordDate, new Date());
    }
    for await (var r of unpopulatedRecords) {
        const model_: AwardsFact = {
            PatientUserId  : model.PatientUserId,
            RecordId       : r.RecordId,
            RecordDate     : r.RecordDate,
            RecordDateStr  : r.RecordDateStr,
            FactType       : 'Nutrition',
            RecordTimeZone : r.RecordTimeZone,
            Facts          : {
                UserResponse : r.UserResponse,
            }
        };
        await addOrUpdateNutritionRecord(model_);
    }

};

async function addOrUpdateNutritionRecord(model: AwardsFact) {
    const nutritionFactRepository: Repository<NutritionChoiceFact> = AwardsFactsSource.getRepository(NutritionChoiceFact);
    const existing = await nutritionFactRepository.findOne({
        where : {
            RecordId : model.RecordId
        }
    });
    if (!existing) {
        const fact = {
            RecordId           : model.RecordId,
            ContextReferenceId : model.PatientUserId,
            UserResponse       : model.Facts.UserResponse,
            RecordDate         : model.RecordDate,
            RecordDateStr      : model.RecordDateStr,
            RecordTimeZone     : model.RecordTimeZone,
        };
        const record = await nutritionFactRepository.create(fact);
        const saved = await nutritionFactRepository.save(record);
        Logger.instance().log(`${JSON.stringify(saved, null, 2)}`);
    }
    else {
        existing.UserResponse = model.Facts.UserResponse ?? (await existing).UserResponse;
        const saved = await nutritionFactRepository.save(existing);
        Logger.instance().log(`${JSON.stringify(saved, null, 2)}`);
    }
}
