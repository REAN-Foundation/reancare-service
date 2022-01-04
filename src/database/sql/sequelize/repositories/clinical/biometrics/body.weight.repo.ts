import { Op } from 'sequelize';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { BodyWeightDomainModel } from '../../../../../../domain.types/clinical/biometrics/body.weight/body.weight.domain.model';
import { BodyWeightDto } from '../../../../../../domain.types/clinical/biometrics/body.weight/body.weight.dto';
import { BodyWeightSearchFilters, BodyWeightSearchResults } from '../../../../../../domain.types/clinical/biometrics/body.weight/body.weight.search.types';
import { IBodyWeightRepo } from '../../../../../repository.interfaces/clinical/biometrics/body.weight.repo.interface';
import { BodyWeightMapper } from '../../../mappers/clinical/biometrics/body.weight.mapper';
import BodyWeight from '../../../models/clinical/biometrics/body.weight.model';

///////////////////////////////////////////////////////////////////////

export class BodyWeightRepo implements IBodyWeightRepo {

    create = async (createModel: BodyWeightDomainModel): Promise<BodyWeightDto> => {
        try {
            const entity = {
                PatientUserId    : createModel.PatientUserId,
                BodyWeight       : createModel.BodyWeight,
                Unit             : createModel.Unit,
                RecordDate       : createModel.RecordDate ?? new Date(),
                RecordedByUserId : createModel.RecordedByUserId ?? null,
            };

            const bodyWeight = await BodyWeight.create(entity);
            return await BodyWeightMapper.toDto(bodyWeight);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<BodyWeightDto> => {
        try {
            const bodyWeight = await BodyWeight.findByPk(id);
            return await BodyWeightMapper.toDto(bodyWeight);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: BodyWeightSearchFilters): Promise<BodyWeightSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.MinValue != null && filters.MaxValue != null) {
                search.where['BodyWeight'] = {
                    [Op.gte] : filters.MinValue,
                    [Op.lte] : filters.MaxValue,
                };
            } else if (filters.MinValue === null && filters.MaxValue !== null) {
                search.where['BodyWeight'] = {
                    [Op.lte] : filters.MaxValue,
                };
            } else if (filters.MinValue !== null && filters.MaxValue === null) {
                search.where['CreatedAt'] = {
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

            const foundResults = await BodyWeight.findAndCountAll(search);

            const dtos: BodyWeightDto[] = [];
            for (const bodyWeight of foundResults.rows) {
                const dto = await BodyWeightMapper.toDto(bodyWeight);
                dtos.push(dto);
            }

            const searchResults: BodyWeightSearchResults = {
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

    update = async (id: string, updateModel: BodyWeightDomainModel): Promise<BodyWeightDto> => {
        try {
            const bodyWeight = await BodyWeight.findByPk(id);

            if (updateModel.PatientUserId != null) {
                bodyWeight.PatientUserId = updateModel.PatientUserId;
            }
            if (updateModel.BodyWeight != null) {
                bodyWeight.BodyWeight = updateModel.BodyWeight;
            }
            if (updateModel.Unit != null) {
                bodyWeight.Unit = updateModel.Unit;
            }
            if (updateModel.RecordDate != null) {
                bodyWeight.RecordDate = updateModel.RecordDate;
            }
            if (updateModel.RecordedByUserId != null) {
                bodyWeight.RecordedByUserId = updateModel.RecordedByUserId;
            }

            await bodyWeight.save();

            return await BodyWeightMapper.toDto(bodyWeight);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            const result = await BodyWeight.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
