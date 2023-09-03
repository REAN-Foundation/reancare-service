import { Op } from 'sequelize';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { DrugDomainModel } from "../../../../../../domain.types/clinical/medication/drug/drug.domain.model";
import { DrugDto } from "../../../../../../domain.types/clinical/medication/drug/drug.dto";
import { DrugSearchFilters, DrugSearchResults } from "../../../../../../domain.types/clinical/medication/drug/drug.search.types";
import { IDrugRepo } from '../../../../../repository.interfaces/clinical/medication/drug.repo.interface';
import { DrugMapper } from '../../../mappers/clinical/medication/drug.mapper';
import Drug from '../../../models/clinical/medication/drug.model';

///////////////////////////////////////////////////////////////////////

export class DrugRepo implements IDrugRepo {

    totalCount = async (): Promise<number> => {
        try {
            return await Drug.count();
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    create = async (createModel: DrugDomainModel):
    Promise<DrugDto> => {
        try {
            const entity = {
                DrugName             : createModel.DrugName,
                GenericName          : createModel.GenericName,
                Ingredients          : createModel.Ingredients,
                Strength             : createModel.Strength,
                OtherCommercialNames : createModel.OtherCommercialNames,
                Manufacturer         : createModel.Manufacturer,
                OtherInformation     : createModel.OtherInformation
            };

            const drug = await Drug.create(entity);
            return await DrugMapper.toDto(drug);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<DrugDto> => {
        try {
            const drug = await Drug.findByPk(id);
            return await DrugMapper.toDto(drug);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByName = async (drugName: string): Promise<DrugDto> => {
        try {
            const drug = await Drug.findOne({
                where : {
                    DrugName : { [Op.like]: '%' + drugName + '%' }
                }
            });
            return await DrugMapper.toDto(drug);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: DrugSearchFilters): Promise<DrugSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.Name != null) {
                search.where['DrugName'] = { [Op.like]: '%' + filters.Name + '%' };
            }
            if (filters.GenericName != null) {
                search.where['GenericName'] = { [Op.like]: '%' + filters.GenericName + '%' };
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

            const foundResults = await Drug.findAndCountAll(search);

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

    update = async (id: string, updateModel: DrugDomainModel):
    Promise<DrugDto> => {
        try {
            const drug = await Drug.findByPk(id);

            if (updateModel.DrugName != null) {
                drug.DrugName = updateModel.DrugName;
            }
            if (updateModel.GenericName != null) {
                drug.GenericName = updateModel.GenericName;
            }
            if (updateModel.Ingredients != null) {
                drug.Ingredients = updateModel.Ingredients;
            }
            if (updateModel.Strength != null) {
                drug.Strength = updateModel.Strength;
            }
            if (updateModel.OtherCommercialNames != null) {
                drug.OtherCommercialNames = updateModel.OtherCommercialNames;
            }
            if (updateModel.Manufacturer != null) {
                drug.Manufacturer = updateModel.Manufacturer;
            }
            if (updateModel.OtherInformation != null) {
                drug.OtherInformation = updateModel.OtherInformation;
            }
    
            await drug.save();

            return await DrugMapper.toDto(drug);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            
            const result = await Drug.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
