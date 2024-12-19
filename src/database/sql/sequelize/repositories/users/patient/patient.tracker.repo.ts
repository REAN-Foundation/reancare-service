import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { ActivityTrackerDomainModel } from '../../../../../../domain.types/users/patient/activity.tracker/activity.tracker.domain.model';
import { ActivityTrackerDto } from '../../../../../../domain.types/users/patient/activity.tracker/activity.tracker.dto';
import PatientActivityTracker from '../../../models/users/patient/activity.tracking.model';
import { ActivityTrackerMapper } from '../../../mappers/users/patient/activity.tracker.mapper';
import { IActivityTrackerRepo } from '../../../../../../database/repository.interfaces/users/patient/activity.tracker.repo.interface';
import { ActivityTrackerSearchFilters } from '../../../../../../domain.types/users/patient/activity.tracker/activity.tracker.search.types';
import { ActivityTrackerSearchResults } from '../../../../../../domain.types/users/patient/activity.tracker/activity.tracker.search.types';
import { Op } from 'sequelize';

///////////////////////////////////////////////////////////////////////

export class ActivityTrackerRepo implements IActivityTrackerRepo {

    create = async (createModel: ActivityTrackerDomainModel):
    Promise<ActivityTrackerDto> => {
        try {
            const entity = {
                PatientUserId       : createModel.PatientUserId,
                LastLoginDate       : createModel.LastLoginDate ?? null,
                LastVitalUpdateDate : createModel.LastVitalUpdateDate ?? null,
                UpdatedVitalDetails : createModel.UpdatedVitalDetails ?? null,
                LastUserTaskDate    : createModel.LastUserTaskDate ?? null,
                UserTaskDetails     : createModel.UserTaskDetails ?? null,
                LastActivityDate    : createModel.LastActivityDate ?? null,
            };
            const activityTracker = await PatientActivityTracker.create(entity);
            return ActivityTrackerMapper.toDto(activityTracker);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<ActivityTrackerDto> => {
        try {
            const activityTracker = await PatientActivityTracker.findByPk(id);
            return await ActivityTrackerMapper.toDto(activityTracker);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: ActivityTrackerSearchFilters): Promise<ActivityTrackerSearchResults> => {
        try {

            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }

            if (filters.LastActivityDateFrom != null && filters.LastActivityDateTo != null) {
                search.where['LastActivityDate'] = {
                    [Op.gte] : filters.LastActivityDateFrom,
                    [Op.lte] : filters.LastActivityDateTo,
                };
            } else if (filters.LastActivityDateFrom === null && filters.LastActivityDateTo !== null) {
                search.where['LastActivityDate'] = {
                    [Op.lte] : filters.LastActivityDateTo,
                };
            } else if (filters.LastActivityDateFrom !== null && filters.LastActivityDateTo === null) {
                search.where['LastActivityDate'] = {
                    [Op.gte] : filters.LastActivityDateFrom,
                };
            }

            if (filters.CreatedDateFrom != null && filters.CreatedDateTo != null) {
                search.where['CreatedAt'] = {
                    [Op.gte] : filters.CreatedDateFrom,
                    [Op.lte] : filters.CreatedDateTo,
                };
            } else if (filters.CreatedDateFrom === null && filters.CreatedDateTo !== null) {
                search.where['CreatedAt'] = {
                    [Op.lte] : filters.CreatedDateTo,
                };
            } else if (filters.CreatedDateFrom !== null && filters.CreatedDateTo === null) {
                search.where['CreatedAt'] = {
                    [Op.gte] : filters.CreatedDateFrom,
                };
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

            const foundResults = await PatientActivityTracker.findAndCountAll(search);

            const dtos: ActivityTrackerDto[] = [];
            for (const activityTracker of foundResults.rows) {
                const dto = await ActivityTrackerMapper.toDto(activityTracker);
                dtos.push(dto);
            }

            const searchResults: ActivityTrackerSearchResults = {
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

    update = async (id: string, updateModel: ActivityTrackerDomainModel):
    Promise<ActivityTrackerDto> => {
        try {
            const activityTracker = await PatientActivityTracker.findByPk(id);

            if (updateModel.LastLoginDate != null) {
                activityTracker.LastLoginDate = updateModel.LastLoginDate;
            }
            if (updateModel.LastVitalUpdateDate != null) {
                activityTracker.LastVitalUpdateDate = updateModel.LastVitalUpdateDate;
            }
            if (updateModel.UpdatedVitalDetails != null) {
                activityTracker.UpdatedVitalDetails = updateModel.UpdatedVitalDetails;
            }
            if (updateModel.LastUserTaskDate != null) {
                activityTracker.LastUserTaskDate = updateModel.LastUserTaskDate;
            }
            if (updateModel.UserTaskDetails != null) {
                activityTracker.UserTaskDetails = updateModel.UserTaskDetails;
            }
            if (updateModel.LastActivityDate != null) {
                activityTracker.LastActivityDate = updateModel.LastActivityDate;
            }

            await activityTracker.save();

            return ActivityTrackerMapper.toDto(activityTracker);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {

            const result = await PatientActivityTracker.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
