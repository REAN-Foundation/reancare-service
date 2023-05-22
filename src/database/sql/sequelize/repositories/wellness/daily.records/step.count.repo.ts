import { Op } from 'sequelize';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { StepCountDomainModel } from '../../../../../../domain.types/wellness/daily.records/step.count/step.count.domain.model';
import { StepCountDto } from '../../../../../../domain.types/wellness/daily.records/step.count/step.count.dto';
import { StepCountSearchFilters, StepCountSearchResults } from '../../../../../../domain.types/wellness/daily.records/step.count/step.count.search.types';
import { IStepCountRepo } from '../../../../../repository.interfaces/wellness/daily.records/step.count.interface';
import { StepCountMapper } from '../../../mappers/wellness/daily.records/step.count.mapper';
import StepCount from '../../../models/wellness/daily.records/step.count.model';

///////////////////////////////////////////////////////////////////////

export class StepCountRepo implements IStepCountRepo {

    create = async (createModel: StepCountDomainModel): Promise<StepCountDto> => {
        try {
            const entity = {
                PatientUserId  : createModel.PatientUserId ?? null,
                TerraSummaryId : createModel.TerraSummaryId ?? null,
                Provider       : createModel.Provider ?? null,
                StepCount      : createModel.StepCount ?? null,
                Unit           : createModel.Unit ?? null,
                RecordDate     : createModel.RecordDate ?? null,
            };
            const stepCount = await StepCount.create(entity);
            return await StepCountMapper.toDto(stepCount);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<StepCountDto> => {
        try {
            const stepCount = await StepCount.findByPk(id);
            return await StepCountMapper.toDto(stepCount);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByRecordDate = async (date: Date): Promise<StepCountDto> => {
        try {
            const new_date = new Date(date);
            const sleep =  await StepCount.findOne({
                where : {
                    RecordDate : new_date
                }
            });
            return await StepCountMapper.toDto(sleep);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByRecordDateAndPatientUserId = async (date: Date, patientUserId: string, provider: string): Promise<StepCountDto> => {
        try {
            const new_date = new Date(date);
            const allStepCount =  await StepCount.findAll({
                where : {
                    RecordDate    : new_date,
                    PatientUserId : patientUserId,
                    Provider      : provider
                }
            });
            const providerStepCount = allStepCount.filter(step => step.Provider !== null);

            return StepCountMapper.toDto(providerStepCount[0]);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: StepCountSearchFilters): Promise<StepCountSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
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

    update = async (id: string, updateModel: StepCountDomainModel): Promise<StepCountDto> => {
        try {
            const stepCount = await StepCount.findByPk(id);

            if (updateModel.PatientUserId != null) {
                stepCount.PatientUserId = updateModel.PatientUserId;
            }
            if (updateModel.StepCount != null) {
                stepCount.StepCount = updateModel.StepCount;
            }
            if (updateModel.Unit != null) {
                stepCount.Unit = updateModel.Unit;
            }
            if (updateModel.TerraSummaryId != null) {
                stepCount.TerraSummaryId = updateModel.TerraSummaryId;
            }
            if (updateModel.Provider != null) {
                stepCount.Provider = updateModel.Provider;
            }

            await stepCount.save();

            return await StepCountMapper.toDto(stepCount);
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
