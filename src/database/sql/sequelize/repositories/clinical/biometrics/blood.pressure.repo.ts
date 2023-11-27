import { Op } from 'sequelize';
import { TimeHelper } from '../../../../../../common/time.helper';
import { uuid } from '../../../../../../domain.types/miscellaneous/system.types';
import { DurationType } from '../../../../../../domain.types/miscellaneous/time.types';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { BloodPressureDomainModel } from "../../../../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.domain.model";
import { BloodPressureDto } from "../../../../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.dto";
import { BloodPressureSearchFilters, BloodPressureSearchResults } from "../../../../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.search.types";
import { IBloodPressureRepo } from '../../../../../repository.interfaces/clinical/biometrics/blood.pressure.repo.interface';
import { BloodPressureMapper } from '../../../mappers/clinical/biometrics/blood.pressure.mapper';
import BloodPressure from '../../../models/clinical/biometrics/blood.pressure.model';
import { HelperRepo } from '../../common/helper.repo';

///////////////////////////////////////////////////////////////////////

export class BloodPressureRepo implements IBloodPressureRepo {

    create = async (createModel: BloodPressureDomainModel):
    Promise<BloodPressureDto> => {
        try {
            const entity = {
                PatientUserId    : createModel.PatientUserId,
                EhrId            : createModel.EhrId,
                TerraSummaryId   : createModel.TerraSummaryId,
                Provider         : createModel.Provider,
                Systolic         : createModel.Systolic,
                Diastolic        : createModel.Diastolic,
                Unit             : createModel.Unit,
                RecordDate       : createModel.RecordDate,
                RecordedByUserId : createModel.RecordedByUserId
            };

            const bloodPressure = await BloodPressure.create(entity);
            return await BloodPressureMapper.toDto(bloodPressure);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<BloodPressureDto> => {
        try {
            const bloodPressure = await BloodPressure.findByPk(id);
            return await BloodPressureMapper.toDto(bloodPressure);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: BloodPressureSearchFilters): Promise<BloodPressureSearchResults> => {
        try {

            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.MinSystolicValue != null && filters.MaxSystolicValue != null) {
                search.where['Systolic'] = {
                    [Op.gte] : filters.MinSystolicValue,
                    [Op.lte] : filters.MaxSystolicValue,
                };
            } else if (filters.MinSystolicValue === null && filters.MaxSystolicValue !== null) {
                search.where['Systolic'] = {
                    [Op.lte] : filters.MaxSystolicValue,
                };
            } else if (filters.MinSystolicValue !== null && filters.MaxSystolicValue === null) {
                search.where['Systolic'] = {
                    [Op.gte] : filters.MinSystolicValue,
                };
            }
            if (filters.MinDiastolicValue != null && filters.MaxDiastolicValue != null) {
                search.where['Diastolic'] = {
                    [Op.gte] : filters.MinDiastolicValue,
                    [Op.lte] : filters.MaxDiastolicValue,
                };
            } else if (filters.MinDiastolicValue === null && filters.MaxDiastolicValue !== null) {
                search.where['Diastolic'] = {
                    [Op.lte] : filters.MaxDiastolicValue,
                };
            } else if (filters.MinDiastolicValue !== null && filters.MaxDiastolicValue === null) {
                search.where['Diastolic'] = {
                    [Op.gte] : filters.MinDiastolicValue,
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

            const foundResults = await BloodPressure.findAndCountAll(search);

            const dtos: BloodPressureDto[] = [];
            for (const bloodPressure of foundResults.rows) {
                const dto = await BloodPressureMapper.toDto(bloodPressure);
                dtos.push(dto);
            }

            const searchResults: BloodPressureSearchResults = {
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

    update = async (id: string, updateModel: BloodPressureDomainModel):
    Promise<BloodPressureDto> => {
        try {
            const bloodPressure = await BloodPressure.findByPk(id);

            if (updateModel.PatientUserId != null) {
                bloodPressure.PatientUserId = updateModel.PatientUserId;
            }
            if (updateModel.Systolic != null) {
                bloodPressure.Systolic = updateModel.Systolic;
            }
            if (updateModel.Diastolic != null) {
                bloodPressure.Diastolic = updateModel.Diastolic;
            }
            if (updateModel.Unit != null) {
                bloodPressure.Unit = updateModel.Unit;
            }
            if (updateModel.RecordDate != null) {
                bloodPressure.RecordDate = updateModel.RecordDate;
            }
            if (updateModel.RecordedByUserId != null) {
                bloodPressure.RecordedByUserId = updateModel.RecordedByUserId;
            }
            if (updateModel.TerraSummaryId != null) {
                bloodPressure.TerraSummaryId = updateModel.TerraSummaryId;
            }
            if (updateModel.Provider != null) {
                bloodPressure.Provider = updateModel.Provider;
            }

            await bloodPressure.save();

            return await BloodPressureMapper.toDto(bloodPressure);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {

            const result = await BloodPressure.destroy({ where: { id: id } });
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
                const dayStr = x.CreatedAt.toISOString()
                    .split('T')[0];
                return {
                    Diastolic : x.Diastolic,
                    Systolic  : x.Systolic,
                    DayStr    : dayStr,
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
        const result = await BloodPressure.findAll({
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
                Diastolic : x.Diastolic,
                Systolic  : x.Systolic,
                CreatedAt : x.CreatedAt,
            };
        });
        records = records.sort((a, b) => b.CreatedAt.getTime() - a.CreatedAt.getTime());
        return records;
    }

    getRecent = async (patientUserId: string): Promise<BloodPressureDto> => {
        try {
            const record = await BloodPressure.findOne({
                where : {
                    PatientUserId : patientUserId,
                },
                order : [['RecordDate', 'DESC']]
            });
            return await BloodPressureMapper.toDto(record);
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

            let records = await BloodPressure.findAll({
                where : {
                    PatientUserId : patientUserId,
                    Systolic      : {
                        [Op.not] : null,
                    },
                    Diastolic : {
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
                    RecordId            : x.id,
                    PatientUserId       : x.PatientUserId,
                    VitalName           : "BloodPressure",
                    VitalPrimaryValue   : x.Systolic,
                    VitalSecondaryValue : x.Diastolic,
                    Unit                : x.Unit,
                    RecordDateStr       : await TimeHelper.formatDateToLocal_YYYY_MM_DD(x.RecordDate),
                    RecordDate          : tempDate,
                    RecordTimeZone      : currentTimeZone,
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

            let records = await BloodPressure.findAll({
                where : {
                    PatientUserId : patientUserId,
                    Systolic      : {
                        [Op.not] : null,
                    },
                    Diastolic : {
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
                    RecordId            : x.id,
                    PatientUserId       : x.PatientUserId,
                    VitalName           : "BloodPressure",
                    VitalPrimaryValue   : x.Systolic,
                    VitalSecondaryValue : x.Diastolic,
                    Unit                : x.Unit,
                    RecordDateStr       : await TimeHelper.formatDateToLocal_YYYY_MM_DD(x.RecordDate),
                    RecordDate          : tempDate,
                    RecordTimeZone      : currentTimeZone,
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
