import { Op } from 'sequelize';
import { uuid } from '../../../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { BloodGlucoseDomainModel } from "../../../../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.domain.model";
import { BloodGlucoseDto } from "../../../../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.dto";
import { BloodGlucoseSearchFilters, BloodGlucoseSearchResults } from "../../../../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.search.types";
import { IBloodGlucoseRepo } from "../../../../../repository.interfaces/clinical/biometrics/blood.glucose.repo.interface";
import { BloodGlucoseMapper } from "../../../mappers/clinical/biometrics/blood.glucose.mapper";
import BloodGlucose from "../../../models/clinical/biometrics/blood.glucose.model";
import { TimeHelper } from '../../../../../../common/time.helper';
import { DurationType } from '../../../../../../domain.types/miscellaneous/time.types';
import { HelperRepo } from '../../common/helper.repo';

///////////////////////////////////////////////////////////////////////

export class BloodGlucoseRepo implements IBloodGlucoseRepo {

    create = async (createModel: BloodGlucoseDomainModel):
    Promise<BloodGlucoseDto> => {
        try {
            const entity = {
                PatientUserId    : createModel.PatientUserId,
                EhrId            : createModel.EhrId,
                TerraSummaryId   : createModel.TerraSummaryId,
                Provider         : createModel.Provider,
                BloodGlucose     : createModel.BloodGlucose,
                Unit             : createModel.Unit,
                RecordDate       : createModel.RecordDate,
                RecordedByUserId : createModel.RecordedByUserId,
            };
            const bloodGlucose = await BloodGlucose.create(entity);
            return await BloodGlucoseMapper.toDto(bloodGlucose);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<BloodGlucoseDto> => {
        try {
            const bloodGlucose = await BloodGlucose.findByPk(id);
            return await BloodGlucoseMapper.toDto(bloodGlucose);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: BloodGlucoseSearchFilters): Promise<BloodGlucoseSearchResults> => {
        try {

            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.MinValue != null && filters.MaxValue != null) {
                search.where['BloodGlucose'] = {
                    [Op.gte] : filters.MinValue,
                    [Op.lte] : filters.MaxValue,
                };
            } else if (filters.MinValue === null && filters.MaxValue !== null) {
                search.where['BloodGlucose'] = {
                    [Op.lte] : filters.MaxValue,
                };
            } else if (filters.MinValue !== null && filters.MaxValue === null) {
                search.where['BloodGlucose'] = {
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

            const foundResults = await BloodGlucose.findAndCountAll(search);

            const dtos: BloodGlucoseDto[] = [];
            for (const bloodGlucose of foundResults.rows) {
                const dto = await BloodGlucoseMapper.toDto(bloodGlucose);
                dtos.push(dto);
            }

            const searchResults: BloodGlucoseSearchResults = {
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

    update = async (id: string, updateModel: BloodGlucoseDomainModel):
    Promise<BloodGlucoseDto> => {
        try {
            const bloodGlucose = await BloodGlucose.findByPk(id);

            if (updateModel.PatientUserId != null) {
                bloodGlucose.PatientUserId = updateModel.PatientUserId;
            }
            if (updateModel.BloodGlucose != null) {
                bloodGlucose.BloodGlucose = updateModel.BloodGlucose;
            }
            if (updateModel.Unit != null) {
                bloodGlucose.Unit = updateModel.Unit;
            }
            if (updateModel.RecordDate != null) {
                bloodGlucose.RecordDate = updateModel.RecordDate;
            }
            if (updateModel.RecordedByUserId != null) {
                bloodGlucose.RecordedByUserId = updateModel.RecordedByUserId;
            }
            if (updateModel.TerraSummaryId != null) {
                bloodGlucose.TerraSummaryId = updateModel.TerraSummaryId;
            }
            if (updateModel.Provider != null) {
                bloodGlucose.Provider = updateModel.Provider;
            }

            await bloodGlucose.save();

            return await BloodGlucoseMapper.toDto(bloodGlucose);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {

            const result = await BloodGlucose.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getStats = async (patientUserId: uuid, numMonths: number): Promise<any> => {
        try {
            const records = await this.getRecords(patientUserId, numMonths);
            return records.map(x => {
                const dayStr = x.RecordDate.toISOString()
                    .split('T')[0];
                return {
                    BloodGlucose : x.BloodGlucose,
                    Unit         : x.Unit,
                    DayStr       : dayStr,
                };
            });
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private async getRecords(patientUserId: string, months: number) {
        const today = new Date();
        const from = TimeHelper.subtractDuration(new Date(), months, DurationType.Month);
        const result = await BloodGlucose.findAll({
            where : {
                PatientUserId : patientUserId,
                CreatedAt     : {
                    [Op.gte] : from,
                    [Op.lte] : today,
                }
            }
        });
        let records = result.map(x => {
            return {
                BloodGlucose : x.BloodGlucose,
                Unit         : x.Unit,
                RecordDate   : x.RecordDate,
            };
        });
        records = records.sort((a, b) => b.RecordDate.getTime() - a.RecordDate.getTime());
        return records;
    }

    getRecent = async (patientUserId: string): Promise<BloodGlucoseDto> => {
        try {
            const record = await BloodGlucose.findOne({
                where : {
                    PatientUserId : patientUserId,
                },
                order : [['RecordDate', 'DESC']]
            });
            return await BloodGlucoseMapper.toDto(record);
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

            let records = await BloodGlucose.findAll({
                where : {
                    PatientUserId : patientUserId,
                    BloodGlucose  : {
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
                    VitalName         : "BloodGlucose",
                    VitalPrimaryValue : x.BloodGlucose,
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

            let records = await BloodGlucose.findAll({
                where : {
                    PatientUserId : patientUserId,
                    BloodGlucose  : {
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
                    VitalName         : "BloodGlucose",
                    VitalPrimaryValue : x.BloodGlucose,
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

}
