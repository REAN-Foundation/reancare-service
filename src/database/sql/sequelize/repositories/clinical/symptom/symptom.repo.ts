import { ISymptomRepo } from '../../../../../repository.interfaces/clinical/symptom/symptom.repo.interface';
import Symptom from '../../../models/clinical/symptom/symptom.model';
import { Op } from 'sequelize';
import { SymptomMapper } from '../../../mappers/clinical/symptom/symptom.mapper';
import { Logger } from '../../../../../../common/logger';
import { ApiError } from '../../../../../../common/api.error';
import { SymptomDomainModel } from '../../../../../../domain.types/clinical/symptom/symptom/symptom.domain.model';
import { SymptomDto } from '../../../../../../domain.types/clinical/symptom/symptom/symptom.dto';
import { SymptomSearchFilters, SymptomSearchResults } from '../../../../../../domain.types/clinical/symptom/symptom/symptom.search.types';
import { Severity } from '../../../../../../domain.types/miscellaneous/system.types';
import { ClinicalValidationStatus } from '../../../../../../domain.types/miscellaneous/clinical.types';
import { ClinicalInterpretation } from '../../../../../../domain.types/miscellaneous/clinical.types';

///////////////////////////////////////////////////////////////////////

export class SymptomRepo implements ISymptomRepo {

    create = async (model: SymptomDomainModel): Promise<SymptomDto> => {
        try {
            const entity = {
                PatientUserId             : model.PatientUserId,
                MedicalPractitionerUserId : model.MedicalPractitionerUserId ?? null,
                VisitId                   : model.VisitId ?? null,
                AssessmentId              : model.AssessmentId ?? null,
                AssessmentTemplateId      : model.AssessmentTemplateId ?? null,
                SymptomTypeId             : model.SymptomTypeId,
                Symptom                   : model.Symptom ?? null,
                Severity                  : model.Severity ?? Severity.Low,
                ValidationStatus          : model.ValidationStatus ?? ClinicalValidationStatus.Preliminary,
                Interpretation            : model.Interpretation ?? ClinicalInterpretation.Normal,
                Comments                  : model.Comments ?? null,
                RecordDate                : model.RecordDate ?? null,
            };
            const symptom = await Symptom.create(entity);
            return SymptomMapper.toDto(symptom);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<SymptomDto> => {
        try {
            const symptom = await Symptom.findByPk(id);
            return SymptomMapper.toDto(symptom);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: SymptomSearchFilters): Promise<SymptomSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.Symptom != null) {
                search.where['Symptom'] = { [Op.like]: '%' + filters.Symptom + '%' };
            }
            if (filters.SymptomTypeId != null) {
                search.where['SymptomTypeId'] = filters.SymptomTypeId;
            }
            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.AssessmentId != null) {
                search.where['AssessmentId'] = filters.AssessmentId;
            }
            if (filters.AssessmentTemplateId != null) {
                search.where['AssessmentTemplateId'] = filters.AssessmentTemplateId;
            }
            if (filters.VisitId != null) {
                search.where['VisitId'] = filters.VisitId;
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

            const foundResults = await Symptom.findAndCountAll(search);

            const dtos: SymptomDto[] = foundResults.rows.map(x => SymptomMapper.toDto(x));

            const searchResults: SymptomSearchResults = {
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

    update = async (id: string, model: SymptomDomainModel): Promise<SymptomDto> => {
        try {
            const symptom = await Symptom.findByPk(id);

            symptom.MedicalPractitionerUserId = model.MedicalPractitionerUserId ?? symptom.MedicalPractitionerUserId,
            symptom.VisitId                   = model.VisitId ?? symptom.VisitId,
            symptom.AssessmentId              = model.AssessmentId ?? symptom.AssessmentId,
            symptom.AssessmentTemplateId      = model.AssessmentTemplateId ?? symptom.AssessmentTemplateId,
            symptom.Symptom                   = model.Symptom ?? symptom.Symptom,
            symptom.Severity                  = model.Severity ?? symptom.Severity,
            symptom.ValidationStatus          = model.ValidationStatus ?? symptom.ValidationStatus,
            symptom.Interpretation            = model.Interpretation ?? symptom.Interpretation,
            symptom.Comments                  = model.Comments ?? symptom.Comments,
            symptom.RecordDate                = model.RecordDate ?? symptom.RecordDate,

            await symptom.save();
            return SymptomMapper.toDto(symptom);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            await Symptom.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
