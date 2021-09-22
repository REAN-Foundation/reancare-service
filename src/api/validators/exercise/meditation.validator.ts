import express from 'express';
import { body, param, validationResult, query } from 'express-validator';
import { Helper } from '../../../common/helper';
import { MeditationDomainModel } from '../../../domain.types/exercise/meditation/meditation.domain.model';
import { MeditationSearchFilters } from '../../../domain.types/exercise/meditation/meditation.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class MeditationValidator {

    static getDomainModel = (request: express.Request): MeditationDomainModel => {

        const MeditationModel: MeditationDomainModel = {
            PatientUserId : request.body.PatientUserId,
            Meditation    : request.body.Meditation,
            Description   : request.body.Description ?? null,
            Category      : request.body.Category ?? null,
            StartTime     : request.body.StartTime,
            EndTime       : request.body.EndTime ,

        };

        return MeditationModel;
    };

    static create = async (request: express.Request): Promise<MeditationDomainModel> => {
        await MeditationValidator.validateBody(request);
        return MeditationValidator.getDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await MeditationValidator.getParamId(request);
    };

    static delete = async (request: express.Request): Promise<string> => {
        return await MeditationValidator.getParamId(request);
    };

    static search = async (request: express.Request): Promise<MeditationSearchFilters> => {

        await query('patientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('meditation').optional()
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

        return MeditationValidator.getFilter(request);
    };

    static update = async (request: express.Request): Promise<MeditationDomainModel> => {

        const id = await MeditationValidator.getParamId(request);
        await MeditationValidator.validateBody(request);

        const domainModel = MeditationValidator.getDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

    private static async validateBody(request) {

        await body('PatientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('Meditation').optional()
            .trim()
            .escape()
            .run(request);

        await body('Description').optional()
            .trim()
            .escape()
            .run(request);

        await body('Category').optional()
            .trim()
            .escape()
            .run(request);

        await body('StartTime').optional()
            .trim()
            .escape()
            .toDate()
            .run(request);
        
        await body('EndTime').optional()
            .trim()
            .escape()
            .toDate()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
    }

    private static getFilter(request): MeditationSearchFilters {
        const pageIndex = request.query.PageIndex !== 'undefined' ? parseInt(request.query.PageIndex as string, 10) : 0;

        const itemsPerPage =
            request.query.ItemsPerPage !== 'undefined' ? parseInt(request.query.ItemsPerPage as string, 10) : 25;

        const filters: MeditationSearchFilters = {
            PatientUserId : request.query.patientUserId,
            Meditation    : request.query.meditation,
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
