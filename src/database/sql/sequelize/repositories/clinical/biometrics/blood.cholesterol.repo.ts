import { Op } from 'sequelize';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { BloodCholesterolDomainModel } from "../../../../../../domain.types/clinical/biometrics/blood.cholesterol/blood.cholesterol.domain.model";
import { BloodCholesterolDto } from "../../../../../../domain.types/clinical/biometrics/blood.cholesterol/blood.cholesterol.dto";
import { BloodCholesterolSearchFilters,
    BloodCholesterolSearchResults
} from "../../../../../../domain.types/clinical/biometrics/blood.cholesterol/blood.cholesterol.search.types";
import { IBloodCholesterolRepo } from '../../../../../repository.interfaces/clinical/biometrics/blood.cholesterol.repo.interface';
import { BloodCholesterolMapper } from '../../../mappers/clinical/biometrics/blood.cholesterol.mapper';
import BloodCholesterolModel from '../../../models/clinical/biometrics/blood.cholesterol.model';

///////////////////////////////////////////////////////////////////////

export class BloodCholesterolRepo implements IBloodCholesterolRepo {

    create = async (createModel: BloodCholesterolDomainModel):
    Promise<BloodCholesterolDto> => {
        try {
            const entity = {
                PatientUserId     : createModel.PatientUserId,
                EhrId             : createModel.EhrId,
                TotalCholesterol  : createModel.TotalCholesterol,
                HDL               : createModel.HDL,
                LDL               : createModel.LDL,
                TriglycerideLevel : createModel.TriglycerideLevel,
                Ratio             : createModel.Ratio,
                A1CLevel          : createModel.A1CLevel,
                Unit              : createModel.Unit,
                RecordDate        : createModel.RecordDate,
                RecordedByUserId  : createModel.RecordedByUserId
            };

            const bloodCholesterol = await BloodCholesterolModel.create(entity);
            return await BloodCholesterolMapper.toDto(bloodCholesterol);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<BloodCholesterolDto> => {
        try {
            const bloodCholesterol = await BloodCholesterolModel.findByPk(id);
            return await BloodCholesterolMapper.toDto(bloodCholesterol);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: BloodCholesterolSearchFilters): Promise<BloodCholesterolSearchResults> => {
        try {

            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.MinTotalCholesterol != null && filters.MaxTotalCholesterol != null) {
                search.where['TotalCholesterol'] = {
                    [Op.gte] : filters.MinTotalCholesterol,
                    [Op.lte] : filters.MaxTotalCholesterol,
                };
            } else if (filters.MinTotalCholesterol === null && filters.MaxTotalCholesterol !== null) {
                search.where['TotalCholesterol'] = {
                    [Op.lte] : filters.MaxTotalCholesterol,
                };
            } else if (filters.MinTotalCholesterol !== null && filters.MaxTotalCholesterol === null) {
                search.where['TotalCholesterol'] = {
                    [Op.gte] : filters.MinTotalCholesterol,
                };
            }
            if (filters.MinRatio != null && filters.MaxRatio != null) {
                search.where['Ratio'] = {
                    [Op.gte] : filters.MinRatio,
                    [Op.lte] : filters.MaxRatio,
                };
            } else if (filters.MinRatio === null && filters.MaxRatio !== null) {
                search.where['Ratio'] = {
                    [Op.lte] : filters.MaxRatio,
                };
            } else if (filters.MinRatio !== null && filters.MaxRatio === null) {
                search.where['Ratio'] = {
                    [Op.gte] : filters.MinRatio,
                };
            }
            if (filters.MinHDL != null && filters.MaxHDL != null) {
                search.where['HDL'] = {
                    [Op.gte] : filters.MinHDL,
                    [Op.lte] : filters.MaxHDL,
                };
            } else if (filters.MinHDL === null && filters.MaxHDL !== null) {
                search.where['HDL'] = {
                    [Op.lte] : filters.MaxHDL,
                };
            } else if (filters.MinHDL !== null && filters.MaxHDL === null) {
                search.where['HDL'] = {
                    [Op.gte] : filters.MinHDL,
                };
            }
            if (filters.MinLDL != null && filters.MaxLDL != null) {
                search.where['LDL'] = {
                    [Op.gte] : filters.MinLDL,
                    [Op.lte] : filters.MaxLDL,
                };
            } else if (filters.MinLDL === null && filters.MaxLDL !== null) {
                search.where['LDL'] = {
                    [Op.lte] : filters.MaxLDL,
                };
            } else if (filters.MinLDL !== null && filters.MaxLDL === null) {
                search.where['LDL'] = {
                    [Op.gte] : filters.MinLDL,
                };
            }
            if (filters.MinA1CLevel != null && filters.MaxA1CLevel != null) {
                search.where['A1CLevel'] = {
                    [Op.gte] : filters.MinA1CLevel,
                    [Op.lte] : filters.MaxA1CLevel,
                };
            } else if (filters.MinA1CLevel === null && filters.MaxA1CLevel !== null) {
                search.where['A1CLevel'] = {
                    [Op.lte] : filters.MaxA1CLevel,
                };
            } else if (filters.MinA1CLevel !== null && filters.MaxA1CLevel === null) {
                search.where['A1CLevel'] = {
                    [Op.gte] : filters.MinA1CLevel,
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

            const foundResults = await BloodCholesterolModel.findAndCountAll(search);

            const dtos: BloodCholesterolDto[] = [];
            for (const bloodCholesterol of foundResults.rows) {
                const dto = await BloodCholesterolMapper.toDto(bloodCholesterol);
                dtos.push(dto);
            }

            const searchResults: BloodCholesterolSearchResults = {
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

    update = async (id: string, updateModel: BloodCholesterolDomainModel):
    Promise<BloodCholesterolDto> => {
        try {
            const bloodCholesterol = await BloodCholesterolModel.findByPk(id);

            if (updateModel.PatientUserId != null) {
                bloodCholesterol.PatientUserId = updateModel.PatientUserId;
            }
            if (updateModel.TotalCholesterol != null) {
                bloodCholesterol.TotalCholesterol = updateModel.TotalCholesterol;
            }
            if (updateModel.HDL != null) {
                bloodCholesterol.HDL = updateModel.HDL;
            }
            if (updateModel.LDL != null) {
                bloodCholesterol.LDL = updateModel.LDL;
            }
            if (updateModel.TriglycerideLevel != null) {
                bloodCholesterol.TriglycerideLevel = updateModel.TriglycerideLevel;
            }
            if (updateModel.Ratio != null) {
                bloodCholesterol.Ratio = updateModel.Ratio;
            }
            if (updateModel.A1CLevel != null) {
                bloodCholesterol.A1CLevel = updateModel.A1CLevel;
            }
            if (updateModel.Unit != null) {
                bloodCholesterol.Unit = updateModel.Unit;
            }
            if (updateModel.RecordDate != null) {
                bloodCholesterol.RecordDate = updateModel.RecordDate;
            }
            if (updateModel.RecordedByUserId != null) {
                bloodCholesterol.RecordedByUserId = updateModel.RecordedByUserId;
            }
    
            await bloodCholesterol.save();

            return await BloodCholesterolMapper.toDto(bloodCholesterol);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {

            const result = await BloodCholesterolModel.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
