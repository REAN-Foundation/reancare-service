import express from 'express';
import { body, param, validationResult, query } from 'express-validator';
import { Helper } from '../../../../common/helper';
import { SymptomDomainModel } from '../../../../domain.types/clinical/symptom/symptom/symptom.domain.model';
import { SymptomSearchFilters } from '../../../../domain.types/clinical/symptom/symptom/symptom.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class SymptomValidator {

    static getDomainModel = (request: express.Request): SymptomDomainModel => {

        const model: SymptomDomainModel = {
            id                        : request.body.id ?? null,
            PatientUserId             : request.body.PatientUserId ?? null,
            MedicalPractitionerUserId : request.body.MedicalPractitionerUserId ?? null,
            VisitId                   : request.body.VisitId,
            AssessmentId              : request.body.AssessmentId ?? null,
            AssessmentTemplateId      : request.body.AssessmentTemplateId ?? null,
            SymptomTypeId             : request.body.SymptomTypeId ?? null,
            Symptom                   : request.body.Symptom ?? null,
            IsPresent                 : request.body.IsPresent ?? null,
            Severity                  : request.body.Severity ?? null,
            ValidationStatus          : request.body.ValidationStatus ?? null,
            Interpretation            : request.body.Interpretation ?? null,
            Comments                  : request.body.Comments ?? null,
            RecordDate                : request.body.RecordDate ?? null,
        };

        return model;
    };

    static create = async (request: express.Request): Promise<SymptomDomainModel> => {

        await body('PatientUserId').exists()
            .trim()
            .isUUID()
            .run(request);

        await body('SymptomTypeId').exists()
            .trim()
            .isUUID()
            .run(request);

        await SymptomValidator.validateBody(request);

        return SymptomValidator.getDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await SymptomValidator.getParamId(request);
    };
    
    static delete = async (request: express.Request): Promise<string> => {
        return await SymptomValidator.getParamId(request);
    };

    static search = async (request: express.Request): Promise<SymptomSearchFilters> => {

        await query('patientUserId').optional()
            .trim()
            .isUUID()
            .run(request);

        await query('visitId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('assessmentId').optional()
            .trim()
            .isUUID()
            .run(request);

        await query('assessmentTemplateId').optional()
            .trim()
            .isUUID()
            .run(request);

        await query('dateFrom').optional()
            .trim()
            .escape()
            .toDate()
            .run(request);

        await query('dateTo').optional()
            .trim()
            .escape()
            .toDate()
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

        return SymptomValidator.getFilter(request);
    };

    static update = async (request: express.Request): Promise<SymptomDomainModel> => {

        await body('PatientUserId').optional()
            .trim()
            .isUUID()
            .run(request);

        await body('SymptomTypeId').optional()
            .trim()
            .isUUID()
            .run(request);

        await SymptomValidator.validateBody(request);

        const id = await SymptomValidator.getParamId(request);
        const domainModel = SymptomValidator.getDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

    private static async validateBody(request) {

        await body('MedicalPractitionerUserId').optional()
            .trim()
            .isUUID()
            .run(request);

        await body('VisitId').optional()
            .trim()
            .isUUID()
            .run(request);

        await body('AssessmentId').optional()
            .trim()
            .isUUID()
            .run(request);

        await body('AssessmentTemplateId').optional()
            .trim()
            .isUUID()
            .run(request);

        await body('Symptom').optional()
            .trim()
            .run(request);

        await body('IsPresent').optional()
            .trim()
            .isBoolean()
            .run(request);

        await body('Severity').optional()
            .trim()
            .run(request);

        await body('ValidationStatus').optional()
            .trim()
            .run(request);

        await body('Interpretation').optional()
            .trim()
            .run(request);

        await body('Comments').optional()
            .trim()
            .run(request);

        await body('RecordDate').optional()
            .trim()
            .isDate()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
    }

    private static getFilter(request): SymptomSearchFilters {

        const pageIndex = request.query.pageIndex !== 'undefined' ?
            parseInt(request.query.pageIndex as string, 10) : 0;

        const itemsPerPage = request.query.itemsPerPage !== 'undefined' ?
            parseInt(request.query.itemsPerPage as string, 10) : 25;

        const filters: SymptomSearchFilters = {
            Symptom              : request.query.symptom ?? null,
            SymptomTypeId        : request.query.symptomTypeId ?? null,
            PatientUserId        : request.query.patientUserId ?? null,
            AssessmentId         : request.query.assessmentId ?? null,
            AssessmentTemplateId : request.query.assessmentTemplateId ?? null,
            VisitId              : request.query.visitId ?? null,
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
