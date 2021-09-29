import { IDrugRepo } from '../../../../repository.interfaces/medication/drug.repo.interface';
import DrugModel  from '../../models/clinical/medication/drug.model';
import { DrugMapper } from '../../mappers/medication/drug.mapper';
import { Logger } from '../../../../../common/logger';
import { ApiError } from '../../../../../common/api.error';
import { DrugDomainModel } from "../../../../../domain.types/clinical/medication/drug/drug.domain.model";
import { DrugDto } from "../../../../../domain.types/clinical/medication/drug/drug.dto";
import { DrugSearchFilters, DrugSearchResults } from "../../../../../domain.types/clinical/medication/drug/drug.search.types";

///////////////////////////////////////////////////////////////////////

export class DrugRepo implements IDrugRepo {

    create = async (drugDomainModel: DrugDomainModel):
    Promise<DrugDto> => {
        try {
            const entity = {
                DrugName             : drugDomainModel.DrugName,
                GenericName          : drugDomainModel.GenericName,
                Ingredients          : drugDomainModel.Ingredients,
                Strength             : drugDomainModel.Strength,
                OtherCommercialNames : drugDomainModel.OtherCommercialNames,
                Manufacturer         : drugDomainModel.Manufacturer,
                OtherInformation     : drugDomainModel.OtherInformation
            };

            const drug = await DrugModel.create(entity);
            const dto = await DrugMapper.toDto(drug);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<DrugDto> => {
        try {
            const drug = await DrugModel.findByPk(id);
            const dto = await DrugMapper.toDto(drug);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: DrugSearchFilters): Promise<DrugSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.Name != null) {
                search.where['DrugName'] = filters.Name;
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

            const foundResults = await DrugModel.findAndCountAll(search);

            const dtos: DrugDto[] = [];
            for (const drug of foundResults.rows) {
                const dto = await DrugMapper.toDto(drug);
                dtos.push(dto);
            }

            const searchResults: DrugSearchResults = {
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

    update = async (id: string, drugDomainModel: DrugDomainModel):
    Promise<DrugDto> => {
        try {
            const drug = await DrugModel.findByPk(id);

            if (drugDomainModel.DrugName != null) {
                drug.DrugName = drugDomainModel.DrugName;
            }
            if (drugDomainModel.GenericName != null) {
                drug.GenericName = drugDomainModel.GenericName;
            }
            if (drugDomainModel.Ingredients != null) {
                drug.Ingredients = drugDomainModel.Ingredients;
            }
            if (drugDomainModel.Strength != null) {
                drug.Strength = drugDomainModel.Strength;
            }
            if (drugDomainModel.OtherCommercialNames != null) {
                drug.OtherCommercialNames = drugDomainModel.OtherCommercialNames;
            }
            if (drugDomainModel.Manufacturer != null) {
                drug.Manufacturer = drugDomainModel.Manufacturer;
            }
            if (drugDomainModel.OtherInformation != null) {
                drug.OtherInformation = drugDomainModel.OtherInformation;
            }
    
            await drug.save();

            const dto = await DrugMapper.toDto(drug);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            Logger.instance().log(id);

            const result = await DrugModel.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
