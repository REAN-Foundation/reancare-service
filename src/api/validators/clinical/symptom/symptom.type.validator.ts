import express from 'express';
import { body, param, validationResult, query } from 'express-validator';
import { Helper } from '../../../../common/helper';
import { SymptomTypeDomainModel } from '../../../../domain.types/clinical/symptom/symptom.type/symptom.type.domain.model';
import { SymptomTypeSearchFilters } from '../../../../domain.types/clinical/symptom/symptom.type/symptom.type.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class SymptomTypeValidator {

    static getDomainModel = (request: express.Request): SymptomTypeDomainModel => {

        const model: SymptomTypeDomainModel = {
            id              : request.body.id ?? null,
            Symptom         : request.body.Symptom ?? null,
            Description     : request.body.Description ?? null,
            Language        : request.body.Language,
            Tags            : request.body.Tags ?? null,
            ImageResourceId : request.body.ImageResourceId ?? null,
        };

        return model;
    };

    static create = async (request: express.Request): Promise<SymptomTypeDomainModel> => {

        await body('Symptom').exists()
            .trim()
            .run(request);

        await body('Description').optional()
            .trim()
            .run(request);

        await body('Tags').optional()
            .run(request);

        await param('ImageResourceId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('Language').optional()
            .trim()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        return SymptomTypeValidator.getDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await SymptomTypeValidator.getParamId(request);
    };

    static delete = async (request: express.Request): Promise<string> => {
        return await SymptomTypeValidator.getParamId(request);
    };

    static search = async (request: express.Request): Promise<SymptomTypeSearchFilters> => {

        await query('symptom').optional()
            .trim()
            .run(request);

        await query('tag').optional()
            .trim()
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

        return SymptomTypeValidator.getFilter(request);
    };

    static update = async (request: express.Request): Promise<SymptomTypeDomainModel> => {

        await body('Symptom').optional()
            .trim()
            .run(request);

        await body('Description').optional()
            .trim()
            .run(request);

        await body('Tags').optional()
            .run(request);

        await param('ImageResourceId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('Language').optional()
            .trim()
            .run(request);

        const id = await SymptomTypeValidator.getParamId(request);
 
        const domainModel = SymptomTypeValidator.getDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

    private static getFilter(request): SymptomTypeSearchFilters {
        
        const pageIndex = request.query.pageIndex !== 'undefined' ?
            parseInt(request.query.pageIndex as string, 10) : 0;

        const itemsPerPage = request.query.itemsPerPage !== 'undefined' ?
            parseInt(request.query.itemsPerPage as string, 10) : 25;

        const filters: SymptomTypeSearchFilters = {
            Symptom      : request.query.symptom ?? null,
            Tag          : request.query.tag ?? null,
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
