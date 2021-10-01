import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { Helper } from '../../../common/helper';
import { EmergencyEventDomainModel } from '../../../domain.types/clinical/emergency.event/emergency.event.domain.model';
import { EmergencyEventSearchFilters } from '../../../domain.types/clinical/emergency.event/emergency.event.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class EmergencyEventValidator {

    static getDomainModel = (request: express.Request): EmergencyEventDomainModel => {

        const emergencyEventModel: EmergencyEventDomainModel = {
            EhrId         : request.body.EhrId ?? undefined,
            PatientUserId : request.body.PatientUserId ?? undefined,
            Details       : request.body.Details ?? "",
            EmergencyDate : request.body.EmergencyDate
        };

        return emergencyEventModel;
    };

    static create = async (request: express.Request): Promise<EmergencyEventDomainModel> => {
        await EmergencyEventValidator.validateBody(request);
        return EmergencyEventValidator.getDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await EmergencyEventValidator.getParamId(request);
    };

    static delete = async (request: express.Request): Promise<string> => {
        return await EmergencyEventValidator.getParamId(request);
    };

    static search = async (request: express.Request): Promise<EmergencyEventSearchFilters> => {

        await query('PatientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('MedicalPractitionerUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('EmergencyDateFrom').optional()
            .trim()
            .escape()
            .toDate()
            .run(request);

        await query('EmergencyDateTo').optional()
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

        return EmergencyEventValidator.getFilter(request);
    };

    static update = async (request: express.Request): Promise<EmergencyEventDomainModel> => {

        const id = await EmergencyEventValidator.getParamId(request);
        await EmergencyEventValidator.validateBody(request);

        const domainModel = EmergencyEventValidator.getDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

    private static async validateBody(request) {

        await body('EhrId').optional()
            .trim()
            .escape()
            .optional()
            .run(request);

        await body('PatientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('Details').optional()
            .trim()
            .escape()
            .run(request);

        await body('EmergencyDate').optional()
            .trim()
            .escape()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
    }

    private static getFilter(request): EmergencyEventSearchFilters {
        const pageIndex = request.query.pageIndex !== 'undefined' ? parseInt(request.query.pageIndex as string, 10) : 0;

        const itemsPerPage =
            request.query.itemsPerPage !== 'undefined' ? parseInt(request.query.itemsPerPage as string, 10) : 25;

        const filters: EmergencyEventSearchFilters = {
            PatientUserId             : request.query.PatientUserId ?? null,
            MedicalPractitionerUserId : request.query.MedicalPractitionerUserId ?? null,
            EmergencyDateFrom         : request.query.EmergencyDateFrom ?? null,
            EmergencyDateTo           : request.query.EmergencyDateTo ?? null,
            OrderBy                   : request.query.orderBy ?? 'CreatedAt',
            Order                     : request.query.order ?? 'descending',
            PageIndex                 : pageIndex,
            ItemsPerPage              : itemsPerPage,
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
