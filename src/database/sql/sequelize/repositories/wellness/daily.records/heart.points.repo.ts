import { Op } from 'sequelize';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { HeartPointsDomainModel } from '../../../../../../domain.types/wellness/daily.records/heart.points/heart.points.domain.model';
import { HeartPointsDto } from '../../../../../../domain.types/wellness/daily.records/heart.points/heart.points.dto';
import { HeartPointsSearchFilters, HeartPointsSearchResults } from '../../../../../../domain.types/wellness/daily.records/heart.points/heart.points.search.types';
import { IHeartPointsRepo } from '../../../../../repository.interfaces/wellness/daily.records/heart.points.repo.interface';
import { HeartPointsMapper } from '../../../mappers/wellness/daily.records/heart.points.mapper';
import HeartPoints from '../../../models/wellness/daily.records/heart.points.model';

///////////////////////////////////////////////////////////////////////

export class HeartPointsRepo implements IHeartPointsRepo {

    create = async (createModel: HeartPointsDomainModel): Promise<HeartPointsDto> => {
        try {
            const entity = {
                PatientUserId : createModel.PatientUserId,
                HeartPoints   : createModel.HeartPoints,
                Unit          : createModel.Unit,
                RecordDate    : createModel.RecordDate

            };
            const heartPoint = await HeartPoints.create(entity);
            return await HeartPointsMapper.toDto(heartPoint);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<HeartPointsDto> => {
        try {
            const heartPoint = await HeartPoints.findByPk(id);
            return await HeartPointsMapper.toDto(heartPoint);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: HeartPointsSearchFilters): Promise<HeartPointsSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.MinValue != null && filters.MaxValue != null) {
                search.where['HeartPoints'] = {
                    [Op.gte] : filters.MinValue,
                    [Op.lte] : filters.MaxValue,
                };
            } else if (filters.MinValue === null && filters.MaxValue !== null) {
                search.where['HeartPoints'] = {
                    [Op.lte] : filters.MaxValue,
                };
            } else if (filters.MinValue !== null && filters.MaxValue === null) {
                search.where['HeartPoints'] = {
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

            const foundResults = await HeartPoints.findAndCountAll(search);

            const dtos: HeartPointsDto[] = [];
            for (const heartPoint of foundResults.rows) {
                const dto = await HeartPointsMapper.toDto(heartPoint);
                dtos.push(dto);
            }

            const searchResults: HeartPointsSearchResults = {
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

    update = async (id: string, updateModel: HeartPointsDomainModel): Promise<HeartPointsDto> => {
        try {
            const heartPoint = await HeartPoints.findByPk(id);

            if (updateModel.PatientUserId != null) {
                heartPoint.PatientUserId = updateModel.PatientUserId;
            }
            if (updateModel.HeartPoints != null) {
                heartPoint.HeartPoints = updateModel.HeartPoints;
            }
            if (updateModel.Unit != null) {
                heartPoint.Unit = updateModel.Unit;
            }
            if (updateModel.RecordDate != null) {
                heartPoint.RecordDate = updateModel.RecordDate;
            }

            await heartPoint.save();

            return await HeartPointsMapper.toDto(heartPoint);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            const result = await HeartPoints.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
