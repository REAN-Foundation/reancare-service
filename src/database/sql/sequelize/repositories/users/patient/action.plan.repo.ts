import { Logger } from '../../../../../../common/logger';
import { ApiError } from '../../../../../../common/api.error';
import { IActionPlanRepo } from '../../../../../repository.interfaces/users/patient/action.plan.repo.interface';
import { ActionPlanDto } from '../../../../../../domain.types/users/patient/action.plan/action.plan.dto';
import { ActionPlanDomainModel } from '../../../../../../domain.types/users/patient/action.plan/action.plan.domain.model';
import ActionPlan from '../../../models/users/patient/action.plan.model';
import { ActionPlanMapper } from '../../../mappers/users/patient/action.plan.mapper';
import { ActionPlanSearchFilters, ActionPlanSearchResults } from '../../../../../../domain.types/users/patient/action.plan/action.plan.search.types';

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

            const actionPlan = await ActionPlan.create(entity);
            return ActionPlanMapper.toDto(actionPlan);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getAll = async (patientUserId: string): Promise<ActionPlanDto[]> => {
        try {
            const actionPlans = await ActionPlan.findAll({
                where : { PatientUserId: patientUserId },
            });

            const dtos: ActionPlanDto[] = [];
            for (const actionPlan of actionPlans) {
                const dto = ActionPlanMapper.toDto(actionPlan);
                dtos.push(dto);
            }

            return dtos;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<ActionPlanDto> => {
        try {
            const actionPlan = await ActionPlan.findByPk(id);
            return ActionPlanMapper.toDto(actionPlan);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: ActionPlanSearchFilters): Promise<ActionPlanSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.ProviderEnrollmentId != null) {
                search.where['ProviderEnrollmentId'] = filters.ProviderEnrollmentId;
            }
            if (filters.ProviderCareplanCode != null) {
                search.where['ProviderCareplanCode'] = filters.ProviderCareplanCode;
            }
            if (filters.ProviderCareplanName != null) {
                search.where['ProviderCareplanName'] = filters.ProviderCareplanName;
            }
            if (filters.Provider != null) {
                search.where['Provider'] = filters.Provider;
            }
            if (filters.GoalId != null) {
                search.where['GoalId'] = filters.GoalId;
            }
            if (filters.Title != null) {
                search.where['Title'] = filters.Title;
            }
            if (filters.StartedAt != null) {
                search.where['StartedAt'] = filters.StartedAt;
            }
            if (filters.ScheduledEndDate != null) {
                search.where['ScheduledEndDate'] = filters.ScheduledEndDate;
            }
            let orderByColum = 'CreatedAt';
            if (filters.OrderBy) {
                orderByColum = filters.OrderBy;
            }
            let order = 'ASC';
            if (filters.Order === 'descending') {
                order = 'DESC';
            }
            search['order'] = [[orderByColum, order]];

            let limit = 25;
            if (filters.ItemsPerPage) {
                limit = filters.ItemsPerPage;
            }
            let offset = 0;
            let pageIndex = 0;
            if (filters.PageIndex) {
                pageIndex = filters.PageIndex < 0 ? 0 : filters.PageIndex;
                offset = pageIndex * limit;
            }
            search['limit'] = limit;
            search['offset'] = offset;

            const foundResults = await ActionPlan.findAndCountAll(search);

            const dtos: ActionPlanDto[] = [];
            for (const actionPlan of foundResults.rows) {
                const dto = await ActionPlanMapper.toDto(actionPlan);
                dtos.push(dto);
            }

            const searchResults: ActionPlanSearchResults = {
                TotalCount     : foundResults.count,
                RetrievedCount : dtos.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColum,
                Items          : dtos,
            };

            return searchResults;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }

    };

    update = async (id: string, updateModel: ActionPlanDomainModel): Promise<ActionPlanDto> => {
        try {
            const actionPlan = await ActionPlan.findByPk(id);

            if (updateModel.PatientUserId != null) {
                actionPlan.PatientUserId = updateModel.PatientUserId;
            }
            if (updateModel.Provider != null) {
                actionPlan.Provider = updateModel.Provider;
            }
            if (updateModel.ProviderEnrollmentId != null) {
                actionPlan.ProviderEnrollmentId = updateModel.ProviderEnrollmentId;
            }
            if (updateModel.ProviderCareplanCode != null) {
                actionPlan.ProviderCareplanCode = updateModel.ProviderCareplanCode;
            }
            if (updateModel.ProviderCareplanName != null) {
                actionPlan.ProviderCareplanName = updateModel.ProviderCareplanName;
            }
            if (updateModel.GoalId != null) {
                actionPlan.GoalId = updateModel.GoalId;
            }
            if (updateModel.Title != null) {
                actionPlan.Title = updateModel.Title;
            }
            if (updateModel.StartedAt != null) {
                actionPlan.StartedAt = updateModel.StartedAt;
            }
            if (updateModel.CompletedAt != null) {
                actionPlan.CompletedAt = updateModel.CompletedAt;
            }
            if (updateModel.Status != null) {
                actionPlan.Status = updateModel.Status;
            }
            if (updateModel.ScheduledEndDate != null) {
                actionPlan.ScheduledEndDate = updateModel.ScheduledEndDate;
            }

            await actionPlan.save();

            return await ActionPlanMapper.toDto(actionPlan);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }

    };

    delete = async (id: string): Promise<boolean> => {
        try {

            const result = await ActionPlan.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
