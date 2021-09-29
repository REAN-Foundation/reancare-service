import PhysicalActivity from '../../models/exercise/physical.activity.model';
import { PhysicalActivityDto } from '../../../../../domain.types/exercise/physical.activity/physical.activity.dto';
import { PhysicalActivityCategories, Intensity } from '../../../../../domain.types/exercise/physical.activity/physical.activity.types';

///////////////////////////////////////////////////////////////////////////////////

export class PhysicalActivityMapper {

    static toDto = (physicalActivity: PhysicalActivity): PhysicalActivityDto => {
        if (physicalActivity == null){
            return null;
        }

        const dto: PhysicalActivityDto = {
            id             : physicalActivity.id,
            PatientUserId  : physicalActivity.PatientUserId,
            Exercise       : physicalActivity.Exercise,
            Description    : physicalActivity.Description,
            Category       : physicalActivity.Category as PhysicalActivityCategories,
            Intensity      : physicalActivity.Intensity as Intensity,
            CaloriesBurned : physicalActivity.CaloriesBurned,
            StartTime      : physicalActivity.StartTime,
            EndTime        : physicalActivity.EndTime,
            DurationInMin  : physicalActivity.DurationInMin,
        };
        return dto;
    }

}
