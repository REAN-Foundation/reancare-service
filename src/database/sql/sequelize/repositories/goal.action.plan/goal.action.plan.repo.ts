import { Logger } from '../../../../../common/logger';
import { ApiError } from '../../../../../common/api.error';
import { IActionPlanRepo } from '../../../../../database/repository.interfaces/goal.action.plan/goal.action.plan.repo.interface';
import { ActionPlanDto } from '../../../../../domain.types/goal.action.plan/goal.action.plan.dto';
import { ActionPlanDomainModel } from '../../../../../domain.types/goal.action.plan/goal.action.plan.domain.model';
import GoalAction from '../../models/goal.action.plan/goal.action.model';
import { ActionPlanMapper } from '../../mappers/goal.action.plan/goal.action.plan.mapper';

///////////////////////////////////////////////////////////////////////

export class ActionPlanRepo implements IActionPlanRepo {

    create = async (createModel: ActionPlanDomainModel): Promise<ActionPlanDto> => {
        try {
            const entity = {
                PatientUserId        : createModel.PatientUserId,
                Provider             : createModel.Provider,
                ProviderEnrollmentId : createModel.ProviderEnrollmentId,
                ProviderCareplanCode : createModel.ProviderCareplanCode,
                ProviderCareplanName : createModel.ProviderCareplanName,
                GoalId               : createModel.GoalId,
                Title                : createModel.Title,
                StartedAt            : createModel.StartedAt,
                ScheduledEndDate     : createModel.ScheduledEndDate,
            };

            const actionPlan = await GoalAction.create(entity);
            return await ActionPlanMapper.toDto(actionPlan);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getAll = async (actionPlanDomainModel: ActionPlanDomainModel): Promise<ActionPlanDto[]> => {
        try {
            const actionPlans = await GoalAction.findAll({
                where : { PatientUserId: actionPlanDomainModel.PatientUserId },
            });

            const dtos: ActionPlanDto[] = [];
            for (const actionPlan of actionPlans) {
                const dto = await ActionPlanMapper.toDto(actionPlan);
                dtos.push(dto);
            }

            return dtos;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
