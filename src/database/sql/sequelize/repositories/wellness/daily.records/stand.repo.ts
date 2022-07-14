import { Op } from 'sequelize';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { StandDomainModel } from '../../../../../../domain.types/wellness/daily.records/stand/stand.domain.model';
import { StandDto } from '../../../../../../domain.types/wellness/daily.records/stand/stand.dto';
import { StandSearchFilters, StandSearchResults } from '../../../../../../domain.types/wellness/daily.records/stand/stand.search.types';
import { IStandRepo } from '../../../../../repository.interfaces/wellness/daily.records/stand.repo.interface';
import { StandMapper } from '../../../mappers/wellness/daily.records/stand.mapper';
import Stand from '../../../models/wellness/daily.records/stand.model';

///////////////////////////////////////////////////////////////////////

export class StandRepo implements IStandRepo {

    create = async (createModel: StandDomainModel): Promise<StandDto> => {
        try {
            const entity = {
                PatientUserId : createModel.PatientUserId ?? null,
                Stand         : createModel.Stand ?? null,
                Unit          : createModel.Unit ?? null,
                RecordDate    : createModel.RecordDate ?? null,
            };
            const stand = await Stand.create(entity);
            return await StandMapper.toDto(stand);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<StandDto> => {
        try {
            const stand = await Stand.findByPk(id);
            return await StandMapper.toDto(stand);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: StandSearchFilters): Promise<StandSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.MinValue != null && filters.MaxValue != null) {
                search.where['Stand'] = {
                    [Op.gte] : filters.MinValue,
                    [Op.lte] : filters.MaxValue,
                };
            } else if (filters.MinValue === null && filters.MaxValue !== null) {
                search.where['Stand'] = {
                    [Op.lte] : filters.MaxValue,
                };
            } else if (filters.MinValue !== null && filters.MaxValue === null) {
                search.where['Stand'] = {
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

            const foundResults = await Stand.findAndCountAll(search);

            const dtos: StandDto[] = [];
            for (const stand of foundResults.rows) {
                const dto = await StandMapper.toDto(stand);
                dtos.push(dto);
            }

            const searchResults: StandSearchResults = {
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

    update = async (id: string, updateModel: StandDomainModel): Promise<StandDto> => {
        try {
            const stand = await Stand.findByPk(id);

            if (updateModel.PatientUserId != null) {
                stand.PatientUserId = updateModel.PatientUserId;
            }
            if (updateModel.Stand != null) {
                stand.Stand = updateModel.Stand;
            }
            if (updateModel.Unit != null) {
                stand.Unit = updateModel.Unit;
            }
            if (updateModel.RecordDate != null) {
                stand.RecordDate = updateModel.RecordDate;
            }

            await stand.save();

            return await StandMapper.toDto(stand);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            await Stand.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
