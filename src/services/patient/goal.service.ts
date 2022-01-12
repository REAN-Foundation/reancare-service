import { CareplanHandler } from "../../modules/careplan/careplan.handler";
import { inject, injectable } from "tsyringe";
import { IGoalRepo } from "../../database/repository.interfaces/patient/goal.repo.interface";
import { GoalDomainModel } from '../../domain.types/patient/goal/goal.domain.model';
import { GoalDto } from '../../domain.types/patient/goal/goal.dto';
import { GoalSearchResults, GoalSearchFilters } from '../../domain.types/patient/goal/goal.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class GoalService {

    _careplanHandler: CareplanHandler = new CareplanHandler();

    constructor(
        @inject('IGoalRepo') private _goalRepo: IGoalRepo,
    ) {}

    create = async (goalDomainModel: GoalDomainModel): Promise<GoalDto> => {
        return await this._goalRepo.create(goalDomainModel);
    };

    getById = async (id: string): Promise<GoalDto> => {
        return await this._goalRepo.getById(id);
    };

    search = async (filters: GoalSearchFilters): Promise<GoalSearchResults> => {
        var searchResults = await this._goalRepo.search(filters);

        for (const i of searchResults.Items) {
            if (i.ActionId != null && i.ActionType === 'Careplan' ) {

                goals = await this._handler.getGoals(
                    participantDetails, enrollmentDetails.Provider);
            }

            //await this._rolePrivilegeRepo.create({
                RoleId    : role.id,
                Privilege : p,
            });
        }
        return searchResults;
    };

    update = async (id: string, goalDomainModel: GoalDomainModel): Promise<GoalDto> => {
        return await this._goalRepo.update(id, goalDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._goalRepo.delete(id);
    };

}
