import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { ICourseContentRepo } from "../../../database/repository.interfaces/educational/learning/course.content.repo.interface";
import { CourseContentDomainModel } from '../../../domain.types/educational/learning/course.content/course.content.domain.model';
import { CourseContentDto } from '../../../domain.types/educational/learning/course.content/course.content.dto';
import { CourseContentSearchFilters,CourseContentSearchResults } from '../../../domain.types/educational/learning/course.content/course.content.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class CourseContentService {

    constructor(
        @inject('ICourseContentRepo') private _courseContentRepo: ICourseContentRepo,
    ) {}

    create = async (courseContentDomainModel: CourseContentDomainModel): Promise<CourseContentDto> => {
        return await this._courseContentRepo.create(courseContentDomainModel);
    };

    getById = async (id: uuid): Promise<CourseContentDto> => {
        return await this._courseContentRepo.getById(id);
    };

    search = async (filters: CourseContentSearchFilters): Promise<CourseContentSearchResults> => {
        return await this._courseContentRepo.search(filters);
    };

    update = async (id: uuid, courseContentDomainModel: CourseContentDomainModel): Promise<CourseContentDto> => {
        return await this._courseContentRepo.update(id, courseContentDomainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._courseContentRepo.delete(id);
    };

    getContentsForCourse = async (courseId: uuid): Promise<CourseContentDto[]> => {
        return await this._courseContentRepo.getContentsForCourse(courseId);
    };

    getContentsForLearningPath = async (learningPathId: uuid): Promise<CourseContentDto[]> => {
        return await this._courseContentRepo.getContentsForLearningPath(learningPathId);
    };

}
