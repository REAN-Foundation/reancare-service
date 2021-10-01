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
                Symptom         : model.Symptom,
                Description     : model.Description ?? null,
                Tags            : model.Tags && model.Tags.length > 0 ? JSON.stringify(model.Tags) : null,
                Language        : model.Language ?? 'en-US',
                ImageResourceId : model.ImageResourceId ?? null,
            };
            const symptom = await SymptomType.create(entity);
            return SymptomTypeMapper.toDto(symptom);
            
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<SymptomTypeDto> => {
        try {
            const symptomType = await SymptomType.findByPk(id);
            return SymptomTypeMapper.toDto(symptomType);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: SymptomTypeSearchFilters): Promise<SymptomTypeSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.Symptom != null) {
                search.where['Symptom'] = { [Op.like]: '%' + filters.Symptom + '%' };
            }
            if (filters.Tag != null) {
                search.where['Tags'] = { [Op.like]: '%' + filters.Tag + '%' };
            }

            let orderByColum = 'Symptom';
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

            const dtos: SymptomTypeDto[] = foundResults.rows.map(x => SymptomTypeMapper.toDto(x));

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
            const symptomType = await SymptomType.findByPk(id);

            if (model.Symptom != null) {
                symptomType.Symptom = model.Symptom;
            }
            if (model.Tags != null) {
                var existingTags = symptomType.Tags ? JSON.parse(symptomType.Tags) as Array<string> : [];
                existingTags.push(...model.Tags);
                existingTags = [...new Set(existingTags)];
                symptomType.Tags = JSON.stringify(existingTags);
            }
            if (model.Description != null) {
                symptomType.Description = model.Description;
            }
            if (model.Language != null) {
                symptomType.Language = model.Language;
            }
            if (model.ImageResourceId != null) {
                symptomType.ImageResourceId = model.ImageResourceId;
            }

            await symptomType.save();
            return SymptomTypeMapper.toDto(symptomType);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            var deleted = await SymptomType.destroy({ where: { id: id } });
            return deleted > 0;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    totalCount = async (): Promise<number> => {
        try {
            return await SymptomType.count();
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
