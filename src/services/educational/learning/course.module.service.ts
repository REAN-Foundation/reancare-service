import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { ICourseModuleRepo } from "../../../database/repository.interfaces/educational/learning/course.module.repo.interface";
import { CourseModuleDomainModel } from '../../../domain.types/educational/learning/course.module/course.module.domain.model';
import { CourseModuleDto } from '../../../domain.types/educational/learning/course.module/course.module.dto';
import { CourseModuleSearchFilters,
    CourseModuleSearchResults
} from '../../../domain.types/educational/learning/course.module/course.module.search.types';
import { ICourseContentRepo } from "../../../database/repository.interfaces/educational/learning/course.content.repo.interface";
////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class CourseModuleService {

    constructor(
        @inject('ICourseModuleRepo') private _courseModuleRepo: ICourseModuleRepo,
        @inject('ICourseContentRepo') private _courseContentRepo: ICourseContentRepo,
    ) {}

    create = async (courseModuleDomainModel: CourseModuleDomainModel): Promise<CourseModuleDto> => {
        return await this._courseModuleRepo.create(courseModuleDomainModel);
    };

    getById = async (id: uuid): Promise<CourseModuleDto> => {
        const module = await this._courseModuleRepo.getById(id);
        const contents = await this._courseContentRepo.GetContentsForModule(module.id);
        module['Contents'] = contents;
        return  module;
    };

    search = async (filters: CourseModuleSearchFilters): Promise<CourseModuleSearchResults> => {
        return await this._courseModuleRepo.search(filters);
    };

    update = async (id: uuid, courseModuleDomainModel: CourseModuleDomainModel): Promise<CourseModuleDto> => {
        return await this._courseModuleRepo.update(id, courseModuleDomainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._courseModuleRepo.delete(id);
    };

}
