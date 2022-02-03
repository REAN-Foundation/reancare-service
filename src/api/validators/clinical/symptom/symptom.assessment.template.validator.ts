import express from 'express';
import { body, param, validationResult, query } from 'express-validator';
import { Helper } from '../../../../common/helper';
import { SymptomAssessmentTemplateDomainModel } from '../../../../domain.types/clinical/symptom/symptom.assessment.template/symptom.assessment.template.domain.model';
import { SymptomAssessmentTemplateSearchFilters } from '../../../../domain.types/clinical/symptom/symptom.assessment.template/symptom.assessment.template.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class SymptomAssessmentTemplateValidator {

    static getDomainModel = (request: express.Request): SymptomAssessmentTemplateDomainModel => {

        const model: SymptomAssessmentTemplateDomainModel = {
            id          : request.params.id ?? null,
            Title       : request.body.Title ?? null,
            Description : request.body.Description ?? null,
            Tags        : request.body.Tags ?? null
        };

        return model;
    };

    static create = async (request: express.Request): Promise<SymptomAssessmentTemplateDomainModel> => {

        await body('Title').exists()
            .trim()
            .escape()
            .run(request);

        await SymptomAssessmentTemplateValidator.validateBody(request);
        return SymptomAssessmentTemplateValidator.getDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await SymptomAssessmentTemplateValidator.getParamId(request);
    };
    
    static delete = async (request: express.Request): Promise<string> => {
        return await SymptomAssessmentTemplateValidator.getParamId(request);
    };

    static search = async (request: express.Request): Promise<SymptomAssessmentTemplateSearchFilters> => {

        await query('title').optional()
            .trim()
            .escape()
            .run(request);

        await query('tag').optional()
            .trim()
            .run(request);

        await query('symptomName').optional()
            .trim()
            .run(request);

        await query('symptomTypeId').optional()
            .isUUID()
            .trim()
            .run(request);

        await query('orderBy').optional()
            .trim()
            .escape()
            .run(request);

        await query('order').optional()
            .trim()
            .escape()
            .run(request);

        await query('pageIndex').optional()
            .trim()
            .escape()
            .isInt()
            .run(request);

        await query('itemsPerPage').optional()
            .trim()
            .escape()
            .isInt()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        return SymptomAssessmentTemplateValidator.getFilter(request);
    };

    static update = async (request: express.Request): Promise<SymptomAssessmentTemplateDomainModel> => {

        const id = await SymptomAssessmentTemplateValidator.getParamId(request);

        await body('Title').optional()
            .trim()
            .escape()
            .run(request);

        await SymptomAssessmentTemplateValidator.validateBody(request);

        const domainModel = SymptomAssessmentTemplateValidator.getDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

    static addRemoveSymptomTypes = async (request: express.Request): Promise<any> => {

        await param('id').exists()
            .isUUID()
            .run(request);

        await body('SymptomTypeIds').exists()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        
        var model = {
            id             : request.params.id,
            SymptomTypeIds : request.body.SymptomTypeIds
        };

        return model;
    };

    private static async validateBody(request) {

        await body('Tags').optional()
            .isArray()
            .run(request);

        await body('Description').optional()
            .trim()
            .escape()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
    }

    private static getFilter(request): SymptomAssessmentTemplateSearchFilters {
        
        const pageIndex = request.query.pageIndex !== 'undefined' ? parseInt(request.query.pageIndex as string, 10) : 0;

        const itemsPerPage =
            request.query.itemsPerPage !== 'undefined' ? parseInt(request.query.itemsPerPage as string, 10) : 25;

        const filters: SymptomAssessmentTemplateSearchFilters = {
            Title         : request.query.title ?? null,
            Tag           : request.query.tag ?? null,
            SymptomName   : request.query.symptomName ?? null,
            SymptomTypeId : request.query.symptomTypeId ?? null,
            OrderBy       : request.query.orderBy ?? 'CreatedAt',
            Order         : request.query.order ?? 'descending',
            PageIndex     : pageIndex,
            ItemsPerPage  : itemsPerPage,
        };
        return filters;
    }

    private static async getParamId(request) {

        await param('id').trim()
            .escape()
            .isUUID()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        return request.params.id;
    }

}
