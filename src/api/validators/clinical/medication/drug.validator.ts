import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { Helper } from '../../../../common/helper';
import { DrugDomainModel } from '../../../../domain.types/clinical/medication/drug/drug.domain.model';
import { DrugSearchFilters } from '../../../../domain.types/clinical/medication/drug/drug.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class DrugValidator {

    static getDomainModel = (request: express.Request): DrugDomainModel => {

        const DrugModel: DrugDomainModel = {
            DrugName             : request.body.DrugName,
            GenericName          : request.body.GenericName ?? null,
            Ingredients          : request.body.Ingredients ?? null,
            Strength             : request.body.Strength ?? null,
            OtherCommercialNames : request.body.OtherCommercialNames ?? null,
            Manufacturer         : request.body.Manufacturer ?? null,
            OtherInformation     : request.body.OtherInformation ?? null,

        };

        return DrugModel;
    };

    static create = async (request: express.Request): Promise<DrugDomainModel> => {
        await DrugValidator.validateBody(request);
        return DrugValidator.getDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await DrugValidator.getParamId(request);
    };

    static delete = async (request: express.Request): Promise<string> => {
        return await DrugValidator.getParamId(request);
    };

    static search = async (request: express.Request): Promise<DrugSearchFilters> => {

        await query('name').optional()
            .trim()
            .escape()
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

        return DrugValidator.getFilter(request);
    };

    static update = async (request: express.Request): Promise<DrugDomainModel> => {

        const id = await DrugValidator.getParamId(request);
        await DrugValidator.validateBody(request);

        const domainModel = DrugValidator.getDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

    private static async validateBody(request) {

        await body('DrugName').optional()
            .trim()
            .escape()
            .run(request);

        await body('GenericName').optional()
            .trim()
            .escape()
            .run(request);

        await body('Ingredients').optional()
            .trim()
            .escape()
            .run(request);

        await body('Strength').optional()
            .trim()
            .escape()
            .run(request);

        await body('OtherCommercialNames').optional()
            .trim()
            .escape()
            .run(request);
        
        await body('Manufacturer').optional()
            .trim()
            .escape()
            .run(request);

        await body('OtherInformation').optional()
            .trim()
            .escape()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
    }

    private static getFilter(request): DrugSearchFilters {
        const pageIndex = request.query.PageIndex !== 'undefined' ? parseInt(request.query.PageIndex as string, 10) : 0;

        const itemsPerPage =
            request.query.ItemsPerPage !== 'undefined' ? parseInt(request.query.ItemsPerPage as string, 10) : 25;

        const filters: DrugSearchFilters = {
            Name         : request.query.name ?? null,
            OrderBy      : request.query.orderBy ?? 'CreatedAt',
            Order        : request.query.order ?? 'descending',
            PageIndex    : pageIndex,
            ItemsPerPage : itemsPerPage,
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
