import express from 'express';
import { body, param, validationResult, query } from 'express-validator';
import { Helper } from '../../../common/helper';
import { BloodGlucoseDomainModel } from '../../../domain.types/biometrics/blood.glucose/blood.glucose.domain.model';
import { BloodGlucoseSearchFilters } from '../../../domain.types/biometrics/blood.glucose/blood.glucose.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class BloodGlucoseValidator {

    static getDomainModel = (request: express.Request): BloodGlucoseDomainModel => {

        const bloodGlucoseDomainModel: BloodGlucoseDomainModel = {
            PatientUserId    : request.body.PatientUserId,
            BloodGlucose     : request.body.BloodGlucose,
            Unit             : request.body.Unit,
            RecordDate       : request.body.RecordDate ?? null,
            RecordedByUserId : request.body.RecordedByUserId ?? null,
        };

        return bloodGlucoseDomainModel;
    };

    static create = async (request: express.Request): Promise<BloodGlucoseDomainModel> => {
        await BloodGlucoseValidator.validateBody(request);
        return BloodGlucoseValidator.getDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await BloodGlucoseValidator.getParamId(request);
    };

    static getByPatientUserId = async (request: express.Request): Promise<string> => {

        await param('PatientUserId').trim()
            .escape()
            .isUUID()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        return request.params.patientUserId;
    };

    static getByPersonId = async (request: express.Request): Promise<string> => {

        await param('personId').trim()
            .escape()
            .isUUID()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        return request.params.personId;
    };

    static delete = async (request: express.Request): Promise<string> => {
        return await BloodGlucoseValidator.getParamId(request);
    };

    static search = async (request: express.Request): Promise<BloodGlucoseSearchFilters> => {

        await query('patientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('minValue').optional()
            .trim()
            .escape()
            .run(request);

        await query('maxValue').optional()
            .trim()
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

        return BloodGlucoseValidator.getFilter(request);
    };

    static update = async (request: express.Request): Promise<BloodGlucoseDomainModel> => {

        const id = await BloodGlucoseValidator.getParamId(request);
        await BloodGlucoseValidator.validateBody(request);

        const domainModel = BloodGlucoseValidator.getDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

    private static async validateBody(request) {

        await body('PatientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('BloodGlucose').optional()
            .trim()
            .escape()
            .toInt()
            .run(request);

        await body('Unit').optional()
            .trim()
            .run(request);

        await body('RecordDate').optional()
            .trim()
            .escape()
            .isDate()
            .run(request);

        await body('RecordedByUserId').optional()
            .trim()
            .escape()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
    }

    private static getFilter(request): BloodGlucoseSearchFilters {
        const pageIndex = request.query.PageIndex !== 'undefined' ? parseInt(request.query.PageIndex as string, 10) : 0;

        const itemsPerPage =
            request.query.ItemsPerPage !== 'undefined' ? parseInt(request.query.ItemsPerPage as string, 10) : 25;

        const filters: BloodGlucoseSearchFilters = {
            PatientUserId    : request.query.patientUserId ?? null,
            MinValue         : request.query.minValue ?? null,
            MaxValue         : request.query.maxValue ?? null,
            CreatedDateFrom  : request.query.createdDateFrom ?? null,
            CreatedDateTo    : request.query.createdDateTo ?? null,
            RecordedByUserId : request.query.recordedByUserId ?? null,
            OrderBy          : request.query.orderBy ?? 'CreatedAt',
            Order            : request.query.order ?? 'descending',
            PageIndex        : pageIndex,
            ItemsPerPage     : itemsPerPage,
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
