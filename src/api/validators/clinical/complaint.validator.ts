import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { Helper } from '../../../common/helper';
import { ComplaintDomainModel } from '../../../domain.types/clinical/complaint/complaint.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

export class ComplaintValidator {

    static getDomainModel = (request: express.Request): ComplaintDomainModel => {

        const complaintModel: ComplaintDomainModel = {
            PatientUserId             : request.body.PatientUserId ?? null,
            MedicalPractitionerUserId : request.body.MedicalPractitionerUserId ?? null,
            VisitId                   : request.body.VisitId ?? null,
            EhrId                     : request.body.EhrId ?? null,
            Complaint                 : request.body.Complaint ?? null,
            Severity                  : request.body.Severity ?? null,
            RecordDate                : request.body.RecordDate ?? null,
        };

        return complaintModel;
    };

    static create = async (request: express.Request): Promise<ComplaintDomainModel> => {
        await ComplaintValidator.validateBody(request);
        return ComplaintValidator.getDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await ComplaintValidator.getParamId(request);
    };

    static delete = async (request: express.Request): Promise<string> => {
        return await ComplaintValidator.getParamId(request);
    };

    static search = async (request: express.Request): Promise<string> => {
        return await ComplaintValidator.getParamId(request);
    };

    static update = async (request: express.Request): Promise<ComplaintDomainModel> => {

        const id = await ComplaintValidator.getParamId(request);
        await ComplaintValidator.validateBody(request);

        const domainModel = ComplaintValidator.getDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

    private static async validateBody(request) {

        await body('PatientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('MedicalPractitionerUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('VisitId').optional()
            .trim()
            .escape()
            .run(request);

        await body('EhrId').exists()
            .trim()
            .run(request);

        await body('Complaint').optional()
            .trim()
            .escape()
            .run(request);

        await body('Severity').optional()
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
