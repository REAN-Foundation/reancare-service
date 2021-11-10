import { Op } from 'sequelize';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { MoveMinutesDomainModel } from "../../../../../../domain.types/wellness/daily.records/move.minutes/move.minutes.domain.model";
import { MoveMinutesDto } from "../../../../../../domain.types/wellness/daily.records/move.minutes/move.minutes.dto";
import { MoveMinutesSearchFilters, MoveMinutesSearchResults } from "../../../../../../domain.types/wellness/daily.records/move.minutes/move.minutes.search.types";
import { IMoveMinutesRepo } from '../../../../../repository.interfaces/wellness/daily.records/move.minutes.repo.interface';
import { MoveMinutesMapper } from '../../../mappers/wellness/daily.records/move.minutes.mapper';
import MoveMinutesModel from '../../../models/wellness/daily.records/move.minutes.model';

///////////////////////////////////////////////////////////////////////

export class MoveMinutesRepo implements IMoveMinutesRepo {

    create = async (createModel: MoveMinutesDomainModel):
    Promise<MoveMinutesDto> => {
        try {
            const entity = {
                PatientUserId : createModel.PatientUserId,
                MoveMinutes   : createModel.MoveMinutes,
                Unit          : createModel.Unit,
                RecordDate    : createModel.RecordDate,
            };

            const moveMinutes = await MoveMinutesModel.create(entity);
            return await MoveMinutesMapper.toDto(moveMinutes);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<MoveMinutesDto> => {
        try {
            const moveMinutes = await MoveMinutesModel.findByPk(id);
            return await MoveMinutesMapper.toDto(moveMinutes);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: MoveMinutesSearchFilters): Promise<MoveMinutesSearchResults> => {
        try {
            
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

    update = async (id: string, updateModel: MoveMinutesDomainModel):
    Promise<MoveMinutesDto> => {
        try {
            const moveMinutes = await MoveMinutesModel.findByPk(id);

            if (updateModel.PatientUserId != null) {
                moveMinutes.PatientUserId = updateModel.PatientUserId;
            }
            if (updateModel.MoveMinutes != null) {
                moveMinutes.MoveMinutes = updateModel.MoveMinutes;
            }
            if (updateModel.Unit != null) {
                moveMinutes.Unit = updateModel.Unit;
            }
            if (updateModel.RecordDate != null) {
                moveMinutes.RecordDate = updateModel.RecordDate;
            }
            
            await moveMinutes.save();

            return await MoveMinutesMapper.toDto(moveMinutes);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            
            const result = await MoveMinutesModel.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
