import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { ICourseRepo } from "../../../database/repository.interfaces/educational/course/course.repo.interface";
import { CourseDomainModel } from '../../../domain.types/educational/course/course.domain.model';
import { CourseDto } from '../../../domain.types/educational/course/course.dto';
import { CourseSearchFilters, CourseSearchResults } from '../../../domain.types/educational/course/course.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class CourseService {

    constructor(
        @inject('ICourseRepo') private _courseRepo: ICourseRepo,
    ) {}

    create = async (courseDomainModel: CourseDomainModel):
    Promise<CourseDto> => {
        return await this._courseRepo.create(courseDomainModel);
    };

    getById = async (id: uuid): Promise<CourseDto> => {
        return await this._courseRepo.getById(id);
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
