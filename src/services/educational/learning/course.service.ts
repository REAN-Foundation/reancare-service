import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { ICourseRepo } from "../../../database/repository.interfaces/educational/learning/course.repo.interface";
import { CourseDomainModel } from '../../../domain.types/educational/learning/course/course.domain.model';
import { CourseDto } from '../../../domain.types/educational/learning/course/course.dto';
import { CourseSearchFilters, CourseSearchResults } from '../../../domain.types/educational/learning/course/course.search.types';
import { ICourseModuleRepo } from "../../../database/repository.interfaces/educational/learning/course.module.repo.interface";
import { ICourseContentRepo } from "../../../database/repository.interfaces/educational/learning/course.content.repo.interface";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class CourseService {

    constructor(
        @inject('ICourseRepo') private _courseRepo: ICourseRepo,
        @inject('ICourseModuleRepo') private _courseModuleRepo: ICourseModuleRepo,
        @inject('ICourseContentRepo') private _courseContentRepo: ICourseContentRepo,
    ) {}

    create = async (courseDomainModel: CourseDomainModel):
    Promise<CourseDto> => {
        return await this._courseRepo.create(courseDomainModel);
    };

    getById = async (id: uuid): Promise<CourseDto> => {
        const course = await this._courseRepo.getById(id);
        const modules = await this._courseModuleRepo.getModulesForCourse(course.id);
        for await (var module of modules) {
            const contents = await this._courseContentRepo.GetContentsForModule(module.id);
            module['Contents'] = contents;
        }
        course['Modules'] = modules;
        const learningPaths = await this._courseRepo.getLearningPathsForCourse(id);
        course['LearningPaths'] = learningPaths;
        return course;
    };

    search = async (filters: CourseSearchFilters): Promise<CourseSearchResults> => {
        return await this._courseRepo.search(filters);
    };

    update = async (id: uuid, courseDomainModel: CourseDomainModel):
    Promise<CourseDto> => {
        return await this._courseRepo.update(id, courseDomainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._courseRepo.delete(id);
    };

}
