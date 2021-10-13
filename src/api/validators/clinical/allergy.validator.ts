import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { Helper } from '../../../common/helper';
import { AllergyDomainModel } from '../../../domain.types/clinical/allergy/allergy.domain.model';
import { AllergySearchFilters } from '../../../domain.types/clinical/allergy/allergy.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class AllergyValidator {

    static getDomainModel = (request: express.Request): AllergyDomainModel => {

        const patientAllergyModel: AllergyDomainModel = {
            PatientUserId         : request.body.PatientUserId ?? null,
            Allergy               : request.body.Allergy ?? null,
            AllergenCategory      : request.body.AllergenCategory ?? null,
            AllergenExposureRoute : request.body.AllergenExposureRoute,
            Severity              : request.body.Severity ?? null,
            Reaction              : request.body.Reaction ?? null,
            OtherInformation      : request.body.OtherInformation ?? null,
            LastOccurrence        : request.body.LastOccurrence ?? null,
        };

        return patientAllergyModel;
    };

    static create = async (request: express.Request): Promise<AllergyDomainModel> => {
        await AllergyValidator.validateBody(request);
        return AllergyValidator.getDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await AllergyValidator.getParamId(request);
    };

    static delete = async (request: express.Request): Promise<string> => {
        return await AllergyValidator.getParamId(request);
    };

    static search = async (
        request: express.Request
    ): Promise<AllergySearchFilters> => {

        await query('patientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('allergy').optional()
            .trim()
            .isString()
            .run(request);

        await query('allergenCategory').optional()
            .trim()
            .isString()
            .run(request);

        await query('allergenExposureRoute').optional()
            .trim()
            .isString()
            .run(request);

        await query('severity').optional()
            .trim()
            .isString()
            .run(request);

        await query('reaction').optional()
            .trim()
            .isString()
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

        return AllergyValidator.getFilter(request);
    };

    private static getFilter(request): AllergySearchFilters {

        const pageIndex =
            request.query.pageIndex !== 'undefined'
                ? parseInt(request.query.pageIndex as string, 10)
                : 0;

        const itemsPerPage =
            request.query.itemsPerPage !== 'undefined'
                ? parseInt(request.query.itemsPerPage as string, 10)
                : 25;

        const filters: AllergySearchFilters = {
            PatientUserId         : request.query.patientUserId ?? null,
            AllergenCategory      : request.query.allergenCategory ?? null,
            AllergenExposureRoute : request.query.allergenExposureRoute ?? null,
            Allergy               : request.query.allergy ?? null,
            Severity              : request.query.severity ?? null,
            Reaction              : request.query.reaction ?? null,
            OrderBy               : request.query.orderBy ?? 'CreatedAt',
            Order                 : request.query.order ?? 'descending',
            PageIndex             : pageIndex,
            ItemsPerPage          : itemsPerPage,
        };

        return filters;
    }

    static update = async (request: express.Request): Promise<AllergyDomainModel> => {

        const id = await AllergyValidator.getParamId(request);
        await AllergyValidator.validateBody(request);

        const domainModel = AllergyValidator.getDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

    private static async validateBody(request) {

        await body('PatientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('Allergy').exists()
            .trim()
            .escape()
            .run(request);

        await body('AllergenCategory').optional()
            .trim()
            .escape()
            .run(request);

        await body('AllergenExposureRoute').optional()
            .trim()
            .run(request);

        await body('Severity').optional()
            .trim()
            .escape()
            .run(request);

        await body('Reaction').optional()
            .trim()
            .escape()
            .run(request);

        await body('OtherInformation').optional()
            .trim()
            .escape()
            .run(request);

        await body('LastOccurrence').optional()
            .trim()
            .escape()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
    }

    static async getPatientUserId(request) {

        await param('patientUserId').trim()
            .escape()
            .isUUID()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        return request.params.patientUserId;
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
