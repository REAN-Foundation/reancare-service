import { ISymptomAssessmentRepo } from '../../../../../repository.interfaces/clinical/symptom/symptom.assessment.repo.interface';
import SymptomAssessment from '../../../models/clinical/symptom/symptom.assessment.model';
import { Op } from 'sequelize';
import { SymptomAssessmentMapper } from '../../../mappers/clinical/symptom/symptom.assessment.mapper';
import { Logger } from '../../../../../../common/logger';
import { ApiError } from '../../../../../../common/api.error';
import { SymptomAssessmentDomainModel } from '../../../../../../domain.types/clinical/symptom/symptom.assessment/symptom.assessment.domain.model';
import { SymptomAssessmentDto } from '../../../../../../domain.types/clinical/symptom/symptom.assessment/symptom.assessment.dto';
import { SymptomAssessmentSearchFilters, SymptomAssessmentSearchResults } from '../../../../../../domain.types/clinical/symptom/symptom.assessment/symptom.assessment.search.types';

///////////////////////////////////////////////////////////////////////

export class SymptomAssessmentRepo implements ISymptomAssessmentRepo {

    create = async (model: SymptomAssessmentDomainModel): Promise<SymptomAssessmentDto> => {
        try {
            const entity = {
                Type                  : model.Type,
                SymptomAssessmentLine : model.SymptomAssessmentLine ?? null,
                City                  : model.City ?? null,
                District              : model.District ?? null,
                State                 : model.State ?? null,
                Country               : model.Country ?? null,
                PostalCode            : model.PostalCode ?? null,
                Longitude             : model.Longitude ?? null,
                Lattitude             : model.Lattitude ?? null,
            };
            const symptom = await SymptomAssessment.create(entity);
            const dto = await SymptomAssessmentMapper.toDto(symptom);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<SymptomAssessmentDto> => {
        try {
            const symptom = await SymptomAssessment.findByPk(id);
            const dto = await SymptomAssessmentMapper.toDto(symptom);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: SymptomAssessmentSearchFilters): Promise<SymptomAssessmentSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.Type != null) {
                search.where['Type'] = { [Op.like]: '%' + filters.Type + '%' };
            }
            if (filters.SymptomAssessmentLine != null) {
                search.where['SymptomAssessmentLine'] = { [Op.like]: '%' + filters.SymptomAssessmentLine + '%' };
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

            let orderByColum = 'SymptomAssessmentLine';
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

            const foundResults = await SymptomAssessment.findAndCountAll(search);

            const dtos: SymptomAssessmentDto[] = [];
            for (const symptom of foundResults.rows) {
                const dto = await SymptomAssessmentMapper.toDto(symptom);
                dtos.push(dto);
            }

            const searchResults: SymptomAssessmentSearchResults = {
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

    update = async (id: string, model: SymptomAssessmentDomainModel): Promise<SymptomAssessmentDto> => {
        try {
            const symptom = await SymptomAssessment.findByPk(id);

            if (model.Type != null) {
                symptom.Type = model.Type;
            }
            if (model.SymptomAssessmentLine != null) {
                symptom.SymptomAssessmentLine = model.SymptomAssessmentLine;
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

            const dto = await SymptomAssessmentMapper.toDto(symptom);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            await SymptomAssessment.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
