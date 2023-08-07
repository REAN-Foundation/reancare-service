import { inject, injectable } from "tsyringe";
import { ICohortRepo } from "../../database/repository.interfaces/community/cohort.repo.interface";
import {
    CohortCreateDomainModel,
    CohortUpdateDomainModel,
    CohortSearchFilters,
    CohortDto,
    CohortSearchResults
} from '../../domain.types/community/cohorts/cohort.domain.model';
import { IUserRepo } from "../../database/repository.interfaces/users/user/user.repo.interface";
import { UserDto } from "../../domain.types/users/user/user.dto";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class CohortService {

    constructor(
            @inject('ICohortRepo') private _cohortRepo: ICohortRepo,
            @inject('IUserRepo') private _userRepo: IUserRepo,
    ) {}

    create = async (model: CohortCreateDomainModel): Promise<CohortDto> => {
        return await this._cohortRepo.create(model);
    };

    search = async (filters: CohortSearchFilters): Promise<CohortSearchResults> => {
        return await this._cohortRepo.search(filters);
    };

    getById = async (id: string): Promise<CohortDto> => {
        return await this._cohortRepo.getById(id);
    };

    update = async (id: string, updates: CohortUpdateDomainModel): Promise<CohortDto> => {
        return await this._cohortRepo.update(id, updates);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._cohortRepo.delete(id);
    };

    addUserToCohort = async (cohortId: string, userId: string): Promise<boolean> => {
        return await this._cohortRepo.addUserToCohort(cohortId, userId);
    };

    removeUserFromCohort = async (cohortId: string, userId: string): Promise<boolean> => {
        return await this._cohortRepo.removeUserFromCohort(cohortId, userId);
    };

    getCohortUsers = async (cohortId: string): Promise<UserDto[]> => {
        return await this._cohortRepo.getCohortUsers(cohortId);
    };

    getCohortStats = async (cohortId: string): Promise<any> => {
        return await this._cohortRepo.getCohortStats(cohortId);
    };

    getCohortsForTenant = async (tenantId: string): Promise<CohortDto[]> => {
        return await this._cohortRepo.getCohortsForTenant(tenantId);
    };

    removeUserFromAllCohorts = async (userId: string): Promise<boolean> => {
        return await this._cohortRepo.removeUserFromAllCohorts(userId);
    };

}
