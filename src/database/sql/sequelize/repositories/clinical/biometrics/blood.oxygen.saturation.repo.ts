import { Op } from 'sequelize';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { BloodOxygenSaturationDomainModel } from "../../../../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.domain.model";
import { BloodOxygenSaturationDto } from "../../../../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.dto";
import { BloodOxygenSaturationSearchFilters, BloodOxygenSaturationSearchResults } from "../../../../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.search.types";
import { IBloodOxygenSaturationRepo } from '../../../../../repository.interfaces/clinical/biometrics/blood.oxygen.saturation.repo.interface';
import { BloodOxygenSaturationMapper } from '../../../mappers/clinical/biometrics/blood.oxygen.saturation.mapper';
import BloodOxygenSaturationModel from '../../../models/clinical/biometrics/blood.oxygen.saturation.model';
import { HelperRepo } from '../../common/helper.repo';
import { TimeHelper } from '../../../../../../common/time.helper';
import { DurationType } from '../../../../../../domain.types/miscellaneous/time.types';

///////////////////////////////////////////////////////////////////////

export class BloodOxygenSaturationRepo implements IBloodOxygenSaturationRepo {

    create = async (createModel: BloodOxygenSaturationDomainModel):
    Promise<BloodOxygenSaturationDto> => {
        try {
            const entity = {
                PatientUserId         : createModel.PatientUserId,
                EhrId                 : createModel.EhrId,
                TerraSummaryId        : createModel.TerraSummaryId,
                Provider              : createModel.Provider,
                BloodOxygenSaturation : createModel.BloodOxygenSaturation,
                Unit                  : createModel.Unit,
                RecordDate            : createModel.RecordDate,
                RecordedByUserId      : createModel.RecordedByUserId
            };

            const bloodOxygenSaturation = await BloodOxygenSaturationModel.create(entity);
            return await BloodOxygenSaturationMapper.toDto(bloodOxygenSaturation);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<BloodOxygenSaturationDto> => {
        try {
            const bloodOxygenSaturation = await BloodOxygenSaturationModel.findByPk(id);
            return await BloodOxygenSaturationMapper.toDto(bloodOxygenSaturation);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: BloodOxygenSaturationSearchFilters): Promise<BloodOxygenSaturationSearchResults> => {
        try {

            Logger.instance().log(`Filters 2 , ${JSON.stringify(filters)}`);
            
            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.MinValue != null && filters.MaxValue != null) {
                search.where['BloodOxygenSaturation'] = {
                    [Op.gte] : filters.MinValue,
                    [Op.lte] : filters.MaxValue,
                };
            } else if (filters.MinValue === null && filters.MaxValue !== null) {
                search.where['BloodOxygenSaturation'] = {
                    [Op.lte] : filters.MaxValue,
                };
            } else if (filters.MinValue !== null && filters.MaxValue === null) {
                search.where['BloodOxygenSaturation'] = {
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

            const foundResults = await BloodOxygenSaturationModel.findAndCountAll(search);

            const dtos: BloodOxygenSaturationDto[] = [];
            for (const bloodOxygenSaturation of foundResults.rows) {
                const dto = await BloodOxygenSaturationMapper.toDto(bloodOxygenSaturation);
                dtos.push(dto);
            }

            const searchResults: BloodOxygenSaturationSearchResults = {
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

    update = async (id: string, updateModel: BloodOxygenSaturationDomainModel):
    Promise<BloodOxygenSaturationDto> => {
        try {
            const bloodOxygenSaturation = await BloodOxygenSaturationModel.findByPk(id);

            if (updateModel.PatientUserId != null) {
                bloodOxygenSaturation.PatientUserId = updateModel.PatientUserId;
            }
            if (updateModel.BloodOxygenSaturation != null) {
                bloodOxygenSaturation.BloodOxygenSaturation = updateModel.BloodOxygenSaturation;
            }
            if (updateModel.Unit != null) {
                bloodOxygenSaturation.Unit = updateModel.Unit;
            }
            if (updateModel.RecordDate != null) {
                bloodOxygenSaturation.RecordDate = updateModel.RecordDate;
            }
            if (updateModel.RecordedByUserId != null) {
                bloodOxygenSaturation.RecordedByUserId = updateModel.RecordedByUserId;
            }
            if (updateModel.TerraSummaryId != null) {
                bloodOxygenSaturation.TerraSummaryId = updateModel.TerraSummaryId;
            }
            if (updateModel.Provider != null) {
                bloodOxygenSaturation.Provider = updateModel.Provider;
            }
    
            await bloodOxygenSaturation.save();

            return await BloodOxygenSaturationMapper.toDto(bloodOxygenSaturation);
            
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            Logger.instance().log(id);

            const result = await BloodOxygenSaturationModel.destroy({ where: { id: id } });
            return result === 1;
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

            let records = await BloodOxygenSaturationModel.findAll({
                where : {
                    PatientUserId         : patientUserId,
                    BloodOxygenSaturation : {
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
                    VitalName         : "BloodOxygenSaturation",
                    VitalPrimaryValue : x.BloodOxygenSaturation,
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

            let records = await BloodOxygenSaturationModel.findAll({
                where : {
                    PatientUserId         : patientUserId,
                    BloodOxygenSaturation : {
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
                    VitalName         : "BloodOxygenSaturation",
                    VitalPrimaryValue : x.BloodOxygenSaturation,
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

    getRecent = async (patientUserId: string): Promise<BloodOxygenSaturationDto> => {
        try {
            const record = await BloodOxygenSaturationModel.findOne({
                where : {
                    PatientUserId : patientUserId,
                },
                order : [['RecordDate', 'DESC']]
            });
            return await BloodOxygenSaturationMapper.toDto(record);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
