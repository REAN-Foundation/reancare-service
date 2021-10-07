import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { Helper } from '../../../../common/helper';
import { BodyWeightDomainModel } from '../../../../domain.types/clinical/biometrics/body.weight/body.weight.domain.model';
import { BodyWeightSearchFilters } from '../../../../domain.types/clinical/biometrics/body.weight/body.weight.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class BodyWeightValidator {

    static getDomainModel = (request: express.Request): BodyWeightDomainModel => {

        const bodyWeightModel: BodyWeightDomainModel = {
            PatientUserId    : request.body.PatientUserId,
            BodyWeight       : request.body.BodyWeight,
            Unit             : request.body.Unit,
            RecordDate       : request.body.RecordDate ?? null,
            RecordedByUserId : request.body.RecordedByUserId ?? null,
        };

        return bodyWeightModel;
    };

    static create = async (request: express.Request): Promise<BodyWeightDomainModel> => {
        await BodyWeightValidator.validateBody(request);
        return BodyWeightValidator.getDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await BodyWeightValidator.getParamId(request);
    };

    static getByPatientUserId = async (request: express.Request): Promise<string> => {
        return await BodyWeightValidator.getParamPatientUserId(request);
    };

    static delete = async (request: express.Request): Promise<string> => {
        return await BodyWeightValidator.getParamId(request);
    };

    static search = async (request: express.Request): Promise<BodyWeightSearchFilters> => {

        await query('patientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('minValue').optional()
            .trim()
            .escape()
            .isFloat()
            .run(request);

        await query('maxValue').optional()
            .trim()
            .escape()
            .isFloat()
            .run(request);

        await query('recordedByUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('createdDateFrom').optional()
            .trim()
            .escape()
            .toDate()
            .run(request);

        await query('createdDateTo').optional()
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

        return BodyWeightValidator.getFilter(request);
    };

    static update = async (request: express.Request): Promise<BodyWeightDomainModel> => {

        const id = await BodyWeightValidator.getParamId(request);
        await BodyWeightValidator.validateBody(request);

        const domainModel = BodyWeightValidator.getDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

    private static async validateBody(request) {

        await body('PatientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('BodyWeight').optional()
            .trim()
            .escape()
            .toFloat()
            .run(request);

        await body('Unit').optional()
            .trim()
            .escape()
            .run(request);

        await body('RecordDate').optional()
            .trim()
            .escape()
            .isDate()
            .run(request);

        await body('RecordedByUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
    }

    private static getFilter(request): BodyWeightSearchFilters {
        const pageIndex = request.query.pageIndex !== 'undefined' ? parseInt(request.query.pageIndex as string, 10) : 0;

        const itemsPerPage =
            request.query.itemsPerPage !== 'undefined' ? parseInt(request.query.itemsPerPage as string, 10) : 25;

        const filters: BodyWeightSearchFilters = {
            CreatedDateFrom : request.query.createdDateFrom ?? null,
            CreatedDateTo   : request.query.createdDateTo ?? null,
            OrderBy         : request.query.orderBy ?? 'CreatedAt',
            Order           : request.query.order ?? 'descending',
            PageIndex       : pageIndex,
            ItemsPerPage    : itemsPerPage,
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

    private static async getParamPatientUserId(request) {

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

}
