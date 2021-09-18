import { IMoveMinutesRepo } from '../../../../repository.interfaces/daily.records/move.minutes.repo.interface';
import MoveMinutesModel from '../../models/daily.records/move.minutes.model';
import { Op } from 'sequelize';
import { MoveMinutesMapper } from '../../mappers/daily.records/move.minutes.mapper';
import { Logger } from '../../../../../common/logger';
import { ApiError } from '../../../../../common/api.error';
import { MoveMinutesDomainModel } from "../../../../../domain.types/daily.records/move.minutes/move.minutes.domain.model";
import { MoveMinutesDto } from "../../../../../domain.types/daily.records/move.minutes/move.minutes.dto";
import { MoveMinutesSearchFilters, MoveMinutesSearchResults } from "../../../../../domain.types/daily.records/move.minutes/move.minutes.search.types";

///////////////////////////////////////////////////////////////////////

export class MoveMinutesRepo implements IMoveMinutesRepo {

    create = async (moveMinutesDomainModel: MoveMinutesDomainModel):
    Promise<MoveMinutesDto> => {
        try {
            const entity = {
                PatientUserId : moveMinutesDomainModel.PatientUserId,
                MoveMinutes   : moveMinutesDomainModel.MoveMinutes,
                Unit          : moveMinutesDomainModel.Unit,
                RecordDate    : moveMinutesDomainModel.RecordDate,
            };

            const moveMinutes = await MoveMinutesModel.create(entity);
            const dto = await MoveMinutesMapper.toDto(moveMinutes);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<MoveMinutesDto> => {
        try {
            const moveMinutes = await MoveMinutesModel.findByPk(id);
            const dto = await MoveMinutesMapper.toDto(moveMinutes);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: MoveMinutesSearchFilters): Promise<MoveMinutesSearchResults> => {
        try {

            Logger.instance().log(`Filters 2 , ${JSON.stringify(filters)}`);
            
            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.MinValue != null && filters.MaxValue != null) {
                search.where['MoveMinutes'] = {
                    [Op.gte] : filters.MinValue,
                    [Op.lte] : filters.MaxValue,
                };
            } else if (filters.MinValue === null && filters.MaxValue !== null) {
                search.where['MoveMinutes'] = {
                    [Op.lte] : filters.MaxValue,
                };
            } else if (filters.MinValue !== null && filters.MaxValue === null) {
                search.where['MoveMinutes'] = {
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

            const foundResults = await MoveMinutesModel.findAndCountAll(search);

            const dtos: MoveMinutesDto[] = [];
            for (const moveMinutes of foundResults.rows) {
                const dto = await MoveMinutesMapper.toDto(moveMinutes);
                dtos.push(dto);
            }

            const searchResults: MoveMinutesSearchResults = {
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

    update = async (id: string, moveMinutesDomainModel: MoveMinutesDomainModel):
    Promise<MoveMinutesDto> => {
        try {
            const moveMinutes = await MoveMinutesModel.findByPk(id);

            if (moveMinutesDomainModel.PatientUserId != null) {
                moveMinutes.PatientUserId = moveMinutesDomainModel.PatientUserId;
            }
            if (moveMinutesDomainModel.MoveMinutes != null) {
                moveMinutes.MoveMinutes = moveMinutesDomainModel.MoveMinutes;
            }
            if (moveMinutesDomainModel.Unit != null) {
                moveMinutes.Unit = moveMinutesDomainModel.Unit;
            }
            if (moveMinutesDomainModel.RecordDate != null) {
                moveMinutes.RecordDate = moveMinutesDomainModel.RecordDate;
            }
            
            await moveMinutes.save();

            const dto = await MoveMinutesMapper.toDto(moveMinutes);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            Logger.instance().log(id);

            const result = await MoveMinutesModel.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
