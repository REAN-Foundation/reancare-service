import { ActionPlanDomainModel } from '../../../domain.types/goal.action.plan/goal.action.plan.domain.model';
import { ActionPlanDto } from '../../../domain.types/goal.action.plan/goal.action.plan.dto';

export interface IActionPlanRepo {

    create(actionPlanDomainModel: ActionPlanDomainModel): Promise<ActionPlanDto>;

    getAll(healthPriorityDomainModel: ActionPlanDomainModel): Promise<ActionPlanDto[]>;

}
