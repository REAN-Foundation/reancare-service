import express from 'express';
import { body, param, validationResult, query } from 'express-validator';

import { Helper } from '../../../common/helper';
import { StepCountDomainModel } from '../../../domain.types/daily.records/StepCount/step.count.domain.model';
import { StepCountSearchFilters } from '../../../domain.types/daily.records/StepCount/step.count.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class StepCountValidator {

    static getDomainModel = (request: express.Request): StepCountDomainModel => {

        const stepCountModel: StepCountDomainModel = {
            PatientUserId : request.body.PatientUserId,
            StepCount     : request.body.StepCount ?? 0,
            Unit          : request.body.Unit ?? 'steps',
            RecordDate    : request.body.RecordDate ?? null,
        };

        return stepCountModel;
    };

    static create = async (request: express.Request): Promise<StepCountDomainModel> => {
        await StepCountValidator.validateBody(request);
        return StepCountValidator.getDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await StepCountValidator.getParamId(request);
    };

    static delete = async (request: express.Request): Promise<string> => {
        return await StepCountValidator.getParamId(request);
    };

    static search = async (request: express.Request): Promise<StepCountSearchFilters> => {

        await query('PatientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('StepCount').optional()
            .trim()
            .escape()
            .isDecimal()
            .run(request);

        await query('Unit').optional()
            .trim()
            .escape()
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

        return StepCountValidator.getFilter(request);
    };

    static update = async (request: express.Request): Promise<StepCountDomainModel> => {

        const id = await StepCountValidator.getParamId(request);
        await StepCountValidator.validateBody(request);

        const domainModel = StepCountValidator.getDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

    private static async validateBody(request) {

        await body('PatientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('StepCount').optional()
            .trim()
            .escape()
            .isDecimal()
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

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
    }

    private static getFilter(request): StepCountSearchFilters {
        const pageIndex = request.query.pageIndex !== 'undefined' ? parseInt(request.query.pageIndex as string, 10) : 0;

        const itemsPerPage =
            request.query.itemsPerPage !== 'undefined' ? parseInt(request.query.itemsPerPage as string, 10) : 25;

        const filters: StepCountSearchFilters = {
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
