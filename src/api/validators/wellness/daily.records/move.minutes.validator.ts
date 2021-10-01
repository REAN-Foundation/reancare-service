import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { Helper } from '../../../../common/helper';
import { MoveMinutesDomainModel } from '../../../../domain.types/wellness/daily.records/move.minutes/move.minutes.domain.model';
import { MoveMinutesSearchFilters } from '../../../../domain.types/wellness/daily.records/move.minutes/move.minutes.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class MoveMinutesValidator {

    static getDomainModel = (request: express.Request): MoveMinutesDomainModel => {

        const MoveMinutesModel: MoveMinutesDomainModel = {
            PatientUserId : request.body.PatientUserId,
            MoveMinutes   : request.body.MoveMinutes,
            Unit          : request.body.Unit,
            RecordDate    : request.body.RecordDate ?? null,
        };

        return MoveMinutesModel;
    };

    static create = async (request: express.Request): Promise<MoveMinutesDomainModel> => {
        await MoveMinutesValidator.validateBody(request);
        return MoveMinutesValidator.getDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await MoveMinutesValidator.getParamId(request);
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

    static delete = async (request: express.Request): Promise<string> => {
        return await MoveMinutesValidator.getParamId(request);
    };

    static search = async (request: express.Request): Promise<MoveMinutesSearchFilters> => {

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

        return MoveMinutesValidator.getFilter(request);
    };

    static update = async (request: express.Request): Promise<MoveMinutesDomainModel> => {

        const id = await MoveMinutesValidator.getParamId(request);
        await MoveMinutesValidator.validateBody(request);

        const domainModel = MoveMinutesValidator.getDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

    private static async validateBody(request) {

        await body('PatientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('MoveMinutes').optional()
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

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
    }

    private static getFilter(request): MoveMinutesSearchFilters {
        const pageIndex = request.query.PageIndex !== 'undefined' ? parseInt(request.query.PageIndex as string, 10) : 0;

        const itemsPerPage =
            request.query.ItemsPerPage !== 'undefined' ? parseInt(request.query.ItemsPerPage as string, 10) : 25;

        const filters: MoveMinutesSearchFilters = {
            PatientUserId   : request.query.patientUserId ?? null,
            MinValue        : request.query.minValue ?? null,
            MaxValue        : request.query.maxValue ?? null,
            CreatedDateFrom : request.query.createdDateFrom ?? null,
            CreatedDateTo   : request.query.createdDateTo ?? null,
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
