import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { ILearningPathRepo } from "../../../database/repository.interfaces/educational/course/learning.path.repo.interface";
import { LearningPathDomainModel } from '../../../domain.types/educational/course/learning.path/learning.path.domain.model';
import { LearningPathDto } from '../../../domain.types/educational/course/learning.path/learning.path.dto';
import { LearningPathSearchFilters, LearningPathSearchResults } from '../../../domain.types/educational/course/learning.path/learning.path.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class LearningPathService {

    constructor(
        @inject('ILearningPathRepo') private _learningPathRepo: ILearningPathRepo,
    ) {}

    create = async (courseDomainModel: LearningPathDomainModel):
    Promise<LearningPathDto> => {
        return await this._learningPathRepo.create(courseDomainModel);
    };

    getById = async (id: uuid): Promise<LearningPathDto> => {
        return await this._learningPathRepo.getById(id);
    };

    search = async (filters: LearningPathSearchFilters): Promise<LearningPathSearchResults> => {
        return await this._learningPathRepo.search(filters);
    };

    update = async (id: uuid, courseDomainModel: LearningPathDomainModel):
    Promise<LearningPathDto> => {
        return await this._learningPathRepo.update(id, courseDomainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._learningPathRepo.delete(id);
    };

}
