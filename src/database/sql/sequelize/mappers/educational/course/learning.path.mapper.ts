import { LearningPathDto } from '../../../../../../domain.types/educational/course/learning.path/learning.path.dto';
import LearningPathModel from '../../../models/educational/course/learning.path.model';

///////////////////////////////////////////////////////////////////////////////////

export class LearningPathMapper {

    static toDto = (
        course: LearningPathModel): LearningPathDto => {
        if (course == null) {
            return null;
        }

        const dto: LearningPathDto = {
            id             : course.id,
            Name           : course.Name,
            Description    : course.Description,
            ImageUrl       : course.ImageUrl,
            DurationInDays : course.DurationInDays,
            StartDate      : course.StartDate,
            EndDate        : course.EndDate,
        };
        return dto;
    };

}
