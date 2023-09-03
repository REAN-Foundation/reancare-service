import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { ILearningPathRepo } from "../../../database/repository.interfaces/educational/learning/learning.path.repo.interface";
import { LearningPathDomainModel } from '../../../domain.types/educational/learning/learning.path/learning.path.domain.model';
import { LearningPathDto } from '../../../domain.types/educational/learning/learning.path/learning.path.dto';
import { LearningPathSearchFilters, LearningPathSearchResults } from '../../../domain.types/educational/learning/learning.path/learning.path.search.types';
import { ICourseRepo } from "../../../database/repository.interfaces/educational/learning/course.repo.interface";
import { ICourseModuleRepo } from "../../../database/repository.interfaces/educational/learning/course.module.repo.interface";
import { ICourseContentRepo } from "../../../database/repository.interfaces/educational/learning/course.content.repo.interface";
import { CourseDto } from "../../../domain.types/educational/learning/course/course.dto";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class LearningPathService {

    constructor(
        @inject('ILearningPathRepo') private _learningPathRepo: ILearningPathRepo,
        @inject('ICourseRepo') private _courseRepo: ICourseRepo,
        @inject('ICourseModuleRepo') private _courseModuleRepo: ICourseModuleRepo,
        @inject('ICourseContentRepo') private _courseContentRepo: ICourseContentRepo,
    ) {}

    create = async (courseDomainModel: LearningPathDomainModel):
    Promise<LearningPathDto> => {
        return await this._learningPathRepo.create(courseDomainModel);
    };

    getById = async (id: uuid): Promise<LearningPathDto> => {
        const learningPath = await this._learningPathRepo.getById(id);
        const courses = await this._courseRepo.getCoursesForLearningPath(id);
        for await (var course of courses) {
            const modules = await this._courseModuleRepo.getModulesForCourse(course.id);
            for await (var module of modules) {
                const contents = await this._courseContentRepo.GetContentsForModule(module.id);
                module['Contents'] = contents;
            }
            course['Modules'] = modules;
        }
        learningPath['Courses'] = courses;
        return learningPath;
    };

    search = async (filters: LearningPathSearchFilters): Promise<LearningPathSearchResults> => {
        return await this._learningPathRepo.search(filters);
    };

    update = async (id: uuid, courseDomainModel: LearningPathDomainModel):
    Promise<LearningPathDto> => {
        var dto =  await this._learningPathRepo.update(id, courseDomainModel);
        dto = await this.updateDto(dto);
        return dto;
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._learningPathRepo.delete(id);
    };

    //#region Privates

       private updateDto = async (dto: LearningPathDto): Promise<LearningPathDto> => {
           if (dto == null) {
               return null;
           }
           var courses: CourseDto[] = await this._learningPathRepo.getCourses(dto.id);
           dto.Courses = courses;
           return dto;
       };

}
