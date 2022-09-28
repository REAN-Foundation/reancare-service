import { CourseContentDomainModel } from "../../../../domain.types/educational/learning/course.content/course.content.domain.model";
import { CourseContentDto } from "../../../../domain.types/educational/learning/course.content/course.content.dto";
import { CourseContentSearchFilters,
    CourseContentSearchResults
} from "../../../../domain.types/educational/learning/course.content/course.content.search.types";

export interface ICourseContentRepo {

    create(courseContentDomainModel: CourseContentDomainModel): Promise<CourseContentDto>;

    getById(id: string): Promise<CourseContentDto>;

    search(filters: CourseContentSearchFilters): Promise<CourseContentSearchResults>;

    update(id: string, courseContentDomainModel: CourseContentDomainModel): Promise<CourseContentDto>;

    delete(id: string): Promise<boolean>;

    GetContentsForModule(moduleId: string): Promise<CourseContentDto[]>;

    getContentsForCourse(courseId: string): Promise<CourseContentDto[]>;

    getContentsForLearningPath(learningPathId: string): Promise<CourseContentDto[]>;
}
