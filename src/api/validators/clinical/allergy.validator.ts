import express from 'express';
import { body, param, validationResult } from 'express-validator';

import { Helper } from '../../../common/helper';
import { AllergyDomainModel } from '../../../domain.types/clinical/allergy/allergy.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

export class PatientAllergyValidator {

    static getDomainModel = (request: express.Request): AllergyDomainModel => {

        const patientAllergyModel: AllergyDomainModel = {
            PatientUserId         : request.body.PatientUserId ?? null,
            Allergy               : request.body.Allergy ?? null,
            AllergenCategory      : request.body.AllergenCategory ?? null,
            AllergenExposureRoute : request.body.AllergenExposureRoute,
            Severity              : request.body.Severity ?? null,
            Reaction              : request.body.Reaction ?? null,
            OtherInformation      : request.body.OtherInformation ?? null,
            LastOccurrence        : request.body.LastOccurrence ?? null,
        };

        return patientAllergyModel;
    };

    static create = async (request: express.Request): Promise<AllergyDomainModel> => {
        await PatientAllergyValidator.validateBody(request);
        return PatientAllergyValidator.getDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await PatientAllergyValidator.getParamId(request);
    };

    static delete = async (request: express.Request): Promise<string> => {
        return await PatientAllergyValidator.getParamId(request);
    };

    static search = async (request: express.Request): Promise<string> => {
        return await PatientAllergyValidator.getParamId(request);
    };

    static update = async (request: express.Request): Promise<AllergyDomainModel> => {

        const id = await PatientAllergyValidator.getParamId(request);
        await PatientAllergyValidator.validateBody(request);

        const domainModel = PatientAllergyValidator.getDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

    private static async validateBody(request) {

        await body('PatientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('Allergy').exists()
            .trim()
            .escape()
            .run(request);

        await body('AllergenCategory').optional()
            .trim()
            .escape()
            .run(request);

        await body('AllergenExposureRoute').optional()
            .trim()
            .run(request);

        await body('Severity').optional()
            .trim()
            .escape()
            .run(request);

        await body('Reaction').optional()
            .trim()
            .escape()
            .run(request);

        await body('OtherInformation').optional()
            .trim()
            .escape()
            .run(request);

        await body('LastOccurrence').optional()
            .trim()
            .escape()
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
