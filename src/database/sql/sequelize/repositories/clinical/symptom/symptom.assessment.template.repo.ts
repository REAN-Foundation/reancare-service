import { ISymptomAssessmentTemplateRepo } from '../../../../../repository.interfaces/clinical/symptom/symptom.assessment.template.repo.interface';
import SymptomAssessmentTemplate from '../../../models/clinical/symptom/symptom.assessment.template.model';
import { Op } from 'sequelize';
import { SymptomAssessmentTemplateMapper } from '../../../mappers/clinical/symptom/symptom.assessment.template.mapper';
import { Logger } from '../../../../../../common/logger';
import { ApiError } from '../../../../../../common/api.error';
import { SymptomAssessmentTemplateDomainModel } from '../../../../../../domain.types/clinical/symptom/symptom.assessment.template/symptom.assessment.template.domain.model';
import { SymptomAssessmentTemplateDto } from '../../../../../../domain.types/clinical/symptom/symptom.assessment.template/symptom.assessment.template.dto';
import { SymptomAssessmentTemplateSearchFilters, SymptomAssessmentTemplateSearchResults } from '../../../../../../domain.types/clinical/symptom/symptom.assessment.template/symptom.assessment.template.search.types';

///////////////////////////////////////////////////////////////////////

export class SymptomAssessmentTemplateRepo implements ISymptomAssessmentTemplateRepo {

    create = async (model: SymptomAssessmentTemplateDomainModel): Promise<SymptomAssessmentTemplateDto> => {
        try {
            const entity = {
                Type                          : model.Type,
                SymptomAssessmentTemplateLine : model.SymptomAssessmentTemplateLine ?? null,
                City                          : model.City ?? null,
                District                      : model.District ?? null,
                State                         : model.State ?? null,
                Country                       : model.Country ?? null,
                PostalCode                    : model.PostalCode ?? null,
                Longitude                     : model.Longitude ?? null,
                Lattitude                     : model.Lattitude ?? null,
            };
            const symptom = await SymptomAssessmentTemplate.create(entity);
            const dto = await SymptomAssessmentTemplateMapper.toDto(symptom);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<SymptomAssessmentTemplateDto> => {
        try {
            const symptom = await SymptomAssessmentTemplate.findByPk(id);
            const dto = await SymptomAssessmentTemplateMapper.toDto(symptom);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: SymptomAssessmentTemplateSearchFilters)
     : Promise<SymptomAssessmentTemplateSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.Type != null) {
                search.where['Type'] = { [Op.like]: '%' + filters.Type + '%' };
            }
            if (filters.SymptomAssessmentTemplateLine != null) {
                search.where['SymptomAssessmentTemplateLine'] = { [Op.like]: '%' + filters.SymptomAssessmentTemplateLine + '%' };
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

            let orderByColum = 'SymptomAssessmentTemplateLine';
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

            const foundResults = await SymptomAssessmentTemplate.findAndCountAll(search);

            const dtos: SymptomAssessmentTemplateDto[] = [];
            for (const symptom of foundResults.rows) {
                const dto = await SymptomAssessmentTemplateMapper.toDto(symptom);
                dtos.push(dto);
            }

            const searchResults: SymptomAssessmentTemplateSearchResults = {
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

    update = async (id: string, model: SymptomAssessmentTemplateDomainModel): Promise<SymptomAssessmentTemplateDto> => {
        try {
            const symptom = await SymptomAssessmentTemplate.findByPk(id);

            if (model.Type != null) {
                symptom.Type = model.Type;
            }
            if (model.SymptomAssessmentTemplateLine != null) {
                symptom.SymptomAssessmentTemplateLine = model.SymptomAssessmentTemplateLine;
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

            const dto = await SymptomAssessmentTemplateMapper.toDto(symptom);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            await SymptomAssessmentTemplate.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
