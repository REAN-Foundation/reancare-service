import { PhysicalActivityDto } from '../../../../../../domain.types/wellness/exercise/physical.activity/physical.activity.dto';
import { Intensity, PhysicalActivityCategories } from '../../../../../../domain.types/wellness/exercise/physical.activity/physical.activity.types';
import PhysicalActivity from '../../../models/wellness/exercise/physical.activity.model';

///////////////////////////////////////////////////////////////////////////////////

export class PhysicalActivityMapper {

    static toDto = (physicalActivity: PhysicalActivity): PhysicalActivityDto => {
        if (physicalActivity == null){
            return null;
        }

        const dto: PhysicalActivityDto = {
            id                          : physicalActivity.id,
            PatientUserId               : physicalActivity.PatientUserId,
            Exercise                    : physicalActivity.Exercise,
            Description                 : physicalActivity.Description,
            Category                    : physicalActivity.Category as PhysicalActivityCategories,
            Intensity                   : physicalActivity.Intensity as Intensity,
            CaloriesBurned              : physicalActivity.CaloriesBurned,
            StartTime                   : physicalActivity.StartTime,
            EndTime                     : physicalActivity.EndTime,
            TerraSummaryId              : physicalActivity.TerraSummaryId,
            Provider                    : physicalActivity.Provider,
            DurationInMin               : physicalActivity.DurationInMin,
            PhysicalActivityQuestion    : physicalActivity.PhysicalActivityQuestion,
            PhysicalActivityQuestionAns : physicalActivity.PhysicalActivityQuestionAns,
            CreatedAt                   : physicalActivity.CreatedAt,
            UpdatedAt                   : physicalActivity.UpdatedAt,
        };
        return dto;
    };

}
