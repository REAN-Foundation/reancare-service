import { CourseDto } from '../../../../../../domain.types/educational/learning/course/course.dto';
import CourseModel from '../../../models/educational/learning/course.model';

///////////////////////////////////////////////////////////////////////////////////

export class CourseMapper {

    static toDto = (
        course: CourseModel): CourseDto => {
        if (course == null) {
            return null;
        }

        const dto: CourseDto = {
            id             : course.id,
            Name           : course.Name,
            Description    : course.Description,
            ImageUrl       : course.ImageUrl,
            DurationInDays : course.DurationInDays,
            Modules        : course.CourseModules,
            CreatedAt      : course.CreatedAt,
            LearningPaths  : course.LearningPathCourses,
        };
        return dto;
    };

}
