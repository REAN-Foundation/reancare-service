import { IGoalRepo } from '../../../../repository.interfaces/patient/goal.repo.interface';
import Goal from '../../models/patient/goal.model';
import { Op } from 'sequelize';
import { GoalMapper } from '../../mappers/patient/goal.mapper';
import { Logger } from '../../../../../common/logger';
import { ApiError } from '../../../../../common/api.error';
import { GoalDomainModel } from '../../../../../domain.types/patient/goal/goal.domain.model';
import { GoalDto } from '../../../../../domain.types/patient/goal/goal.dto';
import { GoalSearchFilters, GoalSearchResults } from '../../../../../domain.types/patient/goal/goal.search.types';

///////////////////////////////////////////////////////////////////////

export class GoalRepo implements IGoalRepo {

    create = async (goalModel: GoalDomainModel): Promise<GoalDto> => {
        try {
            const entity = {
                PatientUserId : goalModel.PatientUserId ?? null,
                CarePlanId    : goalModel.CarePlanId ?? null,
                TypeCode      : goalModel.TypeCode ?? null,
                TypeName      : goalModel.TypeName ?? null,
                GoalId        : goalModel.GoalId ?? null,
                GoalAchieved  : goalModel.GoalAchieved ?? null,
                GoalAbandoned : goalModel.GoalAbandoned ?? null
            };
            const contact = await Goal.create(entity);
            const dto = await GoalMapper.toDto(contact);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<GoalDto> => {
        try {
            const contact = await Goal.findByPk(id);
            const dto = await GoalMapper.toDto(contact);
            return dto;
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
            if (filters.CarePlanId != null) {
                search.where['CarePlanId'] = { [Op.eq]: filters.CarePlanId };
            }
            if (filters.TypeCode != null) {
                search.where['TypeCode'] = { [Op.eq]: filters.TypeCode };
            }
            if (filters.TypeName != null) {
                search.where['TypeName'] = { [Op.eq]: filters.TypeName };
            }
            if (filters.GoalId != null) {
                search.where['GoalId'] = { [Op.eq]: filters.GoalId };
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
                const dto = await GoalMapper.toDto(contact);
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
            if (goalModel.CarePlanId != null) {
                goal.CarePlanId = goalModel.CarePlanId;
            }
            if (goalModel.TypeCode != null) {
                goal.TypeCode = goalModel.TypeCode;
            }
            if (goalModel.TypeName != null) {
                goal.TypeName = goalModel.TypeName;
            }
            if (goalModel.GoalId != null) {
                goal.GoalId = goalModel.GoalId;
            }
            if (goalModel.GoalAchieved != null) {
                goal.GoalAchieved = goalModel.GoalAchieved;
            }
            if (goalModel.GoalAbandoned != null) {
                goal.GoalAbandoned = goalModel.GoalAbandoned;
            }
            await goal.save();

            const dto = await GoalMapper.toDto(goal);
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

}
