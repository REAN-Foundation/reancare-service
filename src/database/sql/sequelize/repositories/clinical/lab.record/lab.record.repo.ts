import { Logger } from '../../../../../../common/logger';
import { ApiError } from '../../../../../../common/api.error';
import { Op } from 'sequelize';
import { ILabRecordRepo } from '../../../../../../database/repository.interfaces/clinical/lab.record/lab.record.interface';
import { LabRecordDomainModel } from '../../../../../../domain.types/clinical/lab.record/lab.record/lab.record.domain.model';
import { LabRecordDto } from '../../../../../../domain.types/clinical/lab.record/lab.record/lab.record.dto';
import { LabRecordTypeDto } from '../../../../../../domain.types/clinical/lab.record/lab.recod.type/lab.record.type.dto';
import { LabRecordTypeDomainModel } from '../../../../../../domain.types/clinical/lab.record/lab.recod.type/lab.record.type.domain.model';
import { LabRecordSearchFilters } from '../../../../../../domain.types/clinical/lab.record/lab.record/lab.record.search.types';
import { LabRecordSearchResults } from '../../../../../../domain.types/clinical/lab.record/lab.record/lab.record.search.types';
import LabRecordType from '../../../models/clinical/lab.record/lab.record.type.model';
import LabRecord from '../../../models/clinical/lab.record/lab.record.model';
import { LabRecordMapper } from '../../../mappers/clinical/lab.record/lab.record.mapper';
import { LabRecordTypeMapper } from '../../../mappers/clinical/lab.record/lab.record.type.mapper';
import { uuid } from '../../../../../../domain.types/miscellaneous/system.types';
import { TimeHelper } from '../../../../../../common/time.helper';
import { DurationType } from '../../../../../../domain.types/miscellaneous/time.types';
import { LabRecordTypeSearchFilters, LabRecordTypeSearchResults }
    from '../../../../../../domain.types/clinical/lab.record/lab.recod.type/lab.record.type.search.types';

///////////////////////////////////////////////////////////////////////

export class LabRecordRepo implements ILabRecordRepo {

