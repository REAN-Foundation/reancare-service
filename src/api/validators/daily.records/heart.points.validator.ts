import express from 'express';
import { body, param, validationResult, query } from 'express-validator';

import { Helper } from '../../../common/helper';
import { HeartPointsDomainModel } from '../../../domain.types/daily.records/heart.points/heart.points.domain.model';
import { HeartPointsSearchFilters } from '../../../domain.types/daily.records/heart.points/heart.points.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class HeartPointValidator {

    static getDomainModel = (request: express.Request): HeartPointsDomainModel => {

        const addressModel: HeartPointsDomainModel = {
            PersonId      : request.body.PersonId ?? null,
            HeartPoints   : request.body.HeartPoints ?? null,
            Unit          : request.body.Unit,
            PatientUserId : request.body.PatientUserId ?? null
        };

        return addressModel;
    };

    static create = async (request: express.Request): Promise<HeartPointsDomainModel> => {
        await HeartPointValidator.validateBody(request);
        return HeartPointValidator.getDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await HeartPointValidator.getParamId(request);
    };

    static delete = async (request: express.Request): Promise<string> => {
        return await HeartPointValidator.getParamId(request);
    };

    static search = async (request: express.Request): Promise<HeartPointsSearchFilters> => {

        await query('personId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('patientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('minValue').optional()
            .trim()
            .escape()
            .isDecimal()
            .run(request);

        await query('maxValue').optional()
            .trim()
            .escape()
            .isDecimal()
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

        return HeartPointValidator.getFilter(request);
    };

    static update = async (request: express.Request): Promise<HeartPointsDomainModel> => {

        const id = await HeartPointValidator.getParamId(request);
        await HeartPointValidator.validateBody(request);

        const domainModel = HeartPointValidator.getDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

    private static async validateBody(request) {

        await body('PersonId').exists()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('PatientUserId').exists()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('HeartPoints').exists()
            .trim()
            .escape()
            .run(request);

        await body('Unit').exists()
            .trim()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
    }

    private static getFilter(request): HeartPointsSearchFilters {
        const pageIndex = request.query.pageIndex !== 'undefined' ? parseInt(request.query.pageIndex as string, 10) : 0;

        const itemsPerPage =
            request.query.itemsPerPage !== 'undefined' ? parseInt(request.query.itemsPerPage as string, 10) : 25;

        const filters: HeartPointsSearchFilters = {
            PersonId        : request.query.personId ?? null,
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
