import express from 'express';
import { ComplaintDomainModel } from '../../../domain.types/clinical/complaint/complaint.domain.model';
import { BaseValidator, Where } from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class ComplaintValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): ComplaintDomainModel => {

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

    create = async (request: express.Request): Promise<ComplaintDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<string> => {
        return await this.getParamUuid(request, 'id');
    };

    update = async (request: express.Request): Promise<ComplaintDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');

        return domainModel;
    };

    private async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateUuid(request, 'MedicalPractitionerUserId', Where.Body, true, false);
        await this.validateUuid(request, 'VisitId', Where.Body, true, false);
        await this.validateUuid(request, 'EhrId', Where.Body, true, false);
        await this.validateString(request, 'Complaint', Where.Body, true, false);
        await this.validateString(request, 'Severity', Where.Body, true, false);
        await this.validateDate(request, 'RecordDate', Where.Body, false, false);

        this.validateRequest(request);
    }

    private async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateUuid(request, 'MedicalPractitionerUserId', Where.Body, false, false);
        await this.validateUuid(request, 'VisitId', Where.Body, false, false);
        await this.validateUuid(request, 'EhrId', Where.Body, false, false);
        await this.validateString(request, 'Complaint', Where.Body, false, false);
        await this.validateString(request, 'Severity', Where.Body, false, false);
        await this.validateDate(request, 'RecordDate', Where.Body, false, false);

        this.validateRequest(request);
    }

}
