import DailyAssessment from '../../../models/clinical/daily.assessment/daily.assessment.model';
import { DailyAssessmentDto } from '../../../../../../domain.types/clinical/daily.assessment/daily.assessment.dto';
import { DailyAssessmentEnergyLevels, DailyAssessmentFeelings, DailyAssessmentMoods } from '../../../../../../domain.types/clinical/daily.assessment/daily.assessment.types';

///////////////////////////////////////////////////////////////////////////////////

export class DailyAssessmentMapper {

    static toDto = (dailyAssessment: DailyAssessment): DailyAssessmentDto => {
        if (dailyAssessment == null){
            return null;
        }

        var energyLevels = [];
        if (dailyAssessment.EnergyLevels !== null && dailyAssessment.EnergyLevels !== undefined) {
            energyLevels = JSON.parse(dailyAssessment.EnergyLevels);
        }

        const dto: DailyAssessmentDto = {
            id            : dailyAssessment.id,
            EhrId         : dailyAssessment.EhrId,
            PatientUserId : dailyAssessment.PatientUserId,
            Feeling       : dailyAssessment.Feeling as DailyAssessmentFeelings,
            Mood          : dailyAssessment.Mood as DailyAssessmentMoods,
            EnergyLevels  : energyLevels as DailyAssessmentEnergyLevels[],
            RecordDate    : dailyAssessment.RecordDate,
        };
        return dto;
    };

}
