import { CourseContentDto } from '../../../../../../domain.types/educational/course/course.content/course.content.dto';
import CourseContentModel from '../../../models/educational/course/course.content.model';

///////////////////////////////////////////////////////////////////////////////////

export class CourseContentMapper {

    static toDto = (
        courseContent: CourseContentModel): CourseContentDto => {
        if (courseContent == null) {
            return null;
        }
        const dto: CourseContentDto = {
            id             : courseContent.id,
            ModuleId       : courseContent.ModuleId,
            Title          : courseContent.Title ,
            Description    : courseContent.Description,
            ImageUrl       : courseContent.ImageUrl,
            DurationInMins : courseContent.DurationInMins,
            ContentType    : courseContent.ContentType,
            ResourceLink   : courseContent.ResourceLink,
            Sequence       : courseContent.Sequence,

        };
        return dto;
    };

}
