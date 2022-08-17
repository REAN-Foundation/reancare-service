import { Op } from 'sequelize';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { SleepDomainModel } from '../../../../../../domain.types/wellness/daily.records/sleep/sleep.domain.model';
import { SleepDto } from '../../../../../../domain.types/wellness/daily.records/sleep/sleep.dto';
import { SleepSearchFilters, SleepSearchResults } from '../../../../../../domain.types/wellness/daily.records/sleep/sleep.search.types';
import { ISleepRepo } from '../../../../../repository.interfaces/wellness/daily.records/sleep.repo.interface';
import { SleepMapper } from '../../../mappers/wellness/daily.records/sleep.mapper';
import Sleep from '../../../models/wellness/daily.records/sleep.model';

///////////////////////////////////////////////////////////////////////

export class SleepRepo implements ISleepRepo {

    create = async (createModel: SleepDomainModel): Promise<SleepDto> => {
        try {
            const entity = {
                PatientUserId : createModel.PatientUserId,
                SleepDuration : createModel.SleepDuration,
                Unit          : createModel.Unit,
                StartTime     : createModel.StartTime,
                EndTime       : createModel.EndTime,
                RecordDate    : createModel.RecordDate,
            };
            const sleep = await Sleep.create(entity);
            return await SleepMapper.toDto(sleep);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<SleepDto> => {
        try {
            const sleep = await Sleep.findByPk(id);
            return await SleepMapper.toDto(sleep);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: SleepSearchFilters): Promise<SleepSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.MinValue != null && filters.MaxValue != null) {
                search.where['SleepDuration'] = {
                    [Op.gte] : filters.MinValue,
                    [Op.lte] : filters.MaxValue,
                };
            } else if (filters.MinValue === null && filters.MaxValue !== null) {
                search.where['SleepDuration'] = {
                    [Op.lte] : filters.MaxValue,
                };
            } else if (filters.MinValue !== null && filters.MaxValue === null) {
                search.where['SleepDuration'] = {
                    [Op.gte] : filters.MinValue,
                };
            }
            if (filters.StartTime != null) {
                search.where['StartTime'] = filters.StartTime;
            }
            if (filters.EndTime != null) {
                search.where['EndTime'] = filters.EndTime;
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

            const foundResults = await Sleep.findAndCountAll(search);

            const dtos: SleepDto[] = [];
            for (const sleep of foundResults.rows) {
                const dto = await SleepMapper.toDto(sleep);
                dtos.push(dto);
            }

            const searchResults: SleepSearchResults = {
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

    update = async (id: string, updateModel: SleepDomainModel): Promise<SleepDto> => {
        try {
            const sleep = await Sleep.findByPk(id);

            if (updateModel.PatientUserId != null) {
                sleep.PatientUserId = updateModel.PatientUserId;
            }
            if (updateModel.SleepDuration != null) {
                sleep.SleepDuration = updateModel.SleepDuration;
            }
            if (updateModel.Unit != null) {
                sleep.Unit = updateModel.Unit;
            }
            if (updateModel.StartTime != null) {
                sleep.StartTime = updateModel.StartTime;
            }
            if (updateModel.EndTime != null) {
                sleep.EndTime = updateModel.EndTime;
            }
            if (updateModel.RecordDate != null) {
                sleep.RecordDate = updateModel.RecordDate;
            }

            await sleep.save();
            return await SleepMapper.toDto(sleep);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            const result = await Sleep.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
