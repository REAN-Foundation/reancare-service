import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { Helper } from '../../../../common/helper';
import { PhysicalActivityDomainModel } from '../../../../domain.types/wellness/exercise/physical.activity/physical.activity.domain.model';
import { PhysicalActivitySearchFilters } from '../../../../domain.types/wellness/exercise/physical.activity/physical.activity.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class PhysicalActivityValidator {

    static getDomainModel = (request: express.Request): PhysicalActivityDomainModel => {

        const physicalActivityModel: PhysicalActivityDomainModel = {
            PatientUserId  : request.body.PatientUserId ?? null,
            Exercise       : request.body.Exercise ?? null,
            Description    : request.body.Description ?? null,
            Category       : request.body.Category,
            Intensity      : request.body.Intensity,
            CaloriesBurned : request.body.CaloriesBurned ?? null,
            StartTime      : request.body.StartTime ?? null,
            EndTime        : request.body.EndTime ?? null,
            DurationInMin  : request.body.DurationInMin ?? null,
        };

        return physicalActivityModel;
    };

    static create = async (request: express.Request): Promise<PhysicalActivityDomainModel> => {
        await PhysicalActivityValidator.validateBody(request);
        return PhysicalActivityValidator.getDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await PhysicalActivityValidator.getParamId(request);
    };

    static delete = async (request: express.Request): Promise<string> => {
        return await PhysicalActivityValidator.getParamId(request);
    };

    static search = async (request: express.Request): Promise<PhysicalActivitySearchFilters> => {

        await query('PatientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);
        
        await query('Exercise').optional()
            .trim()
            .escape()
            .run(request);

        await query('Category').optional()
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

        return PhysicalActivityValidator.getFilter(request);
    };

    static update = async (request: express.Request): Promise<PhysicalActivityDomainModel> => {

        const id = await PhysicalActivityValidator.getParamId(request);
        await PhysicalActivityValidator.validateBody(request);

        const domainModel = PhysicalActivityValidator.getDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

    private static async validateBody(request) {

        await body('PatientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('Exercise').exists()
            .trim()
            .escape()
            .run(request);

        await body('Description').optional()
            .trim()
            .escape()
            .run(request);

        await body('Category').optional()
            .trim()
            .run(request);

        await body('Intensity').optional()
            .trim()
            .escape()
            .run(request);

        await body('CaloriesBurned').optional()
            .trim()
            .escape()
            .run(request);

        await body('StartTime').optional()
            .trim()
            .escape()
            .run(request);
        
        await body('EndTime').optional()
            .trim()
            .escape()
            .run(request);

        await body('DurationInMin').optional()
            .trim()
            .escape()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
    }

    private static getFilter(request): PhysicalActivitySearchFilters {
        const pageIndex = request.query.pageIndex !== 'undefined' ? parseInt(request.query.pageIndex as string, 10) : 0;

        const itemsPerPage =
            request.query.itemsPerPage !== 'undefined' ? parseInt(request.query.itemsPerPage as string, 10) : 25;

        const filters: PhysicalActivitySearchFilters = {
            PatientUserId : request.query.patientUserId ?? null,
            Exercise      : request.query.exercise ?? null,
            Category      : request.query.category ?? null,
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

}
