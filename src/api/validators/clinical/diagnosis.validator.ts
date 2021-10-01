import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { Helper } from '../../../common/helper';
import { DiagnosisDomainModel } from '../../../domain.types/clinical/diagnosis/diagnosis.domain.model';
import { DiagnosisSearchFilters } from '../../../domain.types/clinical/diagnosis/diagnosis.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class DiagnosisValidator {

    static getDomainModel = (request: express.Request): DiagnosisDomainModel => {

        const entity: DiagnosisDomainModel = {
            
            PatientUserId             : request.body.PatientUserId ?? null,
            EhrId                     : request.body.EhrId ?? null,
            MedicalPractitionerUserId : request.body.MedicalPractitionerUserId ?? null,
            VisitId                   : request.body.VisitId ?? null,
            MedicalConditionId        : request.body.MedicalConditionId ?? null,
            Comments                  : request.body.Comments ?? null,
            IsClinicallyActive        : request.body.IsClinicallyActive ?? null,
            ValidationStatus          : request.body.ValidationStatus ?? null,
            Interpretation            : request.body.Interpretation ?? null,
            OnsetDate                 : request.body.OnsetDate,
            EndDate                   : request.body.EndDate,
        };

        return entity;
    };

    static create = async (
        request: express.Request
    ): Promise<DiagnosisDomainModel> => {
        await DiagnosisValidator.validateBody(request);
        return DiagnosisValidator.getDomainModel(request);
    };

    private static async validateBody(request) {

        await body('PatientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('EhrId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('MedicalPractitionerUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('VisitId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('MedicalConditionId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('Comments').optional()
            .trim()
            .escape()
            .run(request);

        await body('IsClinicallyActive').optional()
            .trim()
            .isBoolean()
            .run(request);

        await body('ValidationStatus').optional()
            .trim()
            .escape()
            .run(request);

        await body('Interpretation').optional()
            .trim()
            .escape()
            .run(request);

        await body('OnsetDate').optional()
            .trim()
            .escape()
            .isDate()
            .run(request);
            
        await body('EndDate').optional()
            .trim()
            .escape()
            .isDate()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
    }

    static getById = async (request: express.Request): Promise<string> => {
        return await DiagnosisValidator.getParamId(request);
    };

    static delete = async (request: express.Request): Promise<string> => {
        return await DiagnosisValidator.getParamId(request);
    };

    static search = async (
        request: express.Request
    ): Promise<DiagnosisSearchFilters> => {

        await query('type').optional()
            .trim()
            .run(request);

        await query('patientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('MedicalPractitionerUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('visitId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('medicalConditionId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('isClinicallyActive').optional()
            .trim()
            .escape()
            .isBoolean()
            .run(request);

        await query('fulfilledByOrganizationId').optional()
            .trim()
            .escape()
            .run(request);

        await query('validationStatus').optional()
            .trim()
            .escape()
            .run(request);

        await query('interpretation').optional()
            .trim()
            .escape()
            .run(request);

        await query('onSetDateFrom').optional()
            .trim()
            .escape()
            .isDate()
            .run(request);

        await query('onSetDateTo').optional()
            .trim()
            .escape()
            .isDate()
            .run(request);

        await query('orderBy').optional()
            .trim()
            .escape()
            .run(request);

        await query('order').optional()
            .trim()
            .escape()
            .run(request);

        await query('pageIndex')
            .optional()
            .isInt()
            .trim()
            .escape()
            .run(request);

        await query('itemsPerPage')
            .optional()
            .isInt()
            .trim()
            .escape()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        return DiagnosisValidator.getFilter(request);
    };

    private static getFilter(request): DiagnosisSearchFilters {

        const pageIndex =
            request.query.pageIndex !== 'undefined'
                ? parseInt(request.query.pageIndex as string, 10)
                : 0;

        const itemsPerPage =
            request.query.itemsPerPage !== 'undefined'
                ? parseInt(request.query.itemsPerPage as string, 10)
                : 25;

        const filters: DiagnosisSearchFilters = {
            Type                      : request.query.type ?? null,
            PatientUserId             : request.query.patientUserId ?? null,
            MedicalPractitionerUserId : request.query.medicalPractitionerUserId ?? null,
            VisitId                   : request.query.visitId ?? null,
            MedicalConditionId        : request.query.medicalConditionId ?? null,
            IsClinicallyActive        : request.query.isClinicallyActive ?? null,
            FulfilledByOrganizationId : request.query.fulfilledByOrganizationId ?? null,
            ValidationStatus          : request.query.validationStatus ?? null,
            Interpretation            : request.query.interpretation ?? null,
            OnsetDateFrom             : request.query.onsetDateFrom ?? null,
            OnsetDateTo               : request.query.onsetDateTo ?? null,
            OrderBy                   : request.query.orderBy ?? 'CreatedAt',
            Order                     : request.query.order ?? 'descending',
            PageIndex                 : pageIndex,
            ItemsPerPage              : itemsPerPage,
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

    static update = async (request: express.Request): Promise<DiagnosisDomainModel> => {

        const id = await DiagnosisValidator.getParamId(request);
        await DiagnosisValidator.validateBody(request);

        var domainModel = DiagnosisValidator.getDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

}
