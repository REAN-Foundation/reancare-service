import express from 'express';
import { body, param, validationResult, query } from 'express-validator';
import { Helper } from '../../../common/helper';
import { MedicalConditionDomainModel } from '../../../domain.types/static.types/medical.condition/medical.condition.domain.model';
import { MedicalConditionSearchFilters } from '../../../domain.types/static.types/medical.condition/medical.condition.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class MedicalConditionValidator {

    static getDomainModel = (request: express.Request): MedicalConditionDomainModel => {

        const MedicalConditionModel: MedicalConditionDomainModel = {
            Condition   : request.body.Condition,
            Description : request.body.Description,
            Language    : request.body.Language,
        };

        return MedicalConditionModel;
    };

    static create = async (request: express.Request): Promise<MedicalConditionDomainModel> => {
        await MedicalConditionValidator.validateBody(request);
        return MedicalConditionValidator.getDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await MedicalConditionValidator.getParamId(request);
    };

    static delete = async (request: express.Request): Promise<string> => {
        return await MedicalConditionValidator.getParamId(request);
    };

    static search = async (request: express.Request): Promise<MedicalConditionSearchFilters> => {

        await query('condition').optional()
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

        return MedicalConditionValidator.getFilter(request);
    };

    static update = async (request: express.Request): Promise<MedicalConditionDomainModel> => {

        const id = await MedicalConditionValidator.getParamId(request);
        await MedicalConditionValidator.validateBody(request);

        const domainModel = MedicalConditionValidator.getDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

    private static async validateBody(request) {

        await body('Condition').optional()
            .trim()
            .escape()
            .run(request);

        await body('Description').optional()
            .trim()
            .escape()
            .run(request);

        await body('Language').optional()
            .trim()
            .escape()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
    }

    private static getFilter(request): MedicalConditionSearchFilters {
        const pageIndex = request.query.PageIndex !== 'undefined' ? parseInt(request.query.PageIndex as string, 10) : 0;

        const itemsPerPage =
            request.query.ItemsPerPage !== 'undefined' ? parseInt(request.query.ItemsPerPage as string, 10) : 25;

        const filters: MedicalConditionSearchFilters = {
            Condition    : request.query.Condition ?? null,
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
