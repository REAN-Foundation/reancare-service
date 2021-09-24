import express from 'express';
import { body, param, validationResult, query } from 'express-validator';
import { Helper } from '../../../../common/helper';
import { SymptomAssessmentDomainModel } from '../../../../domain.types/clinical/symptom/symptom.assessment/symptom.assessment.domain.model';
import { SymptomAssessmentSearchFilters } from '../../../../domain.types/clinical/symptom/symptom.assessment/symptom.assessment.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class SymptomAssessmentValidator {

    static getDomainModel = (request: express.Request): SymptomAssessmentDomainModel => {

        const model: SymptomAssessmentDomainModel = {
            id                   : request.body.id ?? null,
            PatientUserId        : request.body.PatientUserId ?? null,
            Title                : request.body.Title,
            AssessmentTemplateId : request.body.AssessmentTemplateId ?? null,
            OverallStatus        : request.body.OverallStatus ?? null,
            AssessmentDate       : request.body.AssessmentDate ?? null,
        };

        return model;
    };

    static create = async (request: express.Request): Promise<SymptomAssessmentDomainModel> => {

        await body('PatientUserId').exists()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('Title').exists()
            .trim()
            .run(request);

        await body('AssessmentTemplateId').exists()
            .trim()
            .isUUID()
            .run(request);

        await body('OverallStatus').optional()
            .trim()
            .run(request);

        await body('AssessmentDate').optional()
            .trim()
            .isDate()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        return SymptomAssessmentValidator.getDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await SymptomAssessmentValidator.getParamId(request);
    };

    static delete = async (request: express.Request): Promise<string> => {
        return await SymptomAssessmentValidator.getParamId(request);
    };

    static search = async (request: express.Request): Promise<SymptomAssessmentSearchFilters> => {

        await query('patientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('assessmentTemplateId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('title').optional()
            .trim()
            .run(request);

        await query('dateFrom').optional()
            .trim()
            .escape()
            .toDate()
            .run(request);

        await query('dateTo').optional()
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

        return SymptomAssessmentValidator.getFilter(request);
    };

    static update = async (request: express.Request): Promise<SymptomAssessmentDomainModel> => {

        await body('Title').optional()
            .trim()
            .run(request);

        await body('AssessmentTemplateId').optional()
            .trim()
            .isUUID()
            .run(request);

        await body('OverallStatus').optional()
            .trim()
            .run(request);

        await body('AssessmentDate').optional()
            .trim()
            .isDate()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        const id = await SymptomAssessmentValidator.getParamId(request);

        const domainModel = SymptomAssessmentValidator.getDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

    private static getFilter(request): SymptomAssessmentSearchFilters {
        
        const pageIndex = request.query.pageIndex !== 'undefined' ? parseInt(request.query.pageIndex as string, 10) : 0;

        const itemsPerPage =
            request.query.itemsPerPage !== 'undefined' ? parseInt(request.query.itemsPerPage as string, 10) : 25;

        const filters: SymptomAssessmentSearchFilters = {
            Title                : request.query.title ?? null,
            PatientUserId        : request.query.patientUserId ?? null,
            AssessmentTemplateId : request.query.assessmentTemplateId ?? null,
            DateFrom             : request.query.dateFrom ?? null,
            DateTo               : request.query.dateTo ?? null,
            OrderBy              : request.query.orderBy ?? 'CreatedAt',
            Order                : request.query.order ?? 'descending',
            PageIndex            : pageIndex,
            ItemsPerPage         : itemsPerPage,
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
