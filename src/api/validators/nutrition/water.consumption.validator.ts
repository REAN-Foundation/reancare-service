import express from 'express';
import { body, param, validationResult, query } from 'express-validator';
import { Helper } from '../../../common/helper';
import { WaterConsumptionDomainModel } from '../../../domain.types/nutrition/water.consumption/water.consumption.domain.model';
import { WaterConsumptionSearchFilters } from '../../../domain.types/nutrition/water.consumption/water.consumption.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class WaterConsumptionValidator {

    static getDomainModel = (request: express.Request): WaterConsumptionDomainModel => {

        const WaterConsumptionModel: WaterConsumptionDomainModel = {
            PatientUserId : request.body.PatientUserId,
            Volume        : request.body.Volume,
            Time          : request.body.Time ?? null,
        };

        return WaterConsumptionModel;
    };

    static create = async (request: express.Request): Promise<WaterConsumptionDomainModel> => {
        await WaterConsumptionValidator.validateBody(request);
        return WaterConsumptionValidator.getDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await WaterConsumptionValidator.getParamId(request);
    };

    static delete = async (request: express.Request): Promise<string> => {
        return await WaterConsumptionValidator.getParamId(request);
    };

    static search = async (request: express.Request): Promise<WaterConsumptionSearchFilters> => {

        await query('patientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('dailyVolumeFrom').optional()
            .trim()
            .escape()
            .toInt()
            .run(request);

        await query('dailyVolumeTo').optional()
            .trim()
            .escape()
            .toInt()
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

        return WaterConsumptionValidator.getFilter(request);
    };

    static update = async (request: express.Request): Promise<WaterConsumptionDomainModel> => {

        const id = await WaterConsumptionValidator.getParamId(request);
        await WaterConsumptionValidator.validateBody(request);

        const domainModel = WaterConsumptionValidator.getDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

    private static async validateBody(request) {

        await body('PatientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('Volume').optional()
            .trim()
            .escape()
            .toInt()
            .run(request);

        await body('Time').optional()
            .trim()
            .escape()
            .isDate()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
    }

    private static getFilter(request): WaterConsumptionSearchFilters {
        const pageIndex = request.query.PageIndex !== 'undefined' ? parseInt(request.query.PageIndex as string, 10) : 0;

        const itemsPerPage =
            request.query.ItemsPerPage !== 'undefined' ? parseInt(request.query.ItemsPerPage as string, 10) : 25;

        const filters: WaterConsumptionSearchFilters = {
            PatientUserId   : request.query.patientUserId ?? null,
            DailyVolumeFrom : request.query.dailyVolumeFrom ?? null,
            DailyVolumeTo   : request.query.dailyVolumeTo ?? null,
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
