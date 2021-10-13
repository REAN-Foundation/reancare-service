import { Op } from 'sequelize';
import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import { BodyTemperatureDomainModel } from "../../../../../domain.types/clinical/biometrics/body.temperature/body.temperature.domain.model";
import { BodyTemperatureDto } from "../../../../../domain.types/clinical/biometrics/body.temperature/body.temperature.dto";
import { BodyTemperatureSearchFilters, BodyTemperatureSearchResults } from "../../../../../domain.types/clinical/biometrics/body.temperature/body.temperature.search.types";
import { IBodyTemperatureRepo } from '../../../../repository.interfaces/clinical/biometrics/body.temperature.repo.interface';
import { BodyTemperatureMapper } from '../../mappers/clinical/biometrics/body.temperature.mapper';
import BodyTemperatureModel from '../../models/clinical/biometrics/body.temperature.model';

///////////////////////////////////////////////////////////////////////

export class BodyTemperatureRepo implements IBodyTemperatureRepo {

    create = async (bodyTemperatureDomainModel: BodyTemperatureDomainModel):
    Promise<BodyTemperatureDto> => {
        try {
            const entity = {
                PatientUserId    : bodyTemperatureDomainModel.PatientUserId,
                BodyTemperature  : bodyTemperatureDomainModel.BodyTemperature,
                Unit             : bodyTemperatureDomainModel.Unit,
                RecordDate       : bodyTemperatureDomainModel.RecordDate,
                RecordedByUserId : bodyTemperatureDomainModel.RecordedByUserId
            };

            const bodyTemperature = await BodyTemperatureModel.create(entity);
            const dto = await BodyTemperatureMapper.toDto(bodyTemperature);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<BodyTemperatureDto> => {
        try {
            const bodyTemperature = await BodyTemperatureModel.findByPk(id);
            const dto = await BodyTemperatureMapper.toDto(bodyTemperature);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: BodyTemperatureSearchFilters): Promise<BodyTemperatureSearchResults> => {
        try {

            Logger.instance().log(`Filters 2 , ${JSON.stringify(filters)}`);
            
            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.MinValue != null && filters.MaxValue != null) {
                search.where['BodyTemperature'] = {
                    [Op.gte] : filters.MinValue,
                    [Op.lte] : filters.MaxValue,
                };
            } else if (filters.MinValue === null && filters.MaxValue !== null) {
                search.where['BodyTemperature'] = {
                    [Op.lte] : filters.MaxValue,
                };
            } else if (filters.MinValue !== null && filters.MaxValue === null) {
                search.where['BodyTemperature'] = {
                    [Op.gte] : filters.MinValue,
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
            if (filters.RecordedByUserId !== null) {
                search.where['RecordedByUserId'] = filters.RecordedByUserId;
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

            const foundResults = await BodyTemperatureModel.findAndCountAll(search);

            const dtos: BodyTemperatureDto[] = [];
            for (const bodyTemperature of foundResults.rows) {
                const dto = await BodyTemperatureMapper.toDto(bodyTemperature);
                dtos.push(dto);
            }

            const searchResults: BodyTemperatureSearchResults = {
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

    update = async (id: string, bodyTemperatureDomainModel: BodyTemperatureDomainModel):
    Promise<BodyTemperatureDto> => {
        try {
            const bodyTemperature = await BodyTemperatureModel.findByPk(id);

            if (bodyTemperatureDomainModel.PatientUserId != null) {
                bodyTemperature.PatientUserId = bodyTemperatureDomainModel.PatientUserId;
            }
            if (bodyTemperatureDomainModel.BodyTemperature != null) {
                bodyTemperature.BodyTemperature = bodyTemperatureDomainModel.BodyTemperature;
            }
            if (bodyTemperatureDomainModel.Unit != null) {
                bodyTemperature.Unit = bodyTemperatureDomainModel.Unit;
            }
            if (bodyTemperatureDomainModel.RecordDate != null) {
                bodyTemperature.RecordDate = bodyTemperatureDomainModel.RecordDate;
            }
            if (bodyTemperatureDomainModel.RecordedByUserId != null) {
                bodyTemperature.RecordedByUserId = bodyTemperatureDomainModel.RecordedByUserId;
            }
    
            await bodyTemperature.save();

            const dto = await BodyTemperatureMapper.toDto(bodyTemperature);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            Logger.instance().log(id);

            const result = await BodyTemperatureModel.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
