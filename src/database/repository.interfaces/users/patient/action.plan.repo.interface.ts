import { ActionPlanSearchFilters, ActionPlanSearchResults } from '../../../../domain.types/users/patient/action.plan/action.plan.search.types';
import { ActionPlanDomainModel } from '../../../../domain.types/users/patient/action.plan/action.plan.domain.model';
import { ActionPlanDto } from '../../../../domain.types/users/patient/action.plan/action.plan.dto';

export interface IActionPlanRepo {

    create(actionPlanDomainModel: ActionPlanDomainModel): Promise<ActionPlanDto>;

    getAll(patientUserId: string): Promise<ActionPlanDto[]>;

    getById(id: string): Promise<ActionPlanDto>;

    search(filters: ActionPlanSearchFilters): Promise<ActionPlanSearchResults>;

    update(id: string, actionPlanDomainModel: ActionPlanDomainModel): Promise<ActionPlanDto>;

    delete(id: string): Promise<boolean>;

}
