import { Op } from 'sequelize';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { BodyTemperatureDomainModel } from "../../../../../../domain.types/clinical/biometrics/body.temperature/body.temperature.domain.model";
import { BodyTemperatureDto } from "../../../../../../domain.types/clinical/biometrics/body.temperature/body.temperature.dto";
import { BodyTemperatureSearchFilters, BodyTemperatureSearchResults } from "../../../../../../domain.types/clinical/biometrics/body.temperature/body.temperature.search.types";
import { IBodyTemperatureRepo } from '../../../../../repository.interfaces/clinical/biometrics/body.temperature.repo.interface';
import { BodyTemperatureMapper } from '../../../mappers/clinical/biometrics/body.temperature.mapper';
import BodyTemperatureModel from '../../../models/clinical/biometrics/body.temperature.model';

///////////////////////////////////////////////////////////////////////

export class BodyTemperatureRepo implements IBodyTemperatureRepo {

    create = async (createModel: BodyTemperatureDomainModel):
    Promise<BodyTemperatureDto> => {
        try {
            const entity = {
                PatientUserId    : createModel.PatientUserId,
                EhrId            : createModel.EhrId,
                BodyTemperature  : createModel.BodyTemperature,
                Unit             : createModel.Unit,
                RecordDate       : createModel.RecordDate,
                RecordedByUserId : createModel.RecordedByUserId
            };

            const bodyTemperature = await BodyTemperatureModel.create(entity);
            return await BodyTemperatureMapper.toDto(bodyTemperature);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<BodyTemperatureDto> => {
        try {
            const bodyTemperature = await BodyTemperatureModel.findByPk(id);
            return await BodyTemperatureMapper.toDto(bodyTemperature);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: BodyTemperatureSearchFilters): Promise<BodyTemperatureSearchResults> => {
        try {
            
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
            for (const foodConsumption of foundResults.rows) {
                const dto = await BodyTemperatureMapper.toDto(foodConsumption);
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

    update = async (id: string, updateModel: BodyTemperatureDomainModel):
    Promise<BodyTemperatureDto> => {
        try {
            const bodyTemperature = await BodyTemperatureModel.findByPk(id);

            if (updateModel.PatientUserId != null) {
                bodyTemperature.PatientUserId = updateModel.PatientUserId;
            }
            if (updateModel.BodyTemperature != null) {
                bodyTemperature.BodyTemperature = updateModel.BodyTemperature;
            }
            if (updateModel.Unit != null) {
                bodyTemperature.Unit = updateModel.Unit;
            }
            if (updateModel.RecordDate != null) {
                bodyTemperature.RecordDate = updateModel.RecordDate;
            }
            if (updateModel.RecordedByUserId != null) {
                bodyTemperature.RecordedByUserId = updateModel.RecordedByUserId;
            }
    
            await bodyTemperature.save();

            return await BodyTemperatureMapper.toDto(bodyTemperature);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {

            const result = await BodyTemperatureModel.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
