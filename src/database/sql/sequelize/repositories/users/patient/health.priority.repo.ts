import { HealthPriorityDomainModel } from '../../../../../../domain.types/users/patient/health.priority/health.priority.domain.model';
import { HealthPriorityDto } from '../../../../../../domain.types/users/patient/health.priority/health.priority.dto';
import { IHealthPriorityRepo } from '../../../../../repository.interfaces/users/patient/health.priority.repo.interface';
import HealthPriority from '../../../models/users/patient/health.priority.model';
import { HealthPriorityMapper } from '../../../mappers/users/patient/health.priority.mapper';
import { Logger } from '../../../../../../common/logger';
import { ApiError } from '../../../../../../common/api.error';
import { HealthPriorityTypeDomainModel } from '../../../../../../domain.types/users/patient/health.priority.type/health.priority.type.domain.model';
import { HealthPriorityTypeDto } from '../../../../../../domain.types/users/patient/health.priority.type/health.priority.type.dto';
import HealthPriorityType    from '../../../models/users/patient/health.priority.type.model';
import { HealthPrioritySearchFilters, HealthPrioritySearchResults } from '../../../../../../domain.types/users/patient/health.priority/health.priority.search.types';
import { Op } from 'sequelize';

///////////////////////////////////////////////////////////////////////

export class HealthPriorityRepo implements IHealthPriorityRepo {

    create = async (createModel: HealthPriorityDomainModel): Promise<HealthPriorityDto> => {
        try {
            const entity = {
                PatientUserId        : createModel.PatientUserId,
                Source               : createModel.Source,
                Provider             : createModel.Provider,
                ProviderEnrollmentId : createModel.ProviderEnrollmentId,
                ProviderCareplanCode : createModel.ProviderCareplanCode,
                ProviderCareplanName : createModel.ProviderCareplanName,
                HealthPriorityType   : createModel.HealthPriorityType,
                StartedAt            : createModel.StartedAt,
                CompletedAt          : createModel.CompletedAt,
                Status               : createModel.Status,
                IsPrimary            : createModel.IsPrimary,
            };

            const healthPriority = await HealthPriority.create(entity);
            return HealthPriorityMapper.toDto(healthPriority);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getPatientHealthPriorities = async (patientUserId: string): Promise<HealthPriorityDto[]> => {
        try {
            const priorities = await HealthPriority.findAll({
                where : { PatientUserId: patientUserId },
            });

            const dtos: HealthPriorityDto[] = [];
            for (const priority of priorities) {
                const dto = HealthPriorityMapper.toDto(priority);
                dtos.push(dto);
            }

            return dtos;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getPriorityTypes = async (tags?: string): Promise<HealthPriorityTypeDto[]> => {
        try {
            const filter = { where: {} };
            if (tags != null) {
                filter.where['Tags'] = { [Op.like]: '%' + tags + '%' };
            }

            const priorityTypes = await HealthPriorityType.findAll(filter);
            const dtos: HealthPriorityTypeDto[] = [];
            for (const priorityType of priorityTypes) {
                const dto = HealthPriorityMapper.toTypeDto(priorityType);
                dtos.push(dto);
            }

            return dtos;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<HealthPriorityDto> => {
        try {
            const priority = await HealthPriority.findByPk(id);
            return HealthPriorityMapper.toDto(priority);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    createType = async (model: HealthPriorityTypeDomainModel): Promise<HealthPriorityTypeDto> => {
        try {
            const entity = {
                Type : model.Type,
                Tags : model.Tags && model.Tags.length > 0 ? JSON.stringify(model.Tags) : null,
            };
            const priority = await HealthPriorityType.create(entity);
            return HealthPriorityMapper.toTypeDto(priority);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: HealthPrioritySearchFilters): Promise<HealthPrioritySearchResults> => {
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
            if (filters.HealthPriorityType != null) {
                search.where['HealthPriorityType'] = filters.HealthPriorityType;
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

            const foundResults = await HealthPriority.findAndCountAll(search);
            const dtos: HealthPriorityDto[] = [];
            for (const healthPriority of foundResults.rows) {
                const dto = await HealthPriorityMapper.toDto(healthPriority);
                dtos.push(dto);
            }

            const searchResults: HealthPrioritySearchResults = {
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

    update = async (id: string, updateModel: HealthPriorityDomainModel): Promise<HealthPriorityDto> => {
        try {
            const healthPriority = await HealthPriority.findByPk(id);

            if (updateModel.PatientUserId != null) {
                healthPriority.PatientUserId = updateModel.PatientUserId;
            }
            if (updateModel.Source != null) {
                healthPriority.Source = updateModel.Source;
            }
            if (updateModel.Provider != null) {
                healthPriority.Provider = updateModel.Provider;
            }
            if (updateModel.ProviderEnrollmentId != null) {
                healthPriority.ProviderEnrollmentId = updateModel.ProviderEnrollmentId;
            }
            if (updateModel.ProviderCareplanCode != null) {
                healthPriority.ProviderCareplanCode = updateModel.ProviderCareplanCode;
            }
            if (updateModel.ProviderCareplanName != null) {
                healthPriority.ProviderCareplanName = updateModel.ProviderCareplanName;
            }
            if (updateModel.HealthPriorityType != null) {
                healthPriority.HealthPriorityType = updateModel.HealthPriorityType;
            }
            if (updateModel.IsPrimary != null) {
                healthPriority.IsPrimary = updateModel.IsPrimary;
            }
            if (updateModel.StartedAt != null) {
                healthPriority.StartedAt = updateModel.StartedAt;
            }
            if (updateModel.CompletedAt != null) {
                healthPriority.CompletedAt = updateModel.CompletedAt;
            }
            if (updateModel.Status != null) {
                healthPriority.Status = updateModel.Status;
            }

            await healthPriority.save();

            return await HealthPriorityMapper.toDto(healthPriority);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {

            const result = await HealthPriority.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    totalTypesCount = async (): Promise<number> => {
        try {
            return await HealthPriorityType.count();
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getPriorityTypeById = async (id: string): Promise<HealthPriorityTypeDto> => {
        try {
            const priorityType = await HealthPriorityType.findByPk(id);
            return HealthPriorityMapper.toTypeDto(priorityType);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    updatePriorityType = async (id: string, updateModel: HealthPriorityTypeDomainModel): Promise<HealthPriorityTypeDto> => {
        try {
            const healthPriorityType = await HealthPriorityType.findByPk(id);

            if (updateModel.Type != null) {
                healthPriorityType.Type = updateModel.Type;
            }
            if (updateModel.Tags != null) {
                var tags = JSON.stringify(updateModel.Tags);
                healthPriorityType.Tags = tags;
            }
            
            await healthPriorityType.save();

            return await HealthPriorityMapper.toTypeDto(healthPriorityType);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    deletePriorityType = async (id: string): Promise<boolean> => {
        try {

            const result = await HealthPriorityType.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
