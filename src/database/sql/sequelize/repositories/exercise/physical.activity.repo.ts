import { IPhysicalActivityRepo } from '../../../../repository.interfaces/exercise/physical.activity.repo.interface';
import PhysicalActivity from '../../models/exercise/physical.activity.model';
import { Op } from 'sequelize';
import { PhysicalActivityMapper } from '../../mappers/exercise/physical.activity.mapper';
import { Logger } from '../../../../../common/logger';
import { ApiError } from '../../../../../common/api.error';
import { PhysicalActivityDomainModel } from '../../../../../domain.types/exercise/physical.activity/physical.activity.domain.model';
import { PhysicalActivityDto } from '../../../../../domain.types/exercise/physical.activity/physical.activity.dto';
import { PhysicalActivitySearchResults, PhysicalActivitySearchFilters } from '../../../../../domain.types/exercise/physical.activity/physical.activity.search.types';

///////////////////////////////////////////////////////////////////////

export class PhysicalActivityRepo implements IPhysicalActivityRepo {

    create = async (physicalActivityDomainModel: PhysicalActivityDomainModel): Promise<PhysicalActivityDto> => {
        try {
            const entity = {
                id             : physicalActivityDomainModel.id,
                PatientUserId  : physicalActivityDomainModel.PatientUserId,
                Exercise       : physicalActivityDomainModel.Exercise ?? null,
                Description    : physicalActivityDomainModel.Description ?? null,
                Category       : physicalActivityDomainModel.Category,
                Intensity      : physicalActivityDomainModel.Intensity ?? null,
                CaloriesBurned : physicalActivityDomainModel.CaloriesBurned ?? null,
                StartTime      : physicalActivityDomainModel.StartTime ?? null,
                EndTime        : physicalActivityDomainModel.EndTime ?? null,
                DurationInMin  : physicalActivityDomainModel.DurationInMin ?? null,
            };
            const physicalActivity = await PhysicalActivity.create(entity);
            const dto = await PhysicalActivityMapper.toDto(physicalActivity);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<PhysicalActivityDto> => {
        try {
            const physicalActivity = await PhysicalActivity.findByPk(id);
            const dto = await PhysicalActivityMapper.toDto(physicalActivity);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: PhysicalActivitySearchFilters): Promise<PhysicalActivitySearchResults> => {
        try {
            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = { [Op.eq]: filters.PatientUserId };
            }
            if (filters.Exercise != null) {
                search.where['Exercise'] = { [Op.eq]: filters.Exercise };
            }
            if (filters.Category != null) {
                search.where['Category'] = { [Op.eq]: filters.Category };
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
                length         : undefined
            };
            return searchResults;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    // eslint-disable-next-line max-len
    update = async (id: string, physicalActivityDomainModel: PhysicalActivityDomainModel): Promise<PhysicalActivityDto> => {
        try {
            const physicalActivity = await PhysicalActivity.findByPk(id);

            if (physicalActivityDomainModel.PatientUserId != null) {
                physicalActivity.PatientUserId = physicalActivityDomainModel.PatientUserId;
            }
            if (physicalActivityDomainModel.Exercise != null) {
                physicalActivity.Exercise = physicalActivityDomainModel.Exercise;
            }
            if (physicalActivityDomainModel.Description != null) {
                physicalActivity.Description = physicalActivityDomainModel.Description;
            }
            if (physicalActivityDomainModel.Category != null) {
                physicalActivity.Category = physicalActivityDomainModel.Category;
            }
            if (physicalActivityDomainModel.Intensity != null) {
                physicalActivity.Intensity = physicalActivityDomainModel.Intensity;
            }
            if (physicalActivityDomainModel.CaloriesBurned != null) {
                physicalActivity.CaloriesBurned = physicalActivityDomainModel.CaloriesBurned;
            }
            if (physicalActivityDomainModel.StartTime != null) {
                physicalActivity.StartTime = physicalActivityDomainModel.StartTime;
            }
            if (physicalActivityDomainModel.EndTime != null) {
                physicalActivity.EndTime = physicalActivityDomainModel.EndTime;
            }
            if (physicalActivityDomainModel.DurationInMin != null) {
                physicalActivity.DurationInMin = physicalActivityDomainModel.DurationInMin;
            }
            await physicalActivity.save();

            const dto = await PhysicalActivityMapper.toDto(physicalActivity);
            return dto;
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
    }

}
