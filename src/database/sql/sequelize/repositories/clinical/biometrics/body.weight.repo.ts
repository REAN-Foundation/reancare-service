import { Op } from 'sequelize';
import { TimeHelper } from '../../../../../../common/time.helper';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { BodyWeightDomainModel } from '../../../../../../domain.types/clinical/biometrics/body.weight/body.weight.domain.model';
import { BodyWeightDto } from '../../../../../../domain.types/clinical/biometrics/body.weight/body.weight.dto';
import { BodyWeightSearchFilters, BodyWeightSearchResults } from '../../../../../../domain.types/clinical/biometrics/body.weight/body.weight.search.types';
import { IBodyWeightRepo } from '../../../../../repository.interfaces/clinical/biometrics/body.weight.repo.interface';
import { BodyWeightMapper } from '../../../mappers/clinical/biometrics/body.weight.mapper';
import BodyWeight from '../../../models/clinical/biometrics/body.weight.model';
import { DurationType } from '../../../../../../domain.types/miscellaneous/time.types';
import { HelperRepo } from '../../common/helper.repo';

///////////////////////////////////////////////////////////////////////

export class BodyWeightRepo implements IBodyWeightRepo {

    create = async (createModel: BodyWeightDomainModel): Promise<BodyWeightDto> => {
        try {
            const entity = {
                PatientUserId    : createModel.PatientUserId,
                EhrId            : createModel.EhrId,
                BodyWeight       : createModel.BodyWeight,
                Unit             : createModel.Unit,
                RecordDate       : createModel.RecordDate ?? new Date(),
                RecordedByUserId : createModel.RecordedByUserId ?? null,
            };

            const bodyWeight = await BodyWeight.create(entity);
            return await BodyWeightMapper.toDto(bodyWeight);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<BodyWeightDto> => {
        try {
            const bodyWeight = await BodyWeight.findByPk(id);
            return await BodyWeightMapper.toDto(bodyWeight);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: BodyWeightSearchFilters): Promise<BodyWeightSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.MinValue != null && filters.MaxValue != null) {
                search.where['BodyWeight'] = {
                    [Op.gte] : filters.MinValue,
                    [Op.lte] : filters.MaxValue,
                };
            } else if (filters.MinValue === null && filters.MaxValue !== null) {
                search.where['BodyWeight'] = {
                    [Op.lte] : filters.MaxValue,
                };
            } else if (filters.MinValue !== null && filters.MaxValue === null) {
                search.where['BodyWeight'] = {
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
            if (filters.RecordedByUserId != null) {
                search.where['RecordedByUserId'] = filters.RecordedByUserId;
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

            const foundResults = await BodyWeight.findAndCountAll(search);

            const dtos: BodyWeightDto[] = [];
            for (const bodyWeight of foundResults.rows) {
                const dto = await BodyWeightMapper.toDto(bodyWeight);
                dtos.push(dto);
            }

            const searchResults: BodyWeightSearchResults = {
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

    update = async (id: string, updateModel: BodyWeightDomainModel): Promise<BodyWeightDto> => {
        try {
            const bodyWeight = await BodyWeight.findByPk(id);

            if (updateModel.PatientUserId != null) {
                bodyWeight.PatientUserId = updateModel.PatientUserId;
            }
            if (updateModel.BodyWeight != null) {
                bodyWeight.BodyWeight = updateModel.BodyWeight;
            }
            if (updateModel.Unit != null) {
                bodyWeight.Unit = updateModel.Unit;
            }
            if (updateModel.RecordDate != null) {
                bodyWeight.RecordDate = updateModel.RecordDate;
            }
            if (updateModel.RecordedByUserId != null) {
                bodyWeight.RecordedByUserId = updateModel.RecordedByUserId;
            }

            await bodyWeight.save();

            return await BodyWeightMapper.toDto(bodyWeight);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            const result = await BodyWeight.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getStats = async (patientUserId: string, numMonths: number): Promise<any> => {
        try {
            const records = await this.getRecords(patientUserId, numMonths);
            return records.map(x => {
                const dayStr = x.CreatedAt.toISOString()
                    .split('T')[0];
                return {
                    BodyWeight : x.BodyWeight,
                    DayStr     : dayStr,
                };
            });
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getRecent = async (patientUserId: string): Promise<BodyWeightDto> => {
        try {
            const bodyWeight = await BodyWeight.findOne({
                where : {
                    PatientUserId : patientUserId,
                },
                order : [['CreatedAt', 'DESC']]
            });
            return await BodyWeightMapper.toDto(bodyWeight);
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

            let records = await BodyWeight.findAll({
                where : {
                    PatientUserId : patientUserId,
                    BodyWeight    : {
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
                    RecordId          : x.id,
                    PatientUserId     : x.PatientUserId,
                    VitalName         : "BodyWeight",
                    VitalPrimaryValue : x.BodyWeight,
                    Unit              : x.Unit,
                    RecordDateStr     : await TimeHelper.formatDateToLocal_YYYY_MM_DD(x.RecordDate),
                    RecordDate        : tempDate,
                    RecordTimeZone    : currentTimeZone,
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

            let records = await BodyWeight.findAll({
                where : {
                    PatientUserId : patientUserId,
                    BodyWeight    : {
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
                    RecordId          : x.id,
                    PatientUserId     : x.PatientUserId,
                    VitalName         : "BodyWeight",
                    VitalPrimaryValue : x.BodyWeight,
                    Unit              : x.Unit,
                    RecordDateStr     : await TimeHelper.formatDateToLocal_YYYY_MM_DD(x.RecordDate),
                    RecordDate        : tempDate,
                    RecordTimeZone    : currentTimeZone,
                };
            });
            return records_;
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private async getRecords(patientUserId: string, months: number) {
        const today = new Date();
        const from = TimeHelper.subtractDuration(new Date(), months, DurationType.Month);
        const result = await BodyWeight.findAll({
            where : {
                PatientUserId : patientUserId,
                CreatedAt     : {
                    [Op.gte] : from,
                    [Op.lte] : today,
                }
            }
        });
        let bodyWeights = result.map(x => {
            return {
                BodyWeight : x.BodyWeight,
                CreatedAt  : x.CreatedAt,
            };
        });
        bodyWeights = bodyWeights.sort((a, b) => b.CreatedAt.getTime() - a.CreatedAt.getTime());
        return bodyWeights;
    }

}
