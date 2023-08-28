import { CourseModuleDto } from '../../../../../../domain.types/educational/learning/course.module/course.module.dto';
import CourseModuleModel from '../../../models/educational/learning/course.module.model';

///////////////////////////////////////////////////////////////////////////////////

export class CourseModuleMapper {

    static toDto = (
        courseModule: CourseModuleModel): CourseModuleDto => {
        if (courseModule == null) {
            return null;
        }
        const dto: CourseModuleDto = {
            id             : courseModule.id,
            CourseId       : courseModule.CourseId,
            LearningPathId : courseModule.LearningPathId,
            Name           : courseModule.Name,
            Description    : courseModule.Description,
            ImageUrl       : courseModule.ImageUrl,
            DurationInMins : courseModule.DurationInMins,
            Sequence       : courseModule.Sequence,
        };
        return dto;
    };

}
