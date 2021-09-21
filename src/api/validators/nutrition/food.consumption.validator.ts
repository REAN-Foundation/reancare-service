import express from 'express';
import { body, param, validationResult, query } from 'express-validator';
import { Helper } from '../../../common/helper';
import { FoodConsumptionDomainModel } from '../../../domain.types/nutrition/food.consumption/food.consumption.domain.model';
import { FoodConsumptionSearchFilters } from '../../../domain.types/nutrition/food.consumption/food.consumption.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class FoodConsumptionValidator {

    static getDomainModel = (request: express.Request): FoodConsumptionDomainModel => {

        const FoodConsumptionModel: FoodConsumptionDomainModel = {
            PatientUserId   : request.body.PatientUserId ?? null,
            Food            : request.body.Food,
            Description     : request.body.Description ?? null,
            ConsumedAs      : request.body.ConsumedAs ?? null,
            Calories        : request.body.Calories ?? null,
            ImageResourceId : request.body.ImageResourceId ?? null,
            StartTime       : request.body.StartTime ?? null,
            EndTime         : request.body.EndTime ?? null,
        };

        return FoodConsumptionModel;
    };

    static create = async (request: express.Request): Promise<FoodConsumptionDomainModel> => {
        await FoodConsumptionValidator.validateBody(request);
        return FoodConsumptionValidator.getDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await FoodConsumptionValidator.getParamId(request);
    };

    static getByEvent = async (request: express.Request): Promise<string> => {
        return await FoodConsumptionValidator.getParamEvent(request);
    };

    static getForDay = async (request: express.Request): Promise<Date> => {
        return await FoodConsumptionValidator.getParamDate(request);
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
        return await FoodConsumptionValidator.getParamId(request);
    };

    static search = async (request: express.Request): Promise<FoodConsumptionSearchFilters> => {

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

        return FoodConsumptionValidator.getFilter(request);
    };

    static update = async (request: express.Request): Promise<FoodConsumptionDomainModel> => {

        const id = await FoodConsumptionValidator.getParamId(request);
        await FoodConsumptionValidator.validateBody(request);

        const domainModel = FoodConsumptionValidator.getDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

    private static async validateBody(request) {

        await body('PatientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('FoodConsumption').optional()
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

    private static getFilter(request): FoodConsumptionSearchFilters {
        const pageIndex = request.query.PageIndex !== 'undefined' ? parseInt(request.query.PageIndex as string, 10) : 0;

        const itemsPerPage =
            request.query.ItemsPerPage !== 'undefined' ? parseInt(request.query.ItemsPerPage as string, 10) : 25;

        const filters: FoodConsumptionSearchFilters = {
            PatientUserId : request.query.patientUserId ?? null,
            Food          : request.query.food ?? null,
            ConsumedAs    : request.query.consumedAs ?? null,
            TimeFrom      : request.query.timeFrom ?? null,
            TimeTo        : request.query.timeTo ?? null,
            ForDay        : request.query.forDay ?? null,
            OrderBy       : request.query.orderBy ?? 'CreatedAt',
            Order         : request.query.order ?? 'descending',
            PageIndex     : pageIndex,
            ItemsPerPage  : itemsPerPage,
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

    private static async getParamEvent(request) {

        await param('event').trim()
            .escape()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        return request.params.event;
    }

    private static async getParamDate(request) {

        await param('date').trim()
            .escape()
            .isDate()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        return request.params.date;
    }

}
