import { ISymptomAssessmentRepo } from '../../../../../repository.interfaces/clinical/symptom/symptom.assessment.repo.interface';
import SymptomAssessment from '../../../models/clinical/symptom/symptom.assessment.model';
import { Op } from 'sequelize';
import { SymptomAssessmentMapper } from '../../../mappers/clinical/symptom/symptom.assessment.mapper';
import { Logger } from '../../../../../../common/logger';
import { ApiError } from '../../../../../../common/api.error';
import { SymptomAssessmentDomainModel } from '../../../../../../domain.types/clinical/symptom/symptom.assessment/symptom.assessment.domain.model';
import { SymptomAssessmentDto } from '../../../../../../domain.types/clinical/symptom/symptom.assessment/symptom.assessment.dto';
import { SymptomAssessmentSearchFilters, SymptomAssessmentSearchResults } from '../../../../../../domain.types/clinical/symptom/symptom.assessment/symptom.assessment.search.types';
import { ProgressStatus } from '../../../../../../domain.types/miscellaneous/system.types';
import Symptom from '../../../models/clinical/symptom/symptom.model';

///////////////////////////////////////////////////////////////////////

export class SymptomAssessmentRepo implements ISymptomAssessmentRepo {

    create = async (model: SymptomAssessmentDomainModel): Promise<SymptomAssessmentDto> => {
        try {

            const entity = {
                Title                : model.Title,
                PatientUserId        : model.PatientUserId,
                AssessmentTemplateId : model.AssessmentTemplateId ?? null,
                AssessmentDate       : model.AssessmentDate ?? null,
                OverallStatus        : ProgressStatus.Pending ?? null,
            };

            const assessment = await SymptomAssessment.create(entity);
            return await SymptomAssessmentMapper.toDto(assessment);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<SymptomAssessmentDto> => {
        try {

            const assessment = await SymptomAssessment.findByPk(id);
            return await SymptomAssessmentMapper.toDto(assessment);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: SymptomAssessmentSearchFilters): Promise<SymptomAssessmentSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.Title != null) {
                search.where['Title'] = { [Op.like]: '%' + filters.Title + '%' };
            }
            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = { [Op.like]: '%' + filters.PatientUserId + '%' };
            }
            if (filters.AssessmentTemplateId != null) {
                search.where['AssessmentTemplateId'] = { [Op.like]: '%' + filters.AssessmentTemplateId + '%' };
            }
            if (filters.DateFrom != null && filters.DateTo != null) {
                search.where['AssessmentDate'] = {
                    [Op.gte] : filters.DateFrom,
                    [Op.lte] : filters.DateTo,
                };
            } else if (filters.DateFrom === null && filters.DateTo !== null) {
                search.where['AssessmentDate'] = {
                    [Op.lte] : filters.DateTo,
                };
            } else if (filters.DateFrom !== null && filters.DateTo === null) {
                search.where['AssessmentDate'] = {
                    [Op.gte] : filters.DateFrom,
                };
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

            const foundResults = await SymptomAssessment.findAndCountAll(search);

            const dtos: SymptomAssessmentDto[] = foundResults.rows.map(x => SymptomAssessmentMapper.toDto(x));

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

    update = async (id: string, updateModel: SymptomAssessmentDomainModel): Promise<SymptomAssessmentDto> => {
        try {
            const assessment = await SymptomAssessment.findByPk(id);

            if (updateModel.Title != null) {
                assessment.Title = updateModel.Title;
            }
            if (updateModel.PatientUserId != null) {
                assessment.PatientUserId = updateModel.PatientUserId;
            }
            if (updateModel.AssessmentTemplateId != null) {
                assessment.AssessmentTemplateId = updateModel.AssessmentTemplateId;
            }
            if (updateModel.AssessmentDate != null) {
                assessment.AssessmentDate = updateModel.AssessmentDate;
            }
            if (updateModel.OverallStatus != null) {
                assessment.OverallStatus = updateModel.OverallStatus;
            }
            if (updateModel.EhrId != null) {
                assessment.EhrId = updateModel.EhrId;
            }

            await assessment.save();

            return await SymptomAssessmentMapper.toDto(assessment);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            var deletedSymptomCount = await Symptom.destroy({
                where : {
                    AssessmentId : id
                }
            });
            Logger.instance().log(`${deletedSymptomCount.toString()} symptom instances deleted for assessment id: ${id}.`);

            var deletedAssessmentCount = await SymptomAssessment.destroy({ where: { id: id } });
            return deletedAssessmentCount > 0;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
