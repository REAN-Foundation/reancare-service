import { Op } from 'sequelize';
import { TimeHelper } from '../../../../../../common/time.helper';
import { uuid } from '../../../../../../domain.types/miscellaneous/system.types';
import { DurationType } from '../../../../../../domain.types/miscellaneous/time.types';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { DailyAssessmentDomainModel } from '../../../../../../domain.types/clinical/daily.assessment/daily.assessment.domain.model';
import { DailyAssessmentDto } from '../../../../../../domain.types/clinical/daily.assessment/daily.assessment.dto';
import { DailyAssessmentSearchFilters, DailyAssessmentSearchResults } from '../../../../../../domain.types/clinical/daily.assessment/daily.assessment.search.types';
import { IDailyAssessmentRepo } from '../../../../../repository.interfaces/clinical/daily.assessment/daily.assessment.repo.interface';
import { DailyAssessmentMapper } from '../../../mappers/clinical/daily.assessment/daily.assessment.mapper';
import DailyAssessment from '../../../models/clinical/daily.assessment/daily.assessment.model';

///////////////////////////////////////////////////////////////////////

export class DailyAssessmentRepo implements IDailyAssessmentRepo {

    create = async (createModel: DailyAssessmentDomainModel): Promise<DailyAssessmentDto> => {
        try {
            const entity = {
                PatientUserId : createModel.PatientUserId,
                Feeling       : createModel.Feeling,
                Mood          : createModel.Mood,
                EnergyLevels  : JSON.stringify(createModel.EnergyLevels),
                RecordDate    : createModel.RecordDate,
            };
            const dailyAssessment = await DailyAssessment.create(entity);
            return await DailyAssessmentMapper.toDto(dailyAssessment);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: DailyAssessmentSearchFilters): Promise<DailyAssessmentSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.Feeling != null) {
                search.where['Feeling'] = filters.Feeling;
            }
            if (filters.Mood != null) {
                search.where['Mood'] = filters.Mood;
            }
            if (filters.EnergyLevels != null) {
                search.where['EnergyLevels'] = { [Op.like]: '%' + filters.EnergyLevels + '%' };
            }
            if (filters.DateFrom != null && filters.DateTo != null) {
                search.where['RecordDate'] = {
                    [Op.gte] : filters.DateFrom,
                    [Op.lte] : filters.DateTo,
                };
            } else if (filters.DateFrom === null && filters.DateTo !== null) {
                search.where['RecordDate'] = {
                    [Op.lte] : filters.DateTo,
                };
            } else if (filters.DateFrom !== null && filters.DateTo === null) {
                search.where['RecordDate'] = {
                    [Op.gte] : filters.DateFrom,
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

            const foundResults = await DailyAssessment.findAndCountAll(search);

            const dtos: DailyAssessmentDto[] = [];
            for (const dailyAssessment of foundResults.rows) {
                const dto = await DailyAssessmentMapper.toDto(dailyAssessment);
                dtos.push(dto);
            }

            const searchResults: DailyAssessmentSearchResults = {
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

    getStats = async (patientUserId: uuid, numMonths: number): Promise<any> => {
        try {
            const records = await this.getRecords(patientUserId, numMonths);
            const records_ = records.map(x => {
                const dayStr = x.CreatedAt.toISOString()
                    .split('T')[0];
                return {
                    Feeling      : x.Feeling,
                    Mood         : x.Mood,
                    EnergyLevels : JSON.parse(x.EnergyLevels),
                    DayStr       : dayStr,
                };
            });
            return records_;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private async getRecords(patientUserId: string, months: number) {
        const today = new Date();
        const from = TimeHelper.subtractDuration(new Date(), months, DurationType.Month);
        const records = await DailyAssessment.findAll({
            where : {
                PatientUserId : patientUserId,
                CreatedAt     : {
                    [Op.gte] : from,
                    [Op.lte] : today,
                }
            }
        });
        return records.sort((a, b) => b.CreatedAt.getTime() - a.CreatedAt.getTime());
    }

}
