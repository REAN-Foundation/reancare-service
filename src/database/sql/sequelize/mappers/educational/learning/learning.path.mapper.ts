import { LearningPathDto } from '../../../../../../domain.types/educational/learning/learning.path/learning.path.dto';
import LearningPathModel from '../../../models/educational/learning/learning.path.model';

///////////////////////////////////////////////////////////////////////////////////

export class LearningPathMapper {

    static toDto = (
        course: LearningPathModel): LearningPathDto => {
        if (course == null) {
            return null;
        }

        const dto: LearningPathDto = {
            id               : course.id,
            Name             : course.Name,
            Description      : course.Description,
            ImageUrl         : course.ImageUrl,
            DurationInDays   : course.DurationInDays,
            Courses          : course.LearningPathCourses,
            PreferenceWeight : course.PreferenceWeight,
            Enabled          : course.Enabled,
            CreatedAt        : course.CreatedAt,
        };
        return dto;
    };

}
