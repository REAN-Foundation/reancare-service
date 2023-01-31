
import { ProgressStatus } from '../../../../../../domain.types/miscellaneous/system.types';
import { UserLearningDto } from '../../../../../../domain.types/educational/learning/user.learning/user.learning.dto';
import UserLearningModel from '../../../models/educational/learning/user.learning.model';

///////////////////////////////////////////////////////////////////////////////////

export class UserLearningMapper {

    static toDto = (userLearning: UserLearningModel): UserLearningDto => {
        if (userLearning == null) {
            return null;
        }
        const dto: UserLearningDto = {
            id                   : userLearning.id,
            UserId               : userLearning.UserId ,
            LearningPathId       : userLearning.LearningPathId ,
            CourseId             : userLearning.CourseId,
            ModuleId             : userLearning.ModuleId,
            ContentId            : userLearning.ContentId,
            ActionId             : userLearning.ActionId,
            CreatedDate          : userLearning.CreatedAt,
            UpdateDate           : userLearning.UpdatedAt,
            ProgressStatus       : userLearning.ProgressStatus as ProgressStatus,
            PercentageCompletion : userLearning.PercentageCompletion,
        };
        return dto;
    };

}
