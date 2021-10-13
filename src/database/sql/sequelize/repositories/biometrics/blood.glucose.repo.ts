import { Op } from 'sequelize';
import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import { BloodGlucoseDomainModel } from "../../../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.domain.model";
import { BloodGlucoseDto } from "../../../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.dto";
import { BloodGlucoseSearchFilters, BloodGlucoseSearchResults } from "../../../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.search.types";
import { IBloodGlucoseRepo } from "../../../../repository.interfaces/clinical/biometrics/blood.glucose.repo.interface";
import { BloodGlucoseMapper } from "../../mappers/clinical/biometrics/blood.glucose.mapper";
import BloodGlucoseModel from "../../models/clinical/biometrics/blood.glucose.model";

///////////////////////////////////////////////////////////////////////

export class BloodGlucoseRepo implements IBloodGlucoseRepo {

    create = async (bloodGlucoseDomainModel: BloodGlucoseDomainModel):
    Promise<BloodGlucoseDto> => {
        try {
            const entity = {
                PatientUserId    : bloodGlucoseDomainModel.PatientUserId,
                BloodGlucose     : bloodGlucoseDomainModel.BloodGlucose,
                Unit             : bloodGlucoseDomainModel.Unit,
                RecordDate       : bloodGlucoseDomainModel.RecordDate,
                RecordedByUserId : bloodGlucoseDomainModel.RecordedByUserId,
            };

            const bloodGlucose = await BloodGlucoseModel.create(entity);
            const dto = await BloodGlucoseMapper.toDto(bloodGlucose);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<BloodGlucoseDto> => {
        try {
            const bloodGlucose = await BloodGlucoseModel.findByPk(id);
            const dto = await BloodGlucoseMapper.toDto(bloodGlucose);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: BloodGlucoseSearchFilters): Promise<BloodGlucoseSearchResults> => {
        try {

            Logger.instance().log(`Filters 2 , ${JSON.stringify(filters)}`);
            
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
            if (filters.RecordedByUserId !== null) {
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

            const foundResults = await BloodGlucoseModel.findAndCountAll(search);

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

    update = async (id: string, bloodGlucoseDomainModel: BloodGlucoseDomainModel):
    Promise<BloodGlucoseDto> => {
        try {
            const bloodGlucose = await BloodGlucoseModel.findByPk(id);

            if (bloodGlucoseDomainModel.PatientUserId != null) {
                bloodGlucose.PatientUserId = bloodGlucoseDomainModel.PatientUserId;
            }
            if (bloodGlucoseDomainModel.BloodGlucose != null) {
                bloodGlucose.BloodGlucose = bloodGlucoseDomainModel.BloodGlucose;
            }
            if (bloodGlucoseDomainModel.Unit != null) {
                bloodGlucose.Unit = bloodGlucoseDomainModel.Unit;
            }
            if (bloodGlucoseDomainModel.RecordDate != null) {
                bloodGlucose.RecordDate = bloodGlucoseDomainModel.RecordDate;
            }
            if (bloodGlucoseDomainModel.RecordedByUserId != null) {
                bloodGlucose.RecordedByUserId = bloodGlucoseDomainModel.RecordedByUserId;
            }
    
            await bloodGlucose.save();

            const dto = await BloodGlucoseMapper.toDto(bloodGlucose);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            Logger.instance().log(id);

            const result = await BloodGlucoseModel.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
