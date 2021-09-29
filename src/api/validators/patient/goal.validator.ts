import express from 'express';
import { body, param, validationResult, query } from 'express-validator';

import { Helper } from '../../../common/helper';
import { GoalDomainModel } from '../../../domain.types/patient/goal/goal.domain.model';
import { GoalSearchFilters } from '../../../domain.types/patient/goal/goal.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class GoalValidator {

    static getDomainModel = (request: express.Request): GoalDomainModel => {

        const patientAllergyModel: GoalDomainModel = {
            PatientUserId : request.body.PatientUserId ?? null,
            CarePlanId    : request.body.CarePlanId ?? null,
            TypeCode      : request.body.TypeCode ?? null,
            TypeName      : request.body.TypeName ?? null,
            GoalId        : request.body.GoalId ?? null,
            GoalAchieved  : request.body.GoalAchieved ?? null,
            GoalAbandoned : request.body.GoalAbandoned ?? null
        };

        return patientAllergyModel;
    };

    static create = async (request: express.Request): Promise<GoalDomainModel> => {
        await GoalValidator.validateBody(request);
        return GoalValidator.getDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await GoalValidator.getParamId(request);
    };

    static delete = async (request: express.Request): Promise<string> => {
        return await GoalValidator.getParamId(request);
    };

    static search = async (request: express.Request): Promise<GoalSearchFilters> => {
        await query('PatientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('CarePlanId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('TypeCode').optional()
            .trim()
            .escape()
            .run(request);

        await query('TypeName').optional()
            .trim()
            .escape()
            .run(request);

        await query('GoalId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('GoalAchieved').optional()
            .trim()
            .escape()
            .isBoolean()
            .run(request);

        await query('GoalAbandoned').optional()
            .trim()
            .escape()
            .isBoolean()
            .run(request);

        await query('CreatedDateFrom').optional()
            .trim()
            .run(request);

        await query('CreatedDateTo').optional()
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

        return GoalValidator.getFilter(request);
    };

    private static getFilter(request): GoalSearchFilters {
        const pageIndex = request.query.pageIndex !== 'undefined' ? parseInt(request.query.pageIndex as string, 10) : 0;

        const itemsPerPage =
            request.query.itemsPerPage !== 'undefined' ? parseInt(request.query.itemsPerPage as string, 10) : 25;

        const filters: GoalSearchFilters = {
            PatientUserId   : request.query.PatientUserId ?? null,
            CarePlanId      : request.query.CarePlanId ?? null,
            TypeCode        : request.query.TypeCode ?? null,
            TypeName        : request.query.TypeName ?? null,
            GoalId          : request.query.GoalId ?? null,
            GoalAchieved    : request.query.GoalAchieved ?? null,
            GoalAbandoned   : request.query.GoalAbandoned ?? null,
            CreatedDateFrom : request.query.CreatedDateFrom ?? null,
            CreatedDateTo   : request.query.CreatedDateTo ?? null,
            OrderBy         : request.query.orderBy ?? 'GoalAchieved',
            Order           : request.query.order ?? 'descending',
            PageIndex       : pageIndex,
            ItemsPerPage    : itemsPerPage,
        };
        return filters;
    }

    static update = async (request: express.Request): Promise<GoalDomainModel> => {

        const id = await GoalValidator.getParamId(request);
        await GoalValidator.validateBody(request);

        const domainModel = GoalValidator.getDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

    private static async validateBody(request) {

        await body('PatientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('CarePlanId').exists()
            .trim()
            .escape()
            .run(request);

        await body('TypeCode').optional()
            .trim()
            .escape()
            .run(request);

        await body('TypeName').optional()
            .trim()
            .escape()
            .run(request);

        await body('GoalId').optional()
            .trim()
            .escape()
            .run(request);

        await body('GoalAchieved').optional()
            .trim()
            .escape()
            .isBoolean()
            .run(request);

        await body('GoalAbandoned').optional()
            .trim()
            .escape()
            .isBoolean()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
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
