import { ISymptomTypeRepo } from '../../../../../repository.interfaces/clinical/symptom/symptom.type.repo.interface';
import SymptomType from '../../../models/clinical/symptom/symptom.type.model';
import { Op } from 'sequelize';
import { SymptomTypeMapper } from '../../../mappers/clinical/symptom/symptom.type.mapper';
import { Logger } from '../../../../../../common/logger';
import { ApiError } from '../../../../../../common/api.error';
import { SymptomTypeDomainModel } from '../../../../../../domain.types/clinical/symptom/symptom.type/symptom.type.domain.model';
import { SymptomTypeDto } from '../../../../../../domain.types/clinical/symptom/symptom.type/symptom.type.dto';
import { SymptomTypeSearchFilters, SymptomTypeSearchResults } from '../../../../../../domain.types/clinical/symptom/symptom.type/symptom.type.search.types';

///////////////////////////////////////////////////////////////////////

export class SymptomTypeRepo implements ISymptomTypeRepo {

    create = async (model: SymptomTypeDomainModel): Promise<SymptomTypeDto> => {
        try {
            const entity = {
                Type        : model.Type,
                SymptomTypeLine : model.SymptomTypeLine ?? null,
                City        : model.City ?? null,
                District    : model.District ?? null,
                State       : model.State ?? null,
                Country     : model.Country ?? null,
                PostalCode  : model.PostalCode ?? null,
                Longitude   : model.Longitude ?? null,
                Lattitude   : model.Lattitude ?? null,
            };
            const symptom = await SymptomType.create(entity);
            const dto = await SymptomTypeMapper.toDto(symptom);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<SymptomTypeDto> => {
        try {
            const symptom = await SymptomType.findByPk(id);
            const dto = await SymptomTypeMapper.toDto(symptom);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: SymptomTypeSearchFilters): Promise<SymptomTypeSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.Type != null) {
                search.where['Type'] = { [Op.like]: '%' + filters.Type + '%' };
            }
            if (filters.SymptomTypeLine != null) {
                search.where['SymptomTypeLine'] = { [Op.like]: '%' + filters.SymptomTypeLine + '%' };
            }
            if (filters.City != null) {
                search.where['City'] = { [Op.like]: '%' + filters.City + '%' };
            }
            if (filters.District != null) {
                search.where['District'] = { [Op.like]: '%' + filters.District + '%' };
            }
            if (filters.State != null) {
                search.where['State'] = { [Op.like]: '%' + filters.State + '%' };
            }
            if (filters.Country != null) {
                search.where['Country'] = { [Op.like]: '%' + filters.Country + '%' };
            }
            if (filters.PostalCode != null) {
                search.where['PostalCode'] = { [Op.like]: '%' + filters.PostalCode + '%' };
            }
            if (filters.LongitudeFrom != null && filters.LongitudeTo != null) {
                search.where['Longitude'] = {
                    [Op.gte] : filters.LongitudeFrom,
                    [Op.lte] : filters.LongitudeTo,
                };
            }
            if (filters.LattitudeFrom != null && filters.LattitudeTo != null) {
                search.where['Lattitude'] = {
                    [Op.gte] : filters.LattitudeFrom,
                    [Op.lte] : filters.LattitudeTo,
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
            if (filters.PostalCode !== null) {
                search.where['PostalCode'] = { [Op.like]: '%' + filters.PostalCode + '%' };
            }

            let orderByColum = 'SymptomTypeLine';
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

            const foundResults = await SymptomType.findAndCountAll(search);

            const dtos: SymptomTypeDto[] = [];
            for (const symptom of foundResults.rows) {
                const dto = await SymptomTypeMapper.toDto(symptom);
                dtos.push(dto);
            }

            const searchResults: SymptomTypeSearchResults = {
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

    update = async (id: string, model: SymptomTypeDomainModel): Promise<SymptomTypeDto> => {
        try {
            const symptom = await SymptomType.findByPk(id);

            if (model.Type != null) {
                symptom.Type = model.Type;
            }
            if (model.SymptomTypeLine != null) {
                symptom.SymptomTypeLine = model.SymptomTypeLine;
            }
            if (model.City != null) {
                symptom.City = model.City;
            }
            if (model.District != null) {
                symptom.District = model.District;
            }
            if (model.State != null) {
                symptom.State = model.State;
            }
            if (model.Country != null) {
                symptom.Country = model.Country;
            }
            if (model.PostalCode != null) {
                symptom.PostalCode = model.PostalCode;
            }
            if (model.Longitude != null) {
                symptom.Longitude = model.Longitude;
            }
            if (model.Lattitude != null) {
                symptom.Lattitude = model.Lattitude;
            }
            await symptom.save();

            const dto = await SymptomTypeMapper.toDto(symptom);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            await SymptomType.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
