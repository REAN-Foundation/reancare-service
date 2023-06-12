import { IHealthSystemRepo } from
    '../../../../../../database/repository.interfaces/users/patient/health.system.repo.interface';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { HealthSystemDomainModel } from
    '../../../../../../domain.types/users/patient/health.system/health.system.domain.model';
import { HealthSystemDto } from '../../../../../../domain.types/users/patient/health.system/health.system.dto';
import { HealthSystemMapper } from '../../../mappers/users/patient/health.system.mapper';
import HealthSystem from '../../../models/users/patient/health.system.model';
import { HealthSystemHospitalDomainModel } from
    '../../../../../../domain.types/users/patient/health.system/health.system.hospital.domain.model';
import { HealthSystemHospitalDto } from
    '../../../../../../domain.types/users/patient/health.system/health.system.hospital.dto';
import HealthSystemHospital from '../../../models/users/patient/health.system.hospital.model';
import { uuid } from '../../../../../../domain.types/miscellaneous/system.types';
import { HealthSystemSearchFilters, HealthSystemSearchResults }
    from '../../../../../../domain.types/users/patient/health.system/health.system.search.types';

///////////////////////////////////////////////////////////////////////

export class HealthSystemRepo implements IHealthSystemRepo {

    createHealthSystem = async (createModel: HealthSystemDomainModel):
    Promise<HealthSystemDto> => {
        try {
            const entity = {
                Name : createModel.Name,
                Tags : createModel.Tags && createModel.Tags.length > 0 ? JSON.stringify(createModel.Tags) : null,
            };

            const nutrition = await HealthSystem.create(entity);
            return await HealthSystemMapper.toDto(nutrition);
            
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    createHealthSystemHospital = async (createModel: HealthSystemHospitalDomainModel):
    Promise<HealthSystemHospitalDto> => {
        try {
            const entity = {
                HealthSystemId : createModel.HealthSystemId,
                Name           : createModel.Name,
                Tags           : createModel.Tags && createModel.Tags.length > 0 ? JSON.stringify(createModel.Tags) : null,

            };

            const healthSystemHospital = await HealthSystemHospital.create(entity);
            return await HealthSystemMapper.toDetailsDto(healthSystemHospital);
            
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    totalCount = async (): Promise<number> => {
        try {
            return await HealthSystem.count();
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getHealthSystems = async (planName?: string): Promise<HealthSystemDto[]> => {
        try {
            const filter = { where: {
                Tags : JSON.stringify(planName.split(','))

            } };
            
            const healthSystems = await HealthSystem.findAll(filter);
            const dtos: HealthSystemDto[] = [];
            for (const hs of healthSystems) {
                const dto = HealthSystemMapper.toDto(hs);
                dtos.push(dto);
            }

            return dtos;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getHealthSystemHospitals = async (healthSystemId: uuid): Promise<HealthSystemHospitalDto[]> => {
        try {
            const filter = { where : {
                HealthSystemId : healthSystemId
            } };
            
            const healthSystemHospitals = await HealthSystemHospital.findAll(filter);
            const dtos: HealthSystemHospitalDto[] = [];
            for (const hospital of healthSystemHospitals) {
                const dto = HealthSystemMapper.toDetailsDto(hospital);
                dtos.push(dto);
            }

            return dtos;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    searchType = async (filters: HealthSystemSearchFilters): Promise<HealthSystemSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.Name != null) {
                search.where['Name'] = filters.Name;
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

            const foundResults = await HealthSystem.findAndCountAll(search);
            const dtos: HealthSystemDto[] = [];
            for (const h of foundResults.rows) {
                const dto = await HealthSystemMapper.toDto(h);
                dtos.push(dto);
            }

            const searchResults: HealthSystemSearchResults = {
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

}
