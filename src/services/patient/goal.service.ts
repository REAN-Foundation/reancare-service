import { CareplanHandler } from "../../modules/careplan/careplan.handler";
import { inject, injectable } from "tsyringe";
import { IGoalRepo } from "../../database/repository.interfaces/patient/goal.repo.interface";
import { GoalDomainModel } from '../../domain.types/patient/goal/goal.domain.model';
import { GoalDto } from '../../domain.types/patient/goal/goal.dto';
import { GoalSearchResults, GoalSearchFilters } from '../../domain.types/patient/goal/goal.search.types';
import { IHealthPriorityRepo } from "../../database/repository.interfaces/patient/health.priority/health.priority.repo.interface";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class GoalService {

    _careplanHandler: CareplanHandler = new CareplanHandler();

    constructor(
        @inject('IGoalRepo') private _goalRepo: IGoalRepo,
        @inject('IHealthPriorityRepo') private _healthPriorityRepo: IHealthPriorityRepo,

    ) {}

    create = async (goalDomainModel: GoalDomainModel): Promise<GoalDto> => {
        return await this._goalRepo.create(goalDomainModel);
    };

    getById = async (id: string): Promise<GoalDto> => {
        return await this._goalRepo.getById(id);
    };

    getPatientGoals = async (patientUserId: string): Promise<GoalDto[]> => {
        return await this._goalRepo.getSelectedGoals(patientUserId);
    };

    getGoalsByPriority = async (priorityId: string): Promise<GoalDto[]> => {
        
        var priority =  await this._healthPriorityRepo.getById(priorityId);

        var goals =  await this._careplanHandler.getGoals(priority.PatientUserId, priority.ProviderEnrollmentId,
            priority.Provider, priority.HealthPriorityType);

        const goalModels = goals.map(x => {
            var a: GoalDomainModel = {
                PatientUserId        : priority.PatientUserId,
                ProviderEnrollmentId : priority.ProviderEnrollmentId,
                Provider             : priority.Provider,
                ProviderCareplanName : priority.ProviderCareplanName,
                ProviderCareplanCode : priority.ProviderCareplanCode,
                ProviderGoalCode     : x.ProviderGoalCode,
                Title                : x.Title,
                Sequence             : x.Sequence,
                HealthPriorityId     : priority.id,
                GoalAchieved         : false,
                GoalAbandoned        : false,
            };
            return a;
        });
        return goalModels;
    };

    search = async (filters: GoalSearchFilters): Promise<GoalSearchResults> => {
        return await this._goalRepo.search(filters);
    };

    update = async (id: string, goalDomainModel: GoalDomainModel): Promise<GoalDto> => {
        return await this._goalRepo.update(id, goalDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._goalRepo.delete(id);
    };

}
