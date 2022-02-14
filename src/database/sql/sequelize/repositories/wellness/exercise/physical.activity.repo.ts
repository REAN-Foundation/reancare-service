import { Op } from 'sequelize';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { PhysicalActivityDomainModel } from '../../../../../../domain.types/wellness/exercise/physical.activity/physical.activity.domain.model';
import { PhysicalActivityDto } from '../../../../../../domain.types/wellness/exercise/physical.activity/physical.activity.dto';
import { PhysicalActivitySearchFilters, PhysicalActivitySearchResults } from '../../../../../../domain.types/wellness/exercise/physical.activity/physical.activity.search.types';
import { IPhysicalActivityRepo } from '../../../../../repository.interfaces/wellness/exercise/physical.activity.repo.interface';
import { PhysicalActivityMapper } from '../../../mappers/wellness/exercise/physical.activity.mapper';
import PhysicalActivity from '../../../models/wellness/exercise/physical.activity.model';

///////////////////////////////////////////////////////////////////////

export class PhysicalActivityRepo implements IPhysicalActivityRepo {

    create = async (createModel: PhysicalActivityDomainModel): Promise<PhysicalActivityDto> => {
        try {
            const entity = {
                id             : createModel.id,
                PatientUserId  : createModel.PatientUserId,
                Exercise       : createModel.Exercise ?? null,
                Description    : createModel.Description ?? null,
                Category       : createModel.Category,
                Intensity      : createModel.Intensity ?? null,
                CaloriesBurned : createModel.CaloriesBurned ?? null,
                StartTime      : createModel.StartTime ?? null,
                EndTime        : createModel.EndTime ?? null,
                DurationInMin  : createModel.DurationInMin ?? null,
            };
            const physicalActivity = await PhysicalActivity.create(entity);
            return await PhysicalActivityMapper.toDto(physicalActivity);
            
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<PhysicalActivityDto> => {
        try {
            const physicalActivity = await PhysicalActivity.findByPk(id);
            return await PhysicalActivityMapper.toDto(physicalActivity);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: PhysicalActivitySearchFilters): Promise<PhysicalActivitySearchResults> => {
        try {
            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.Exercise != null) {
                search.where['Exercise'] = { [Op.like]: '%' + filters.Exercise + '%' };
            }
            if (filters.Category != null) {
                search.where['Category'] = { [Op.like]: '%' + filters.Category + '%' };
            }
            
            let orderByColum = 'PhysicalActivity';
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

            const foundResults = await PhysicalActivity.findAndCountAll(search);

            const dtos: PhysicalActivityDto[] = [];
            for (const physicalActivity of foundResults.rows) {
                const dto = await PhysicalActivityMapper.toDto(physicalActivity);
                dtos.push(dto);
            }

            const searchResults: PhysicalActivitySearchResults = {
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

    // eslint-disable-next-line max-len
    update = async (id: string, updateModel: PhysicalActivityDomainModel): Promise<PhysicalActivityDto> => {
        try {
            const physicalActivity = await PhysicalActivity.findOne({ where: { id: id } });

            if (updateModel.PatientUserId != null) {
                physicalActivity.PatientUserId = updateModel.PatientUserId;
            }
            if (updateModel.Exercise != null) {
                physicalActivity.Exercise = updateModel.Exercise;
            }
            if (updateModel.Description != null) {
                physicalActivity.Description = updateModel.Description;
            }
            if (updateModel.Category != null) {
                physicalActivity.Category = updateModel.Category;
            }
            if (updateModel.Intensity != null) {
                physicalActivity.Intensity = updateModel.Intensity;
            }
            if (updateModel.CaloriesBurned != null) {
                physicalActivity.CaloriesBurned = updateModel.CaloriesBurned;
            }
            if (updateModel.StartTime != null) {
                physicalActivity.StartTime = updateModel.StartTime;
            }
            if (updateModel.EndTime != null) {
                physicalActivity.EndTime = updateModel.EndTime;
            }
            if (updateModel.DurationInMin != null) {
                physicalActivity.DurationInMin = updateModel.DurationInMin;
            }
            await physicalActivity.save();

            return await PhysicalActivityMapper.toDto(physicalActivity);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            await PhysicalActivity.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
