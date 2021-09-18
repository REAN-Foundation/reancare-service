import express from 'express';
import { body, param, validationResult, query } from 'express-validator';
import { Logger } from '../../../common/logger';
import { Helper } from '../../../common/helper';
import { BloodOxygenSaturationDomainModel } from '../../../domain.types/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.domain.model';
import { BloodOxygenSaturationSearchFilters } from '../../../domain.types/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class BloodOxygenSaturationValidator {

    static getDomainModel = (request: express.Request): BloodOxygenSaturationDomainModel => {

        const BloodOxygenSaturationModel: BloodOxygenSaturationDomainModel = {
            PatientUserId         : request.body.PatientUserId,
            BloodOxygenSaturation : request.body.BloodOxygenSaturation,
            Unit                  : request.body.Unit,
            RecordDate            : request.body.RecordDate ?? null,
            RecordedByUserId      : request.body.RecordedByUserId ?? null,

        };

        return BloodOxygenSaturationModel;
    };

    static create = async (request: express.Request): Promise<BloodOxygenSaturationDomainModel> => {
        await BloodOxygenSaturationValidator.validateBody(request);
        return BloodOxygenSaturationValidator.getDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await BloodOxygenSaturationValidator.getParamId(request);
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
        return await BloodOxygenSaturationValidator.getParamId(request);
    };

    static search = async (request: express.Request): Promise<BloodOxygenSaturationSearchFilters> => {

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

        return BloodOxygenSaturationValidator.getFilter(request);
    };

    static update = async (request: express.Request): Promise<BloodOxygenSaturationDomainModel> => {

        const id = await BloodOxygenSaturationValidator.getParamId(request);
        await BloodOxygenSaturationValidator.validateBody(request);

        const domainModel = BloodOxygenSaturationValidator.getDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

    private static async validateBody(request) {

        await body('PatientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('BloodOxygenSaturation').optional()
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

    private static getFilter(request): BloodOxygenSaturationSearchFilters {
        const pageIndex = request.query.PageIndex !== 'undefined' ? parseInt(request.query.PageIndex as string, 10) : 0;

        const itemsPerPage =
            request.query.ItemsPerPage !== 'undefined' ? parseInt(request.query.ItemsPerPage as string, 10) : 25;

        const filters: BloodOxygenSaturationSearchFilters = {
            PatientUserId    : request.query.patientUserId ?? null,
            MinValue         : request.query.minValue ?? null,
            MaxValue         : request.query.maxValue ?? null,
            CreatedDateFrom  : request.query.createdDateFrom ?? null,
            CreatedDateTo    : request.query.createdDateTo ?? null,
            RecordedByUserId : request.query.recordedByUserId ?? null,
            OrderBy          : request.query.orderBy ?? 'CreatedAt',
            Order            : request.query.order ?? 'descending',
            PageIndex        : pageIndex,
            ItemsPerPage     : itemsPerPage,
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
