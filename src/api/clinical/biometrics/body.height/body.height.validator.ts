import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { Helper } from '../../../../common/helper';
import { BodyHeightDomainModel } from '../../../../domain.types/clinical/biometrics/body.height/body.height.domain.model';
import { BodyHeightSearchFilters } from '../../../../domain.types/clinical/biometrics/body.height/body.height.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class BodyHeightValidator {

    static getCreateDomainModel = (request: express.Request): BodyHeightDomainModel => {

        const bodyHeightModel: BodyHeightDomainModel = {
            PatientUserId    : request.body.PatientUserId ?? null,
            BodyHeight       : request.body.BodyHeight ?? null,
            Unit             : request.body.Unit,
            RecordDate       : request.body.RecordDate ?? new Date(),
            RecordedByUserId : request.body.RecordedByUserId ?? request.currentUser.UserId,
        };

        return bodyHeightModel;
    };

    static getUpdateDomainModel = (request: express.Request): BodyHeightDomainModel => {

        const bodyHeightModel: BodyHeightDomainModel = {
            PatientUserId    : request.body.PatientUserId ?? null,
            BodyHeight       : request.body.BodyHeight ?? null,
            Unit             : request.body.Unit,
            RecordDate       : request.body.RecordDate ?? new Date(),
            RecordedByUserId : request.body.RecordedByUserId ?? request.currentUser.UserId,
        };

        return bodyHeightModel;
    };

    static create = async (request: express.Request): Promise<BodyHeightDomainModel> => {
        await BodyHeightValidator.validateCreateBody(request);
        return BodyHeightValidator.getCreateDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await BodyHeightValidator.getParamId(request);
    };

    static delete = async (request: express.Request): Promise<string> => {
        return await BodyHeightValidator.getParamId(request);
    };

    static search = async (request: express.Request): Promise<BodyHeightSearchFilters> => {

        await query('maxValue').optional()
            .trim()
            .escape()
            .isDecimal()
            .run(request);

        await query('minValue').optional()
            .trim()
            .escape()
            .isDecimal()
            .run(request);

        await query('createdDateFrom').optional()
            .trim()
            .escape()
            .toDate()
            .run(request);

        await query('patientUserId').optional()
            .trim()
            .escape()
            .isUUID()
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

        return BodyHeightValidator.getFilter(request);
    };

    static update = async (request: express.Request): Promise<BodyHeightDomainModel> => {

        const id = await BodyHeightValidator.getParamId(request);
        await BodyHeightValidator.validateCreateBody(request);

        const domainModel = BodyHeightValidator.getCreateDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

    private static async validateCreateBody(request) {

        await body('PatientUserId').exists()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('BodyHeight').exists()
            .trim()
            .escape()
            .toFloat()
            .run(request);

        await body('Unit').exists()
            .trim()
            .run(request);

        await body('RecordDate').optional()
            .trim()
            .escape()
            .toDate()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
    }

    private static getFilter(request): BodyHeightSearchFilters {
        const pageIndex = request.query.pageIndex !== 'undefined' ? parseInt(request.query.pageIndex as string, 10) : 0;

        const itemsPerPage =
            request.query.itemsPerPage !== 'undefined' ? parseInt(request.query.itemsPerPage as string, 10) : 25;

        const filters: BodyHeightSearchFilters = {
            PatientUserId   : request.query.patientUserId ?? null,
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
