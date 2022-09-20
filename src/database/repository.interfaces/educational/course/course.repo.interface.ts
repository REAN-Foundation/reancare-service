
import { CourseDomainModel } from "../../../../domain.types/educational/course/course/course.domain.model";
import { CourseDto } from "../../../../domain.types/educational/course/course/course.dto";
import { CourseSearchFilters,
    CourseSearchResults } from "../../../../domain.types/educational/course/course/course.search.types";

export interface ICourseRepo {

    create(courseDomainModel: CourseDomainModel): Promise<CourseDto>;

    getById(id: string): Promise<CourseDto>;

    search(filters: CourseSearchFilters): Promise<CourseSearchResults>;

    update(id: string, courseDomainModel: CourseDomainModel): Promise<CourseDto>;

    delete(id: string): Promise<boolean>;

}
