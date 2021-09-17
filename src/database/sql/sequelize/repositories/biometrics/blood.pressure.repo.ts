import { IBloodPressureRepo } from '../../../../repository.interfaces/biometrics/blood.pressure.repo.interface';
import BloodPressureModel from '../../models/biometrics/blood.pressure.model';
import { Op } from 'sequelize';
import { BloodPressureMapper } from '../../mappers/biometrics/blood.pressure.mapper';
import { Logger } from '../../../../../common/logger';
import { ApiError } from '../../../../../common/api.error';
import { BloodPressureDomainModel } from "../../../../../domain.types/biometrics/blood.pressure/blood.pressure.domain.model";
import { BloodPressureDto } from "../../../../../domain.types/biometrics/blood.pressure/blood.pressure.dto";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BloodPressureSearchFilters, BloodPressureSearchResults } from "../../../../../domain.types/biometrics/blood.pressure/blood.pressure.search.types";

///////////////////////////////////////////////////////////////////////

export class BloodPressureRepo implements IBloodPressureRepo {

    create = async (bloodPressureDomainModel: BloodPressureDomainModel):
    Promise<BloodPressureDto> => {
        try {
            const entity = {
                PatientUserId    : bloodPressureDomainModel.PatientUserId,
                Systolic         : bloodPressureDomainModel.Systolic,
                Diastolic        : bloodPressureDomainModel.Diastolic,
                Unit             : bloodPressureDomainModel.Unit,
                RecordDate       : bloodPressureDomainModel.RecordDate,
                RecordedByUserId : bloodPressureDomainModel.RecordedByUserId
            };

            const bloodPressure = await BloodPressureModel.create(entity);
            const dto = await BloodPressureMapper.toDto(bloodPressure);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<BloodPressureDto> => {
        try {
            const bloodPressure = await BloodPressureModel.findByPk(id);
            const dto = await BloodPressureMapper.toDto(bloodPressure);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: BloodPressureSearchFilters): Promise<BloodPressureSearchResults> => {
        try {

            Logger.instance().log(`Filters 2 , ${JSON.stringify(filters)}`);
            
            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.MinSystolicValue != null && filters.MaxSystolicValue != null) {
                search.where['BloodPressure'] = {
                    [Op.gte] : filters.MinSystolicValue,
                    [Op.lte] : filters.MaxSystolicValue,
                };
            } else if (filters.MinSystolicValue === null && filters.MaxSystolicValue !== null) {
                search.where['BloodPressure'] = {
                    [Op.lte] : filters.MaxSystolicValue,
                };
            } else if (filters.MinSystolicValue !== null && filters.MaxSystolicValue === null) {
                search.where['BloodPressure'] = {
                    [Op.gte] : filters.MinSystolicValue,
                };
            }
            if (filters.MinDiastolicValue != null && filters.MaxDiastolicValue != null) {
                search.where['BloodPressure'] = {
                    [Op.gte] : filters.MinDiastolicValue,
                    [Op.lte] : filters.MaxDiastolicValue,
                };
            } else if (filters.MinDiastolicValue === null && filters.MaxDiastolicValue !== null) {
                search.where['BloodPressure'] = {
                    [Op.lte] : filters.MaxDiastolicValue,
                };
            } else if (filters.MinDiastolicValue !== null && filters.MaxDiastolicValue === null) {
                search.where['BloodPressure'] = {
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

            const foundResults = await BloodPressureModel.findAndCountAll(search);

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

    update = async (id: string, bloodPressureDomainModel: BloodPressureDomainModel):
    Promise<BloodPressureDto> => {
        try {
            const bloodPressure = await BloodPressureModel.findByPk(id);

            if (bloodPressureDomainModel.PatientUserId != null) {
                bloodPressure.PatientUserId = bloodPressureDomainModel.PatientUserId;
            }
            if (bloodPressureDomainModel.Systolic != null) {
                bloodPressure.Systolic = bloodPressureDomainModel.Systolic;
            }
            if (bloodPressure.Diastolic != null) {
                bloodPressure.Diastolic = bloodPressureDomainModel.Diastolic;
            }
            if (bloodPressureDomainModel.Unit != null) {
                bloodPressure.Unit = bloodPressureDomainModel.Unit;
            }
            if (bloodPressureDomainModel.RecordDate != null) {
                bloodPressure.RecordDate = bloodPressureDomainModel.RecordDate;
            }
            if (bloodPressureDomainModel.RecordedByUserId != null) {
                bloodPressure.RecordedByUserId = bloodPressureDomainModel.RecordedByUserId;
            }
    
            await bloodPressure.save();

            const dto = await BloodPressureMapper.toDto(bloodPressure);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            Logger.instance().log(id);

            const result = await BloodPressureModel.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
