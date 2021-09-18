import { IStepCountRepo } from '../../../../repository.interfaces/daily.records/step.count.interface';
import StepCount from '../../models/daily.records/step.count.model';
import { Op } from 'sequelize';
import { StepCountMapper } from '../../mappers/daily.records/step.count.mapper';
import { Logger } from '../../../../../common/logger';
import { ApiError } from '../../../../../common/api.error';
import { StepCountDomainModel } from '../../../../../domain.types/daily.records/step.count/step.count.domain.model';
import { StepCountDto } from '../../../../../domain.types/daily.records/step.count/step.count.dto';
import { StepCountSearchResults, StepCountSearchFilters } from '../../../../../domain.types/daily.records/step.count/step.count.search.types';

///////////////////////////////////////////////////////////////////////

export class StepCountRepo implements IStepCountRepo {

    create = async (stepCountDomainModel: StepCountDomainModel): Promise<StepCountDto> => {
        try {
            const entity = {
                PatientUserId : stepCountDomainModel.PatientUserId ?? null,
                StepCount     : stepCountDomainModel.StepCount ?? null,
                Unit          : stepCountDomainModel.Unit ?? null,
                RecordDate    : stepCountDomainModel.RecordDate ?? null,
            };
            const stepCount = await StepCount.create(entity);
            const dto = await StepCountMapper.toDto(stepCount);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<StepCountDto> => {
        try {
            const stepCount = await StepCount.findByPk(id);
            const dto = await StepCountMapper.toDto(stepCount);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: StepCountSearchFilters): Promise<StepCountSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = { [Op.eq]: filters.PatientUserId };
            }
            if (filters.MinValue != null && filters.MaxValue != null) {
                search.where['StepCount'] = {
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

            let orderByColum = 'StepCount';
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

            const foundResults = await StepCount.findAndCountAll(search);

            const dtos: StepCountDto[] = [];
            for (const stepCount of foundResults.rows) {
                const dto = await StepCountMapper.toDto(stepCount);
                dtos.push(dto);
            }

            const searchResults: StepCountSearchResults = {
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

    update = async (id: string, stepCountDomainModel: StepCountDomainModel): Promise<StepCountDto> => {
        try {
            const stepCount = await StepCount.findByPk(id);

            if (stepCountDomainModel.PatientUserId != null) {
                stepCount.PatientUserId = stepCountDomainModel.PatientUserId;
            }
            if (stepCountDomainModel.StepCount != null) {
                stepCount.StepCount = stepCountDomainModel.StepCount;
            }
            if (stepCountDomainModel.Unit != null) {
                stepCount.Unit = stepCountDomainModel.Unit;
            }

            await stepCount.save();

            const dto = await StepCountMapper.toDto(stepCount);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            await StepCount.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
