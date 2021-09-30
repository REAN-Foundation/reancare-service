import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { Helper } from '../../../../common/helper';
import { HowDoYouFeelDomainModel } from '../../../../domain.types/clinical/symptom/how.do.you.feel/how.do.you.feel.domain.model';
import { HowDoYouFeelSearchFilters } from '../../../../domain.types/clinical/symptom/how.do.you.feel/how.do.you.feel.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class HowDoYouFeelValidator {

    static getDomainModel = (request: express.Request): HowDoYouFeelDomainModel => {

        const howDoYouFeelModel: HowDoYouFeelDomainModel = {
            EhrId         : request.body.EhrId ?? null,
            PatientUserId : request.body.PatientUserId ?? null,
            Feeling       : request.body.Feeling ?? null,
            Comments      : request.body.Comments,
            RecordDate    : request.body.RecordDate ?? null
        };

        return howDoYouFeelModel;
    };

    static create = async (request: express.Request): Promise<HowDoYouFeelDomainModel> => {
        await HowDoYouFeelValidator.validateBody(request);
        return HowDoYouFeelValidator.getDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await HowDoYouFeelValidator.getParamId(request);
    };

    static delete = async (request: express.Request): Promise<string> => {
        return await HowDoYouFeelValidator.getParamId(request);
    };

    static search = async (request: express.Request): Promise<HowDoYouFeelSearchFilters> => {

        await query('feeling').optional()
            .trim()
            .escape()
            .run(request);

        await query('patientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('dateFrom').optional()
            .trim()
            .escape()
            .isDate()
            .run(request);

        await query('dateTo').optional()
            .trim()
            .escape()
            .isDate()
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

        return HowDoYouFeelValidator.getFilter(request);
    };

    static update = async (request: express.Request): Promise<HowDoYouFeelDomainModel> => {

        const id = await HowDoYouFeelValidator.getParamId(request);
        await HowDoYouFeelValidator.validateBody(request);

        const domainModel = HowDoYouFeelValidator.getDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

    private static async validateBody(request) {

        await body('EhrId').optional()
            .trim()
            .escape()
            .run(request);

        await body('PatientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('Feeling').optional()
            .trim()
            .escape()
            .run(request);

        await body('Comments').optional()
            .trim()
            .escape()
            .run(request);

        await body('RecordDate').optional()
            .trim()
            .escape()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
    }

    private static getFilter(request): HowDoYouFeelSearchFilters {
        const pageIndex = request.query.pageIndex !== 'undefined' ? parseInt(request.query.pageIndex as string, 10) : 0;

        const itemsPerPage =
            request.query.itemsPerPage !== 'undefined' ? parseInt(request.query.itemsPerPage as string, 10) : 25;

        const filters: HowDoYouFeelSearchFilters = {
            Feeling       : request.query.Feeling ?? null,
            PatientUserId : request.query.PatientUserId ?? null,
            DateFrom      : request.query.DateFrom ?? null,
            DateTo        : request.query.DateTo ?? null,
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
