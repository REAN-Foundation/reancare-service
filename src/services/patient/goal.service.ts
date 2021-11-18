import { inject, injectable } from "tsyringe";
import { IGoalRepo } from "../../database/repository.interfaces/patient/goal.repo.interface";
import { uuid } from "../../domain.types/miscellaneous/system.types";
import { GoalDomainModel } from '../../domain.types/patient/goal/goal.domain.model';
import { GoalDto } from '../../domain.types/patient/goal/goal.dto';
import { GoalSearchFilters, GoalSearchResults } from '../../domain.types/patient/goal/goal.search.types';
import { BaseResourceService } from "../../services/base.resource.service";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class GoalService extends BaseResourceService {

    constructor(
        @inject('IGoalRepo') private _goalRepo: IGoalRepo,
    ) {
        super();
    }

    create = async (goalDomainModel: GoalDomainModel): Promise<GoalDto> => {
        return await this._goalRepo.create(goalDomainModel);
    };

    getById = async (id: uuid): Promise<GoalDto> => {
        return await this._goalRepo.getById(id);
    };

    search = async (filters: GoalSearchFilters): Promise<GoalSearchResults> => {
        return await this._goalRepo.search(filters);
    };

    update = async (id: uuid, goalDomainModel: GoalDomainModel): Promise<GoalDto> => {
        return await this._goalRepo.update(id, goalDomainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._goalRepo.delete(id);
    };

}
