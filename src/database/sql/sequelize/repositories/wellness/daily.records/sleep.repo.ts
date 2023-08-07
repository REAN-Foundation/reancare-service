import { Op } from 'sequelize';
import { TimeHelper } from '../../../../../../common/time.helper';
import { DurationType } from '../../../../../../domain.types/miscellaneous/time.types';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { SleepDomainModel } from '../../../../../../domain.types/wellness/daily.records/sleep/sleep.domain.model';
import { SleepDto } from '../../../../../../domain.types/wellness/daily.records/sleep/sleep.dto';
import { SleepSearchFilters, SleepSearchResults } from '../../../../../../domain.types/wellness/daily.records/sleep/sleep.search.types';
import { ISleepRepo } from '../../../../../repository.interfaces/wellness/daily.records/sleep.repo.interface';
import { SleepMapper } from '../../../mappers/wellness/daily.records/sleep.mapper';
import Sleep from '../../../models/wellness/daily.records/sleep.model';
import { HelperRepo } from '../../common/helper.repo';
import { uuid } from '../../../../../../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////

export class SleepRepo implements ISleepRepo {

    create = async (createModel: SleepDomainModel): Promise<SleepDto> => {
        try {
            const entity = {
                PatientUserId : createModel.PatientUserId,
                SleepDuration : createModel.SleepDuration,
                Unit          : createModel.Unit,
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

    getByRecordDate = async (date: Date, patientUserId: uuid): Promise<SleepDto> => {
        try {
            const new_date = new Date(date);
            const sleep =  await Sleep.findOne({
                where : {
                    RecordDate    : new_date,
                    PatientUserId : patientUserId,
                }
            });
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

    getStats = async (patientUserId: uuid, numMonths: number): Promise<any> => {
        try {
            // const numDays = 30 * numMonths;
            // const offsetMinutes = await HelperRepo.getPatientTimezoneOffsets(patientUserId);
            const records = await this.getSleepRecords(patientUserId, numMonths, DurationType.Month);
            if (records.length === 0) {
                return [];
            }
            return records.map(x => {
                const dayStr = x.RecordDate.toISOString()
                    .split('T')[0];
                return {
                    SleepDuration : x.SleepDuration,
                    DayStr    : dayStr,
                };
            });
            // const dayList = Array.from({ length: numDays }, (_, index) => index + 1);
            // const reference = TimeHelper.getStartOfDay(new Date(), offsetMinutes);
            // const stats = [];
            // for (var day of dayList) {
            //     var dayStart = TimeHelper.subtractDuration(reference, day * 24, DurationType.Hour);
            //     var dayEnd = TimeHelper.subtractDuration(reference, (day - 1) * 24, DurationType.Hour);
            //     const dayStr = dayStart.toISOString().split('T')[0];
            //     const filtered = records.filter(x => x.RecordDate >= dayStart && x.RecordDate <= dayEnd);
            //     const totalSleepHours = filtered.reduce((acc, x) => acc + x.SleepDuration, 0);
            //     stats.push({
            //         SleepDuration : totalSleepHours,
            //         DayStr        : dayStr,
            //     });
            // }
            // Logger.instance().log(JSON.stringify(stats));
            // return stats;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private async getSleepRecords(patientUserId: string, count: number, unit: DurationType) {
        const today = new Date();
        const from = TimeHelper.subtractDuration(new Date(), count, unit);
        const result = await Sleep.findAll({
            where : {
                PatientUserId : patientUserId,
                RecordDate    : {
                    [Op.gte] : from,
                    [Op.lte] : today,
                }
            }
        });
        let sleepRecords = result.map(x => {
            return {
                SleepDuration : x.SleepDuration,
                RecordDate    : x.RecordDate,
            };
        });
        sleepRecords = sleepRecords.sort((a, b) => a.RecordDate.getTime() - b.RecordDate.getTime());
        return sleepRecords;
    }

    getByRecordDateAndPatientUserId = async (date: Date, patientUserId : string): Promise<SleepDto> => {
        try {
            const new_date = new Date(date);
            const sleep =  await Sleep.findOne({
                where : {
                    RecordDate    : new_date,
                    PatientUserId : patientUserId,
                }
            });
            return await SleepMapper.toDto(sleep);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getAllUserResponsesBetween = async (patientUserId: string, dateFrom: Date, dateTo: Date)
        : Promise<any[]> => {
        try {
            const offsetMinutes = await HelperRepo.getPatientTimezoneOffsets(patientUserId);
            const currentTimeZone = await HelperRepo.getPatientTimezone(patientUserId);

            let records = await Sleep.findAll({
                where : {
                    PatientUserId : patientUserId,
                    SleepDuration : {
                        [Op.not] : null,
                    },
                    CreatedAt : {
                        [Op.gte] : dateFrom,
                        [Op.lte] : dateTo,
                    }
                }
            });
            records = records.sort((a, b) => b.CreatedAt.getTime() - a.CreatedAt.getTime());
            const records_ = records.map(async x => {
                const tempDate = TimeHelper.addDuration(x.RecordDate, offsetMinutes, DurationType.Minute);
                return {
                    RecordId       : x.id,
                    PatientUserId  : x.PatientUserId,
                    Name           : 'Sleep',
                    Duration       : x.SleepDuration,
                    Unit           : x.Unit,
                    RecordDate     : tempDate,
                    RecordDateStr  : await TimeHelper.formatDateToLocal_YYYY_MM_DD(x.RecordDate),
                    RecordTimeZone : currentTimeZone,
                };
            });
            return records_;
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getAllUserResponsesBefore = async (patientUserId: string, date: Date): Promise<any[]> => {
        try {
            const offsetMinutes = await HelperRepo.getPatientTimezoneOffsets(patientUserId);
            const currentTimeZone = await HelperRepo.getPatientTimezone(patientUserId);

            let records = await Sleep.findAll({
                where : {
                    PatientUserId : patientUserId,
                    SleepDuration : {
                        [Op.not] : null,
                    },
                    CreatedAt : {
                        [Op.lte] : date,
                    }
                }
            });
            records = records.sort((a, b) => b.CreatedAt.getTime() - a.CreatedAt.getTime());
            const records_ = records.map(async x => {
                const tempDate = TimeHelper.addDuration(x.RecordDate, offsetMinutes, DurationType.Minute);
                return {
                    RecordId       : x.id,
                    PatientUserId  : x.PatientUserId,
                    Name           : 'Sleep',
                    Duration       : x.SleepDuration,
                    Unit           : x.Unit,
                    RecordDate     : tempDate,
                    RecordDateStr  : await TimeHelper.formatDateToLocal_YYYY_MM_DD(x.RecordDate),
                    RecordTimeZone : currentTimeZone,
                };
            });
            return records_;
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
