import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { Helper } from '../../../common/helper';
import { DocumentDomainModel } from '../../../domain.types/patient/document/document.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

export class DocumentValidator {

    static getDomainModel = (request: express.Request): DocumentDomainModel => {

        const DocumentModel: DocumentDomainModel = {
            DocumentType              : request.body.DocumentType,
            PatientUserId             : request.body.PatientUserId,
            MedicalPractitionerUserId : request.body.MedicalPractitionerUserId ?? null,
            MedicalPractionerRole     : request.body.MedicalPractionerRole ?? null,
            UploadedByUserId          : request.body.UploadedByUserId ?? null,
            AssociatedVisitId         : request.body.AssociatedVisitId ?? null,
            AssociatedVisitType       : request.body.AssociatedVisitType ?? null,
            AssociatedOrderId         : request.body.AssociatedOrderId ?? null,
            AssociatedOrderType       : request.body.AssociatedOrderType ?? null,
            FileName                  : request.body.FileName ?? null,
            ResourceId                : request.body.ResourceId,
            AuthenticatedUrl          : request.body.AuthenticatedUrl,
            MimeType                  : request.body.MimeType ?? null,
            SizeInKBytes              : request.body.SizeInKBytes ?? null,
            RecordDate                : request.body.RecordDate ?? null,
            UploadedDate              : request.body.UploadedDate ?? null,

        };

        return DocumentModel;
    };
    
    static create = async (request: express.Request): Promise<DocumentDomainModel> => {
        await DocumentValidator.validateBody(request);
        return DocumentValidator.getDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await DocumentValidator.getParamId(request);
    };

    static delete = async (request: express.Request): Promise<string> => {
        return await DocumentValidator.getParamId(request);
    };

    static update = async (request: express.Request): Promise<DocumentDomainModel> => {

        const id = await DocumentValidator.getParamId(request);
        await DocumentValidator.validateBody(request);

        const domainModel = DocumentValidator.getDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

    private static async validateBody(request) {

        await body('DocumentType').optional()
            .trim()
            .escape()
            .run(request);

        await body('PatientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('MedicalPractitionerUserId').optional({ nullable: true })
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('MedicalPractionerRole').optional({ nullable: true })
            .trim()
            .escape()
            .run(request);

        await body('UploadedByUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('AssociatedVisitId').optional({ nullable: true })
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('AssociatedVisitType').optional({ nullable: true })
            .trim()
            .escape()
            .run(request);

        await body('AssociatedOrderId').optional({ nullable: true })
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('AssociatedOrderType').optional({ nullable: true })
            .trim()
            .escape()
            .run(request);

        await body('FileName').optional()
            .trim()
            .escape()
            .run(request);

        await body('ResourceId').optional({ nullable: true })
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('AuthenticatedUrl').optional({ nullable: true })
            .trim()
            .run(request);

        await body('MimeType').optional({ nullable: true })
            .trim()
            .escape()
            .run(request);

        await body('SizeInKBytes').optional({ nullable: true })
            .trim()
            .escape()
            .isFloat()
            .run(request);

        await body('RecordDate').optional({ nullable: true })
            .trim()
            .escape()
            .toDate()
            .run(request);

        await body('UploadedDate').optional({ nullable: true })
            .trim()
            .escape()
            .toDate()
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
