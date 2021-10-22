import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { Helper } from '../../../../common/helper';
import { BodyTemperatureDomainModel } from '../../../../domain.types/clinical/biometrics/body.temperature/body.temperature.domain.model';
import { BodyTemperatureSearchFilters } from '../../../../domain.types/clinical/biometrics/body.temperature/body.temperature.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class BodyTemperatureValidator {

    static getDomainModel = (request: express.Request): BodyTemperatureDomainModel => {

        const BodyTemperatureModel: BodyTemperatureDomainModel = {
            PatientUserId    : request.body.PatientUserId,
            BodyTemperature  : request.body.BodyTemperature,
            Unit             : request.body.Unit,
            RecordDate       : request.body.RecordDate ?? new Date(),
            RecordedByUserId : request.body.RecordedByUserId ?? request.currentUser.UserId,
        };

        return BodyTemperatureModel;
    };

    static create = async (request: express.Request): Promise<BodyTemperatureDomainModel> => {
        await BodyTemperatureValidator.validateBody(request);
        return BodyTemperatureValidator.getDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await BodyTemperatureValidator.getParamId(request);
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

    static delete = async (request: express.Request): Promise<string> => {
        return await BodyTemperatureValidator.getParamId(request);
    };

    static search = async (request: express.Request): Promise<BodyTemperatureSearchFilters> => {

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

        return BodyTemperatureValidator.getFilter(request);
    };

    static update = async (request: express.Request): Promise<BodyTemperatureDomainModel> => {

        const id = await BodyTemperatureValidator.getParamId(request);
        await BodyTemperatureValidator.validateBody(request);

        const domainModel = BodyTemperatureValidator.getDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

    private static async validateBody(request) {

        await body('PatientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('BodyTemperature').optional()
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

    private static getFilter(request): BodyTemperatureSearchFilters {
        const pageIndex = request.query.PageIndex !== 'undefined' ? parseInt(request.query.PageIndex as string, 10) : 0;

        const itemsPerPage =
            request.query.ItemsPerPage !== 'undefined' ? parseInt(request.query.ItemsPerPage as string, 10) : 25;

        const filters: BodyTemperatureSearchFilters = {
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
