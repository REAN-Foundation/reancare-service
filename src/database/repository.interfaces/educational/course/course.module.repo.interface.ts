import { CourseModuleDomainModel } from "../../../../domain.types/educational/course/course.module/course.module.domain.model";
import { CourseModuleDto } from "../../../../domain.types/educational/course/course.module/course.module.dto";
import { CourseModuleSearchFilters,
    CourseModuleSearchResults
} from "../../../../domain.types/educational/course/course.module/course.module.search.types";

export interface ICourseModuleRepo {

    create(courseModuleDomainModel: CourseModuleDomainModel): Promise<CourseModuleDto>;

    getById(id: string): Promise<CourseModuleDto>;

    search(filters: CourseModuleSearchFilters): Promise<CourseModuleSearchResults>;

    update(id: string, courseModuleDomainModel: CourseModuleDomainModel): Promise<CourseModuleDto>;

    delete(id: string): Promise<boolean>;
}
