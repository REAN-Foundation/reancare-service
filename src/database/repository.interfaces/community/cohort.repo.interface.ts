import {
    CohortCreateDomainModel,
    CohortUpdateDomainModel,
    CohortSearchFilters,
    CohortDto,
    CohortSearchResults
} from '../../../domain.types/community/cohorts/cohort.domain.model';
import { uuid } from "../../../domain.types/miscellaneous/system.types";

////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface ICohortRepo {

    create(model: CohortCreateDomainModel): Promise<CohortDto>;

    search(filters: CohortSearchFilters): Promise<CohortSearchResults>;

    getById(id: uuid): Promise<CohortDto>;

    update(id: uuid, updates: CohortUpdateDomainModel): Promise<CohortDto>;

    delete(id: uuid): Promise<boolean>;

    addUserToCohort(groupId: uuid, userId: uuid): Promise<boolean>;

    removeUserFromCohort(groupId: uuid, userId: uuid): Promise<boolean>;

    getCohortUsers(groupId: uuid): Promise<any[]>;

    getCohortStats(groupId: uuid): Promise<any>;

    getCohortsForTenant(tenantId: uuid): Promise<CohortDto[]>;

    removeUserFromAllCohorts(userId: uuid): Promise<boolean>;

}