    create = async (createModel: LabRecordDomainModel): Promise<LabRecordDto> => {
        try {
            const entity = {
                PatientUserId  : createModel.PatientUserId,
                EhrId          : createModel.EhrId ?? null,
                TypeId         : createModel.TypeId,
                TypeName       : createModel.TypeName,
                DisplayName    : createModel.DisplayName,
                PrimaryValue   : createModel.PrimaryValue,
                SecondaryValue : createModel.SecondaryValue ?? null,
                Unit           : createModel.Unit,
                ReportId       : createModel.ReportId ?? null,
                OrderId        : createModel.OrderId ?? null,
                RecordedAt     : createModel.RecordedAt
            };
            const labRecord = await LabRecord.create(entity);
            return await LabRecordMapper.toDto(labRecord);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getLabRecordTypes = async (displayName?: string): Promise<LabRecordTypeDto[]> => {
        try {
            const filter = { where: {} };
            if (displayName != null) {
                filter.where['DisplayName'] = { [Op.like]: '%' + displayName + '%' };
            }

            const labRecordTypes = await LabRecordType.findAll(filter);
            const dtos: LabRecordTypeDto[] = [];
            for (const labRecordType of labRecordTypes) {
                const dto = LabRecordTypeMapper.toTypeDto(labRecordType);
                dtos.push(dto);
            }

            return dtos;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<LabRecordDto> => {
        try {
            const priority = await LabRecord.findByPk(id);
            return await LabRecordMapper.toDto(priority);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    createType = async (model: LabRecordTypeDomainModel): Promise<LabRecordTypeDto> => {
        try {
            const entity = {
                TypeName       : model.TypeName,
                DisplayName    : model.DisplayName,
                SnowmedCode    : model.SnowmedCode,
                LoincCode      : model.LoincCode,
                NormalRangeMin : model.NormalRangeMin,
                NormalRangeMax : model.NormalRangeMax,
                Unit           : model.Unit,

            };
            const labRecordType = await LabRecordType.create(entity);
            return await LabRecordTypeMapper.toTypeDto(labRecordType);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getTypeByDisplayName = async (displayName: any): Promise<any> => {
        try {
            const labRecordType = await LabRecordType.findOne({
                where : {
                    DisplayName : displayName
                }
            });
            return await LabRecordTypeMapper.toTypeDto(labRecordType);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: LabRecordSearchFilters): Promise<LabRecordSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.TypeName != null) {
                search.where['TypeName'] = { [Op.like]: '%' + filters.TypeName + '%' };
            }
            if (filters.DisplayName != null) {
                search.where['DisplayName'] = filters.DisplayName;
            }
            if (filters.TypeId != null) {
                search.where['TypeId'] = filters.TypeId;
            }
            if (filters.DateFrom != null && filters.DateTo != null) {
                search.where['CreatedAt'] = {
                    [Op.gte] : filters.DateFrom,
                    [Op.lte] : filters.DateTo,
                };
            } else if (filters.DateFrom === null && filters.DateTo !== null) {
                search.where['CreatedAt'] = {
                    [Op.lte] : filters.DateTo,
                };
            } else if (filters.DateFrom !== null && filters.DateTo === null) {
                search.where['CreatedAt'] = {
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

            const foundResults = await LabRecord.findAndCountAll(search);
            const dtos: LabRecordDto[] = [];
            for (const labRecord of foundResults.rows) {
                const dto = await LabRecordMapper.toDto(labRecord);
                dtos.push(dto);
            }

            const searchResults: LabRecordSearchResults = {
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

    searchType = async (filters: LabRecordTypeSearchFilters): Promise<LabRecordTypeSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.DisplayName != null) {
                search.where['DisplayName'] = filters.DisplayName;
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

            const foundResults = await LabRecordType.findAndCountAll(search);
            const dtos: LabRecordTypeDto[] = [];
            for (const labRecord of foundResults.rows) {
                const dto = await LabRecordMapper.toTypeDto(labRecord);
                dtos.push(dto);
            }

            const searchResults: LabRecordTypeSearchResults = {
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

    update = async (id: string, updateModel: LabRecordDomainModel): Promise<LabRecordDto> => {
        try {
            const labReport = await LabRecord.findByPk(id);

            if (updateModel.PatientUserId != null) {
                labReport.PatientUserId = updateModel.PatientUserId;
            }
            if (updateModel.TypeName != null) {
                labReport.TypeName = updateModel.TypeName;
            }
            if (updateModel.DisplayName != null) {
                labReport.DisplayName = updateModel.DisplayName;
            }
            if (updateModel.TypeId != null) {
                labReport.TypeId = updateModel.TypeId;
            }
            if (updateModel.PrimaryValue != null) {
                labReport.PrimaryValue = updateModel.PrimaryValue;
            }
            if (updateModel.SecondaryValue != null) {
                labReport.SecondaryValue = updateModel.SecondaryValue;
            }
            if (updateModel.Unit != null) {
                labReport.Unit = updateModel.Unit;
            }
            if (updateModel.ReportId != null) {
                labReport.ReportId = updateModel.ReportId;
            }
            if (updateModel.OrderId != null) {
                labReport.OrderId = updateModel.OrderId;
            }

            await labReport.save();

            return await LabRecordMapper.toDto(labReport);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {

            const result = await LabRecord.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    totalTypesCount = async (): Promise<number> => {
        try {
            return await LabRecordType.count();
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getStats = async (patientUserId: uuid, numMonths: number): Promise<any> => {
        try {
            const records = await this.getRecords(patientUserId, numMonths);
            const records_ = records.map(x => {
                const dayStr = x.RecordedAt.toISOString()
                    .split('T')[0];
                return {
                    TypeName     : x.TypeName,
                    DisplayName  : x.DisplayName,
                    PrimaryValue : x.PrimaryValue,
                    Unit         : x.Unit,
                    DayStr       : dayStr,
                };
            });
            return {
                TotalCholesterol  : records_.filter(x => x.DisplayName === 'Total Cholesterol'),
                HDL               : records_.filter(x => x.DisplayName === 'HDL'),
                LDL               : records_.filter(x => x.DisplayName === 'LDL'),
                TriglycerideLevel : records_.filter(x => x.DisplayName === 'Triglyceride Level'),
                A1CLevel          : records_.filter(x => x.DisplayName === 'A1C Level'),
                Lipoprotein       : records_.filter(x => x.DisplayName === 'Lipoprotein'),
            };
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getLabRecordTypeById = async (id: string): Promise<LabRecordTypeDto> => {
        try {
            const labRecordType = await LabRecordType.findByPk(id);
            return await LabRecordMapper.toTypeDto(labRecordType);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    updateLabRecordType = async (id: string, updateModel: LabRecordTypeDomainModel): Promise<LabRecordTypeDto> => {
        try {
            const labRecordType = await LabRecordType.findByPk(id);

            if (updateModel.TypeName != null) {
                labRecordType.TypeName = updateModel.TypeName;
            }
            if (updateModel.DisplayName != null) {
                labRecordType.DisplayName = updateModel.DisplayName;
            }
            if (updateModel.SnowmedCode != null) {
                labRecordType.SnowmedCode = updateModel.SnowmedCode;
            }
            if (updateModel.LoincCode  != null) {
                labRecordType.LoincCode  = updateModel.LoincCode ;
            }
            if (updateModel.NormalRangeMin  != null) {
                labRecordType.NormalRangeMin  = updateModel.NormalRangeMin ;
            }
            if (updateModel.NormalRangeMax != null) {
                labRecordType.NormalRangeMax = updateModel.NormalRangeMax;
            }
            if (updateModel.Unit != null) {
                labRecordType.Unit  = updateModel.Unit ;
            }

            await labRecordType.save();

            return await LabRecordMapper.toTypeDto(labRecordType);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    deleteLabRecordType = async (id: string): Promise<boolean> => {
        try {

            const result = await LabRecordType.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getRecords = async (patientUserId: string, months: number): Promise<any> => {
        const today = new Date();
        const from = TimeHelper.subtractDuration(new Date(), months, DurationType.Month);
        const records = await LabRecord.findAll({
            where : {
                PatientUserId : patientUserId,
                CreatedAt     : {
                    [Op.gte] : from,
                    [Op.lte] : today,
                }
            }
        });
        return records.sort((a, b) => b.RecordedAt.getTime() - a.RecordedAt.getTime());
    };

    getRecent = async (patientUserId: string, displayName: string): Promise<LabRecordDto> => {
        try {
            const record = await LabRecord.findOne({
                where : {
                    PatientUserId : patientUserId,
                    DisplayName   : displayName,
                },
                order : [['RecordedAt', 'DESC']]
            });
            return LabRecordMapper.toDto(record);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
