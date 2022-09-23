import { CourseModuleDto } from '../../../../../../domain.types/educational/course.module/course.module.dto';
import CourseModuleModel from '../../../models/educational/course.module/course.module.model';

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
            Name           : courseModule.Name,
            Description    : courseModule.Description,
            ImageUrl       : courseModule.ImageUrl,
            DurationInMins : courseModule.DurationInMins,
        };
        return dto;
    };

}
