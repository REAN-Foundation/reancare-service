import { ISymptomAssessmentTemplateRepo } from '../../../../../repository.interfaces/clinical/symptom/symptom.assessment.template.repo.interface';
import SymptomAssessmentTemplate from '../../../models/clinical/symptom/symptom.assessment.template.model';
import { Op } from 'sequelize';
import { SymptomAssessmentTemplateMapper } from '../../../mappers/clinical/symptom/symptom.assessment.template.mapper';
import { Logger } from '../../../../../../common/logger';
import { ApiError } from '../../../../../../common/api.error';
import { SymptomAssessmentTemplateDomainModel } from '../../../../../../domain.types/clinical/symptom/symptom.assessment.template/symptom.assessment.template.domain.model';
import { SymptomAssessmentTemplateDto } from '../../../../../../domain.types/clinical/symptom/symptom.assessment.template/symptom.assessment.template.dto';
import { SymptomAssessmentTemplateSearchFilters, SymptomAssessmentTemplateSearchResults } from '../../../../../../domain.types/clinical/symptom/symptom.assessment.template/symptom.assessment.template.search.types';
import SymptomType from '../../../models/clinical/symptom/symptom.type.model';
import SymptomTypesInTemplate from '../../../models/clinical/symptom/symptom.types.in.template.model';

///////////////////////////////////////////////////////////////////////

export class SymptomAssessmentTemplateRepo implements ISymptomAssessmentTemplateRepo {

    create = async (model: SymptomAssessmentTemplateDomainModel): Promise<SymptomAssessmentTemplateDto> => {
        try {

            const entity = {
                Title       : model.Title,
                Description : model.Description ?? null,
                Tags        : model.Tags && model.Tags.length > 0 ? JSON.stringify(model.Tags) : null,
            };
            const template = await SymptomAssessmentTemplate.create(entity);
            return SymptomAssessmentTemplateMapper.toDto(template);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<SymptomAssessmentTemplateDto> => {
        try {
            const template = await SymptomAssessmentTemplate.findOne({
                where : {
                    id : id
                },
                include : [
                    {
                        model : SymptomType,
                    }
                ]
            });

            return SymptomAssessmentTemplateMapper.toDto(template);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    exists = async (id: string): Promise<boolean> => {
        try {
            var template = await SymptomAssessmentTemplate.findByPk(id);
            return template !== null;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: SymptomAssessmentTemplateSearchFilters)
     : Promise<SymptomAssessmentTemplateSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.Title != null) {
                search.where['Title'] = { [Op.like]: '%' + filters.Title + '%' };
            }
            if (filters.Tag != null) {
                search.where['Tags'] = { [Op.like]: '%' + filters.Tag + '%' };
            }

            var symptomTypeFilter = {
                model : SymptomType,
                where : {
                },
                joinTableAttributes : ['Index'],
                required            : false
            };
            if (filters.SymptomName != null) {
                symptomTypeFilter.where['Symptom'] = { [Op.like]: '%' + filters.SymptomName + '%' };
            }
            if (filters.SymptomTypeId != null) {
                symptomTypeFilter.where['id'] = { [Op.like]: '%' + filters.SymptomTypeId + '%' };
            }
            search['include'] = [
                symptomTypeFilter
            ];

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
            search['limit']    = limit;
            search['offset']   = offset;
            search['distinct'] = true;

            const foundResults = await SymptomAssessmentTemplate.findAndCountAll(search);

            const dtos: SymptomAssessmentTemplateDto[]
                = foundResults.rows.map(x => SymptomAssessmentTemplateMapper.toDto(x));

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

    // eslint-disable-next-line max-len
    update = async (id: string, updateModel: SymptomAssessmentTemplateDomainModel): Promise<SymptomAssessmentTemplateDto> => {
        try {
            const template = await SymptomAssessmentTemplate.findByPk(id);

            if (updateModel.Title != null) {
                template.Title = updateModel.Title;
            }
            if (updateModel.Tags != null) {
                var existingTags = [JSON.parse(template.Tags) as Array<string>];
                existingTags.push(updateModel.Tags);
                existingTags = [...new Set(existingTags)];
                template.Tags = JSON.stringify(existingTags);
            }
            if (updateModel.Description != null) {
                template.Description = updateModel.Description;
            }

            await template.save();

            return this.getById(id);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            var deletedSymptomTypeCount = await SymptomTypesInTemplate.destroy({
                where : {
                    TemplateId : id
                }
            });
            Logger.instance().log(`${deletedSymptomTypeCount.toString()} symptom instances deleted for assessment id: ${id}.`);

            var deletedAssessmentTemplateCount = await SymptomAssessmentTemplate.destroy({ where: { id: id } });
            return deletedAssessmentTemplateCount > 0;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    addSymptomTypes = async (id: string, symptomTypeIds: string[])
        : Promise<SymptomAssessmentTemplateDto> => {

        let symptomTypes = [];
        if (symptomTypeIds) {
            symptomTypes = await SymptomType.findAll({ where: { id: { [Op.in]: symptomTypeIds } } });
            if (symptomTypes.length !== symptomTypeIds.length) {
                Logger.instance().log("One or more Symptom Types not found on record!");
            }
        }

        for await (var symptomType of symptomTypes) {

            // check if this symptom type already added to template
            const existing = await SymptomTypesInTemplate.findOne(
                {
                    where : {
                        TemplateId    : id,
                        SymptomTypeId : symptomType.id
                    }
                });
            if (existing) {
                Logger.instance().log(`Symptom type with id '${symptomType.id}' already added to this template '${id}'!`);
                continue;
            }

            // No existing symptom found for this template, adding new
            const lastSymptom = await SymptomTypesInTemplate.findOne({ where: { TemplateId: id }, order: [['Index', 'DESC']] });
            var index = 1;
            if (lastSymptom) {
                index = lastSymptom.Index + 1;
            }
            const entity = {
                TemplateId    : id,
                SymptomTypeId : symptomType.id,
                Index         : index
            };
            await SymptomTypesInTemplate.create(entity);
        }

        return await this.getById(id);
    };

    removeSymptomTypes = async (id: string, symptomTypeIds: string[]):
        Promise<SymptomAssessmentTemplateDto> => {

        let symptomTypes = [];
        if (symptomTypeIds) {
            symptomTypes = await SymptomType.findAll({ where: { id: { [Op.in]: symptomTypeIds } } });
            if (symptomTypes.length !== symptomTypeIds.length) {
                Logger.instance().log("One or more Symptom Types not found on record!");
            }
        }

        for await (var symptomType of symptomTypes) {

            // check if this symptom type already added to template
            const existing = await SymptomTypesInTemplate.findOne(
                {
                    where : {
                        TemplateId    : id,
                        SymptomTypeId : symptomType.id
                    }
                });

            if (!existing) {
                Logger.instance().log(`Symptom type with id '${symptomType.id}' does not exist in template '${id}'!`);
                continue;
            }

            // No existing symptom found for this template, adding new
            await SymptomTypesInTemplate.destroy(
                {
                    where : {
                        id : existing.id,
                    }
                });
        }
        
        await this.recalculateSymptomIndices(id);
        return await this.getById(id);
    };

    private recalculateSymptomIndices = async (templateId) => {

        const symptomTypes = await SymptomTypesInTemplate.findAll({ where: { TemplateId: templateId }, order: [['Index', 'ASC']] });
        var index = 1;
        for await (var s of symptomTypes) {
            s.Index = index;
            await s.save();
            index++;
        }
    };

    totalCount = async (): Promise<number> => {
        try {
            return await SymptomAssessmentTemplate.count();
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
