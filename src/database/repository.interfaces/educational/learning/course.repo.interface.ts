
import { CourseDomainModel } from "../../../../domain.types/educational/learning/course/course.domain.model";
import { CourseDto } from "../../../../domain.types/educational/learning/course/course.dto";
import { CourseSearchFilters,
    CourseSearchResults } from "../../../../domain.types/educational/learning/course/course.search.types";

export interface ICourseRepo {

    create(courseDomainModel: CourseDomainModel): Promise<CourseDto>;

    getById(id: string): Promise<CourseDto>;

    search(filters: CourseSearchFilters): Promise<CourseSearchResults>;

    update(id: string, courseDomainModel: CourseDomainModel): Promise<CourseDto>;

    delete(id: string): Promise<boolean>;

    getCoursesForLearningPath(learningPathId: string): Promise<any>;

    getLearningPathsForCourse(courseId: string): Promise<any>;

}
