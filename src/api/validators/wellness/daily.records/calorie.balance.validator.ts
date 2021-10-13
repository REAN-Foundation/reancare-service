import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { Helper } from '../../../../common/helper';
import { CalorieBalanceDomainModel } from '../../../../domain.types/wellness/daily.records/calorie.balance/calorie.balance.domain.model';
import { CalorieBalanceSearchFilters } from '../../../../domain.types/wellness/daily.records/calorie.balance/calorie.balance.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class CalorieBalanceValidator {

    static getDomainModel = (request: express.Request): CalorieBalanceDomainModel => {

        const calorieBalanceModel: CalorieBalanceDomainModel = {
            PatientUserId    : request.body.PatientUserId ?? null,
            CaloriesConsumed : request.body.CaloriesConsumed ?? 0,
            CaloriesBurned   : request.body.CaloriesBurned ?? 0,
            Unit             : request.body.Unit ?? 'kcal',
        };

        return calorieBalanceModel;
    };

    static create = async (request: express.Request): Promise<CalorieBalanceDomainModel> => {
        await CalorieBalanceValidator.validateBody(request);
        return CalorieBalanceValidator.getDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await CalorieBalanceValidator.getParamId(request);
    };

    static delete = async (request: express.Request): Promise<string> => {
        return await CalorieBalanceValidator.getParamId(request);
    };

    static search = async (request: express.Request): Promise<CalorieBalanceSearchFilters> => {

        await query('PatientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('CaloriesConsumed').optional()
            .trim()
            .escape()
            .isDecimal()
            .run(request);

        await query('CaloriesBurned').optional()
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

        return CalorieBalanceValidator.getFilter(request);
    };

    static update = async (request: express.Request): Promise<CalorieBalanceDomainModel> => {

        const id = await CalorieBalanceValidator.getParamId(request);
        await CalorieBalanceValidator.validateBody(request);

        const domainModel = CalorieBalanceValidator.getDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

    private static async validateBody(request) {

        await body('PatientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('CaloriesConsumed').optional()
            .trim()
            .escape()
            .isDecimal()
            .run(request);

        await body('CaloriesBurned').optional()
            .trim()
            .escape()
            .isDecimal()
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

    private static getFilter(request): CalorieBalanceSearchFilters {
        const pageIndex = request.query.pageIndex !== 'undefined' ? parseInt(request.query.pageIndex as string, 10) : 0;

        const itemsPerPage =
            request.query.itemsPerPage !== 'undefined' ? parseInt(request.query.itemsPerPage as string, 10) : 25;

        const filters: CalorieBalanceSearchFilters = {
            PatientUserId            : request.query.patientUserId ?? null,
            MinCaloriesConsumedValue : request.query.minCaloriesConsumedValue ?? null,
            MaxCaloriesConsumedValue : request.query.maxCaloriesConsumedValue ?? null,
            MinCaloriesBurnedValue   : request.query.minCaloriesBurnedValue ?? null,
            MaxCaloriesBurnedValue   : request.query.maxCaloriesBurnedValue ?? null,
            MinCalorieBalanceValue   : request.query.minCalorieBalanceValue ?? null,
            MaxCalorieBalanceValue   : request.query.maxCalorieBalanceValue ?? null,
            CreatedDateFrom          : request.query.createdDateFrom ?? null,
            CreatedDateTo            : request.query.createdDateTo ?? null,
            OrderBy                  : request.query.orderBy ?? 'CreatedAt',
            Order                    : request.query.order ?? 'descending',
            PageIndex                : pageIndex,
            ItemsPerPage             : itemsPerPage,
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
