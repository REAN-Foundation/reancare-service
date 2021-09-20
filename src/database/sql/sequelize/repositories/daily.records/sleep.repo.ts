import { ISleepRepo } from '../../../../repository.interfaces/daily.records/sleep.repo.interface';
import Sleep from '../../models/daily.records/sleep.model';
import { Op } from 'sequelize';
import { SleepMapper } from '../../mappers/daily.records/sleep.mapper';
import { Logger } from '../../../../../common/logger';
import { ApiError } from '../../../../../common/api.error';
import { SleepDomainModel } from '../../../../../domain.types/daily.records/Sleep/sleep.domain.model';
import { SleepDto } from '../../../../../domain.types/daily.records/Sleep/sleep.dto';
import { SleepSearchResults, SleepSearchFilters } from '../../../../../domain.types/daily.records/Sleep/sleep.search.types';

///////////////////////////////////////////////////////////////////////

export class SleepRepo implements ISleepRepo {

    create = async (sleepDomainModel: SleepDomainModel): Promise<SleepDto> => {
        try {
            const entity = {
                PersonId      : sleepDomainModel.PersonId,
                PatientUserId : sleepDomainModel.PatientUserId ?? null,
                SleepDuration : sleepDomainModel.SleepDuration ?? 0,
                RecordDate    : sleepDomainModel.RecordDate ?? null,
                Unit          : sleepDomainModel.Unit ?? 'hrs',
            };
            const sleep = await Sleep.create(entity);
            const dto = await SleepMapper.toDto(sleep);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<SleepDto> => {
        try {
            const sleep = await Sleep.findByPk(id);
            const dto = await SleepMapper.toDto(sleep);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: SleepSearchFilters): Promise<SleepSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.PersonId != null) {
                search.where['PersonId'] = { [Op.eq]: filters.PersonId };
            }
            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = { [Op.eq]: filters.PatientUserId };
            }
            if (filters.MinValue != null && filters.MaxValue != null) {
                search.where['SleepDuration'] = {
                    [Op.gte] : filters.MinValue,
                    [Op.lte] : filters.MaxValue,
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

            let orderByColum = 'RecordDate';
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

    update = async (id: string, sleepDomainModel: SleepDomainModel): Promise<SleepDto> => {
        try {
            const sleep = await Sleep.findByPk(id);

            if (sleepDomainModel.PersonId != null) {
                sleep.PersonId = sleepDomainModel.PersonId;
            }
            if (sleepDomainModel.PatientUserId != null) {
                sleep.PatientUserId = sleepDomainModel.PatientUserId;
            }
            if (sleepDomainModel.SleepDuration != null) {
                sleep.SleepDuration = sleepDomainModel.SleepDuration;
            }
            if (sleepDomainModel.Unit != null) {
                sleep.Unit = sleepDomainModel.Unit;
            }
            if (sleepDomainModel.RecordDate != null) {
                sleep.RecordDate = sleepDomainModel.RecordDate;
            }

            await sleep.save();

            const dto = await SleepMapper.toDto(sleep);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            await Sleep.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
