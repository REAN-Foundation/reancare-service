import express from 'express';
import { body, param, validationResult, query } from 'express-validator';

import { Helper } from '../../../common/helper';
import { BodyHeightDomainModel } from '../../../domain.types/biometrics/body.height/body.height.domain.model';
import { BodyHeightSearchFilters } from '../../../domain.types/biometrics/body.height/body.height.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class BodyHeightValidator {

    static getDomainModel = (request: express.Request): BodyHeightDomainModel => {

        const bodyHeightModel: BodyHeightDomainModel = {
            PatientUserId : request.body.PatientUserId ?? null,
            BodyHeight    : request.body.BodyHeight ?? null,
            Unit          : request.body.Unit,
        };

        return bodyHeightModel;
    };

    static create = async (request: express.Request): Promise<BodyHeightDomainModel> => {
        await BodyHeightValidator.validateBody(request);
        return BodyHeightValidator.getDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await BodyHeightValidator.getParamId(request);
    };

    static delete = async (request: express.Request): Promise<string> => {
        return await BodyHeightValidator.getParamId(request);
    };

    static search = async (request: express.Request): Promise<BodyHeightSearchFilters> => {

        await query('MaxValue').optional()
            .trim()
            .escape()
            .isDecimal()
            .run(request);

        await query('MinValue').optional()
            .trim()
            .escape()
            .isDecimal()
            .run(request);

        await query('createdDateFrom').optional()
            .trim()
            .escape()
            .toDate()
            .run(request);

        await query('PatientUserId').optional()
            .trim()
            .escape()
            .isUUID()
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

        return BodyHeightValidator.getFilter(request);
    };

    static update = async (request: express.Request): Promise<BodyHeightDomainModel> => {

        const id = await BodyHeightValidator.getParamId(request);
        await BodyHeightValidator.validateBody(request);

        const domainModel = BodyHeightValidator.getDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

    private static async validateBody(request) {

        await body('PatientUserId').exists()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('BodyHeight').exists()
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

    private static getFilter(request): BodyHeightSearchFilters {
        const pageIndex = request.query.pageIndex !== 'undefined' ? parseInt(request.query.pageIndex as string, 10) : 0;

        const itemsPerPage =
            request.query.itemsPerPage !== 'undefined' ? parseInt(request.query.itemsPerPage as string, 10) : 25;

        const filters: BodyHeightSearchFilters = {
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
