import express from 'express';
import { body, param, validationResult, query } from 'express-validator';

import { Helper } from '../../../common/helper';
import { SleepDomainModel } from '../../../domain.types/daily.records/Sleep/sleep.domain.model';
import { SleepSearchFilters } from '../../../domain.types/daily.records/Sleep/sleep.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class SleepValidator {

    static getDomainModel = (request: express.Request): SleepDomainModel => {

        const sleepModel: SleepDomainModel = {
            PatientUserId : request.body.PatientUserId ?? null,
            SleepDuration : request.body.SleepDuration ?? 0,
            RecordDate    : request.body.RecordDate ?? null,
            Unit          : request.body.Unit ?? 'hrs',
        };

        return sleepModel;
    };

    static create = async (request: express.Request): Promise<SleepDomainModel> => {
        await SleepValidator.validateBody(request);
        return SleepValidator.getDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await SleepValidator.getParamId(request);
    };

    static delete = async (request: express.Request): Promise<string> => {
        return await SleepValidator.getParamId(request);
    };

    static search = async (request: express.Request): Promise<SleepSearchFilters> => {

        await query('patientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('sleepDuration').optional()
            .trim()
            .escape()
            .isDecimal()
            .run(request);

        await query('recordDate').optional()
            .trim()
            .escape()
            .isDate()
            .run(request);

        await query('unit').optional()
            .trim()
            .escape()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        return SleepValidator.getFilter(request);
    };

    static update = async (request: express.Request): Promise<SleepDomainModel> => {

        const id = await SleepValidator.getParamId(request);
        await SleepValidator.validateBody(request);

        const domainModel = SleepValidator.getDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

    private static async validateBody(request) {

        await body('PatientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('SleepDuration').optional()
            .trim()
            .escape()
            .isDecimal()
            .run(request);

        await body('RecordDate').optional()
            .trim()
            .escape()
            .isDate()
            .run(request);

        await body('Unit').optional()
            .trim()
            .escape()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
    }

    private static getFilter(request): SleepSearchFilters {
        const pageIndex = request.query.pageIndex !== 'undefined' ? parseInt(request.query.pageIndex as string, 10) : 0;

        const itemsPerPage =
            request.query.itemsPerPage !== 'undefined' ? parseInt(request.query.itemsPerPage as string, 10) : 25;

        const filters: SleepSearchFilters = {
            PatientUserId   : request.query.patientUserId ?? null,
            MinValue        : request.query.minValue ?? null,
            MaxValue        : request.query.maxValue ?? null,
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

}
