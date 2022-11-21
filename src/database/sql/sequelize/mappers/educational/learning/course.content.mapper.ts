import { CourseContentType } from '../../../../../../domain.types/educational/learning/course.content/course.content.type';
import { CourseContentDto } from '../../../../../../domain.types/educational/learning/course.content/course.content.dto';
import CourseContentModel from '../../../models/educational/learning/course.content.model';

///////////////////////////////////////////////////////////////////////////////////

export class CourseContentMapper {

    static toDto = (
        courseContent: CourseContentModel): CourseContentDto => {
        if (courseContent == null) {
            return null;
        }
        const dto: CourseContentDto = {
            id               : courseContent.id,
            ModuleId         : courseContent.ModuleId,
            CourseId         : courseContent.CourseId,
            LearningPathId   : courseContent.LearningPathId,
            Title            : courseContent.Title ,
            Description      : courseContent.Description,
            ImageUrl         : courseContent.ImageUrl,
            DurationInMins   : courseContent.DurationInMins,
            ContentType      : courseContent.ContentType as CourseContentType,
            ResourceLink     : courseContent.ResourceLink,
            ActionTemplateId : courseContent.ActionTemplateId,
            Sequence         : courseContent.Sequence,
            Course           : courseContent.Course,
        };
        return dto;
    };

}
