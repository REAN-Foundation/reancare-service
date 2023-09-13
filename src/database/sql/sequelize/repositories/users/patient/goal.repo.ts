import { IGoalRepo } from '../../../../../repository.interfaces/users/patient/goal.repo.interface';
import Goal from '../../../models/users/patient/goal.model';
import { Op } from 'sequelize';
import { GoalMapper } from '../../../mappers/users/patient/goal.mapper';
import { Logger } from '../../../../../../common/logger';
import { ApiError } from '../../../../../../common/api.error';
import { GoalDomainModel } from '../../../../../../domain.types/users/patient/goal/goal.domain.model';
import { GoalDto } from '../../../../../../domain.types/users/patient/goal/goal.dto';
import { GoalSearchFilters, GoalSearchResults } from '../../../../../../domain.types/users/patient/goal/goal.search.types';
import { GoalTypeDomainModel } from '../../../../../../domain.types/users/patient/goal.type/goal.type.domain.model';
import { GoalTypeDto } from '../../../../../../domain.types/users/patient/goal.type/goal.type.dto';
import GoalType from '../../../models/users/patient/goal.type.model';

///////////////////////////////////////////////////////////////////////

export class GoalRepo implements IGoalRepo {

    create = async (goalModel: GoalDomainModel): Promise<GoalDto> => {
        try {
            const entity = {
                PatientUserId        : goalModel.PatientUserId ?? null,
                Provider             : goalModel.Provider ?? null,
                ProviderCareplanCode : goalModel.ProviderCareplanCode ?? null,
                ProviderCareplanName : goalModel.ProviderCareplanName ?? null,
                ProviderEnrollmentId : goalModel.ProviderEnrollmentId ?? null,
                ProviderGoalCode     : goalModel.ProviderGoalCode ?? null,
                Title                : goalModel.Title ?? null,
                Sequence             : goalModel.Sequence ?? null,
                HealthPriorityId     : goalModel.HealthPriorityId ?? null,
                StartedAt            : goalModel.StartedAt ?? null,
                CompletedAt          : goalModel.CompletedAt ?? null,
                ScheduledEndDate     : goalModel.ScheduledEndDate ?? null,
                GoalAchieved         : goalModel.GoalAchieved ?? null,
                GoalAbandoned        : goalModel.GoalAbandoned ?? null,

            };

            const contact = await Goal.create(entity);
            return GoalMapper.toDto(contact);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<GoalDto> => {
        try {
            const contact = await Goal.findByPk(id);
            const dto = GoalMapper.toDto(contact);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getPatientGoals = async (patientUserId: string): Promise<GoalDto[]> => {
        try {

            Logger.instance().log(`Patient User id: ${JSON.stringify(patientUserId)}`);

            const selectedGoals = await Goal.findAll({ where: { PatientUserId: patientUserId } });

            const dtos: GoalDto[] = [];
            for (const selectedGoal of selectedGoals) {
                const dto = GoalMapper.toDto(selectedGoal);
                dtos.push(dto);
            }

            return dtos;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: GoalSearchFilters): Promise<GoalSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = { [Op.eq]: filters.PatientUserId };
            }
            if (filters.ProviderEnrollmentId != null) {
                search.where['ProviderEnrollmentId'] = { [Op.eq]: filters.ProviderEnrollmentId };
            }
            if (filters.GoalAchieved != null) {
                search.where['GoalAchieved'] = { [Op.eq]: filters.GoalAchieved };
            }
            if (filters.GoalAbandoned != null) {
                search.where['GoalAbandoned'] = { [Op.eq]: filters.GoalAbandoned };
            }
            if (filters.CreatedDateFrom != null && filters.CreatedDateTo != null) {
                search.where['CreatedAt'] = {
                    [Op.lte] : filters.CreatedDateTo,
                    [Op.gte] : filters.CreatedDateFrom,
                };
            }

            let orderByColum = 'PatientUserId';
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

            const foundResults = await Goal.findAndCountAll(search);

            const dtos: GoalDto[] = [];
            for (const contact of foundResults.rows) {
                const dto = GoalMapper.toDto(contact);
                dtos.push(dto);
            }

            const searchResults: GoalSearchResults = {
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

    update = async (id: string, goalModel: GoalDomainModel): Promise<GoalDto> => {
        try {
            const goal = await Goal.findByPk(id);

            if (goalModel.PatientUserId != null) {
                goal.PatientUserId = goalModel.PatientUserId;
            }
            if (goalModel.Provider != null) {
                goal.Provider = goalModel.Provider;
            }
            if (goalModel.ProviderCareplanCode != null) {
                goal.ProviderCareplanCode = goalModel.ProviderCareplanCode;
            }
            if (goalModel.ProviderCareplanName != null) {
                goal.ProviderCareplanName = goalModel.ProviderCareplanName;
            }
            if (goalModel.ProviderEnrollmentId != null) {
                goal.ProviderEnrollmentId = goalModel.ProviderEnrollmentId;
            }
            if (goalModel.ProviderGoalCode != null) {
                goal.ProviderGoalCode = goalModel.ProviderGoalCode;
            }
            if (goalModel.Title != null) {
                goal.Title = goalModel.Title;
            }
            if (goalModel.HealthPriorityId != null) {
                goal.HealthPriorityId = goalModel.HealthPriorityId;
            }
            if (goalModel.StartedAt != null) {
                goal.StartedAt = goalModel.StartedAt;
            }
            if (goalModel.CompletedAt != null) {
                goal.CompletedAt = goalModel.CompletedAt;
            }
            if (goalModel.ScheduledEndDate != null) {
                goal.ScheduledEndDate = goalModel.ScheduledEndDate;
            }
            if (goalModel.GoalAchieved != null) {
                goal.GoalAchieved = goalModel.GoalAchieved;
            }
            if (goalModel.GoalAbandoned != null) {
                goal.GoalAbandoned = goalModel.GoalAbandoned;
            }
            await goal.save();

            const dto = GoalMapper.toDto(goal);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            await Goal.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    createGoalType = async (model: GoalTypeDomainModel): Promise<GoalTypeDto> => {
        try {
            const entity = {
                Type : model.Type,
                Tags : model.Tags && model.Tags.length > 0 ? JSON.stringify(model.Tags) : null,
            };
            const goal = await GoalType.create(entity);
            return GoalMapper.toTypeDto(goal);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getGoalTypeById = async (id: string): Promise<GoalTypeDto> => {
        try {
            const goalType = await GoalType.findByPk(id);
            return GoalMapper.toTypeDto(goalType);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getGoalTypes = async (tags?: string): Promise<GoalTypeDto[]> => {
        try {
            const filter = { where: {} };
            if (tags != null) {
                filter.where['Tags'] = { [Op.like]: '%' + tags + '%' };
            }

            const goalTypes = await GoalType.findAll(filter);
            const dtos: GoalTypeDto[] = [];
            for (const goalType of goalTypes) {
                const dto = GoalMapper.toTypeDto(goalType);
                dtos.push(dto);
            }

            return dtos;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    updateGoalType = async (id: string, updateModel: GoalTypeDomainModel): Promise<GoalTypeDto> => {
        try {
            const goalType = await GoalType.findByPk(id);

            if (updateModel.Type != null) {
                goalType.Type = updateModel.Type;
            }
            if (updateModel.Tags != null) {
                var tags = JSON.stringify(updateModel.Tags);
                goalType.Tags = tags;
            }
            
            await goalType.save();

            return await GoalMapper.toTypeDto(goalType);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    deleteGoalType = async (id: string): Promise<boolean> => {
        try {

            const result = await GoalType.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
