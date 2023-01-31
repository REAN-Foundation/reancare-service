import { Op } from 'sequelize';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { AssessmentTemplateDomainModel } from '../../../../../../domain.types/clinical/assessment/assessment.template.domain.model';
import { AssessmentTemplateDto } from '../../../../../../domain.types/clinical/assessment/assessment.template.dto';
import {
    AssessmentTemplateSearchFilters,
    AssessmentTemplateSearchResults
} from '../../../../../../domain.types/clinical/assessment/assessment.template.search.types';
import { uuid } from '../../../../../../domain.types/miscellaneous/system.types';
import { IAssessmentTemplateRepo } from '../../../../../repository.interfaces/clinical/assessment/assessment.template.repo.interface';
import { AssessmentTemplateMapper } from '../../../mappers/clinical/assessment/assessment.template.mapper';
import AssessmentTemplate from '../../../models/clinical/assessment/assessment.template.model';

///////////////////////////////////////////////////////////////////////

export class AssessmentTemplateRepo implements IAssessmentTemplateRepo {

    //#region Publics

    public create = async (model: AssessmentTemplateDomainModel): Promise<AssessmentTemplateDto> => {
        try {
            const entity = {
                DisplayCode                 : model.DisplayCode ?? null,
                Type                        : model.Type ?? null,
                Title                       : model.Title ?? model.Title,
                Description                 : model.Description ?? null,
                ProviderAssessmentCode      : model.ProviderAssessmentCode ?? null,
                Provider                    : model.Provider ?? null,
                ServeListNodeChildrenAtOnce : model.ServeListNodeChildrenAtOnce ?? false,
                ScoringApplicable           : model.ScoringApplicable ?? false,
                TotalNumberOfQuestions      : model.TotalNumberOfQuestions ?? null,
            };
            const assessmentTemplate = await AssessmentTemplate.create(entity);
            return AssessmentTemplateMapper.toDto(assessmentTemplate);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public getById = async (id: uuid): Promise<AssessmentTemplateDto> => {
        try {
            const assessmentTemplate = await AssessmentTemplate.findByPk(id);
            return AssessmentTemplateMapper.toDto(assessmentTemplate);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public getByProviderAssessmentCode = async (provider: string, providerAssessmentCode: string)
        : Promise<AssessmentTemplateDto> => {
        try {
            const assessmentTemplate = await AssessmentTemplate.findOne({
                where : {
                    Provider               : provider,
                    ProviderAssessmentCode : providerAssessmentCode
                }
            });
            return AssessmentTemplateMapper.toDto(assessmentTemplate);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public search = async (filters: AssessmentTemplateSearchFilters): Promise<AssessmentTemplateSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.Title != null) {
                search.where['Title'] = { [Op.like]: '%' + filters.Title + '%' };
            }
            if (filters.Type != null) {
                search.where['Type'] = { [Op.like]: '%' + filters.Type + '%' };
            }
            if (filters.DisplayCode != null) {
                search.where['DisplayCode'] = filters.DisplayCode;
            }
            let orderByColum = 'Title';
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

            const foundResults = await AssessmentTemplate.findAndCountAll(search);

            const dtos: AssessmentTemplateDto[] = [];
            for (const doctorNote of foundResults.rows) {
                const dto = AssessmentTemplateMapper.toDto(doctorNote);
                dtos.push(dto);
            }

            const searchResults: AssessmentTemplateSearchResults = {
                TotalCount     : foundResults.count,
                RetrievedCount : dtos.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColum,
                Items          : dtos
            };
            return searchResults;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public update = async (id: uuid, updateModel: AssessmentTemplateDomainModel): Promise<AssessmentTemplateDto> => {
        try {
            var assessmentTemplate = await AssessmentTemplate.findByPk(id);

            if (updateModel.Type != null) {
                assessmentTemplate.Type = updateModel.Type;
            }
            if (updateModel.Title != null) {
                assessmentTemplate.Title = updateModel.Title;
            }
            if (updateModel.DisplayCode != null) {
                assessmentTemplate.DisplayCode = updateModel.DisplayCode;
            }
            if (updateModel.Description != null) {
                assessmentTemplate.Description = updateModel.Description;
            }
            if (updateModel.ScoringApplicable != null) {
                assessmentTemplate.ScoringApplicable = updateModel.ScoringApplicable;
            }
            if (updateModel.ProviderAssessmentCode != null) {
                assessmentTemplate.ProviderAssessmentCode = updateModel.ProviderAssessmentCode;
            }
            if (updateModel.Provider != null) {
                assessmentTemplate.Provider = updateModel.Provider;
            }
            if (updateModel.ServeListNodeChildrenAtOnce != null) {
                assessmentTemplate.ServeListNodeChildrenAtOnce = updateModel.ServeListNodeChildrenAtOnce;
            }
            if (updateModel.TotalNumberOfQuestions != null) {
                assessmentTemplate.TotalNumberOfQuestions = updateModel.TotalNumberOfQuestions;
            }
            await assessmentTemplate.save();

            return AssessmentTemplateMapper.toDto(assessmentTemplate);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public delete = async (id: uuid): Promise<boolean> => {
        try {
            await AssessmentTemplate.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public updateFileResource = async (id: uuid, fileResourceId: uuid): Promise<AssessmentTemplateDto> => {
        try {
            var assessmentTemplate = await AssessmentTemplate.findByPk(id);
            assessmentTemplate.FileResourceId = fileResourceId;
            await assessmentTemplate.save();
            return AssessmentTemplateMapper.toDto(assessmentTemplate);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    //#endregion

}
