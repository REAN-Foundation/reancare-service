// visit.validator.ts
import express from 'express';
import { VisitDomainModel } from '../../../domain.types/clinical/visit/visit.domain.model';
import { VisitSearchFilters } from '../../../domain.types/clinical/visit/visit.search.type';
import { BaseValidator, Where } from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class VisitValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): VisitDomainModel => {
        const visitModel: VisitDomainModel = {
            VisitType                 : request.body.VisitType,
            EhrId                     : request.body.EhrId ?? null,
            DisplayId                 : request.body.DisplayId ?? null,
            PatientUserId             : request.body.PatientUserId,
            MedicalPractitionerUserId : request.body.MedicalPractitionerUserId ?? null,
            ReferenceVisitId          : request.body.ReferenceVisitId ?? null,
            CurrentState              : request.body.CurrentState,
            StartDate                 : request.body.StartDate ?? new Date(),
            EndDate                   : request.body.EndDate ?? null,
            FulfilledAtOrganizationId : request.body.FulfilledAtOrganizationId ?? null,
            AdditionalInformation     : request.body.AdditionalInformation,
        };
        return visitModel;
    };

    create = async (request: express.Request): Promise<VisitDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<VisitSearchFilters> => {
        await this.validateString(request, 'VisitType', Where.Query, false, false);
        await this.validateUuid(request, 'PatientUserId', Where.Query, false, false);
        await this.validateUuid(request, 'MedicalPractitionerUserId', Where.Query, false, false);
        await this.validateUuid(request, 'ReferenceVisitId', Where.Query, false, false);
        await this.validateString(request, 'CurrentState', Where.Query, false, false);
        await this.validateDate(request, 'StartDate', Where.Query, false, false);
        await this.validateDate(request, 'EndDate', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return VisitValidator.getFilter(request);
    };

    update = async (request: express.Request): Promise<VisitDomainModel> => {
        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private async validateCreateBody(request) {
        await this.validateString(request, 'VisitType', Where.Body, false, true);
        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateString(request, 'DisplayId', Where.Body, true, false);
        await this.validateUuid(request, 'MedicalPractitionerUserId', Where.Body, true, false);
        await this.validateUuid(request, 'ReferenceVisitId', Where.Body, false, true);
        await this.validateString(request, 'CurrentState', Where.Body, false, true);
        await this.validateDate(request, 'StartDate', Where.Body, false, true);
        await this.validateDate(request, 'EndDate', Where.Body, false, false);
        await this.validateUuid(request, 'FulfilledAtOrganizationId', Where.Body, false, false);
        await this.validateString(request, 'AdditionalInformation', Where.Body, false, false);

        this.validateRequest(request);
    }

    private async validateUpdateBody(request) {
        await this.validateString(request, 'VisitType', Where.Body, false, false);
        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateString(request, 'DisplayId', Where.Body, false, false);
        await this.validateUuid(request, 'MedicalPractitionerUserId', Where.Body, false, false);
        await this.validateUuid(request, 'ReferenceVisitId', Where.Body, false, false);
        await this.validateString(request, 'CurrentState', Where.Body, false, false);
        await this.validateDate(request, 'StartDate', Where.Body, false, false);
        await this.validateDate(request, 'EndDate', Where.Body, false, false);
        await this.validateUuid(request, 'FulfilledAtOrganizationId', Where.Body, false, false);
        await this.validateString(request, 'AdditionalInformation', Where.Body, false, false);

        this.validateRequest(request);
    }

    private static getFilter(request): VisitSearchFilters {
        const filters: VisitSearchFilters = {
            VisitType                 : request.query.VisitType ?? null,
            EhrId                     : request.query.EhrId ?? null,
            PatientUserId             : request.query.PatientUserId ?? null,
            MedicalPractitionerUserId : request.query.MedicalPractitionerUserId ?? null,
            ReferenceVisitId          : request.query.ReferenceVisitId ?? null,
            CurrentState              : request.query.CurrentState ?? null,
            StartDate                 : request.query.StartDate ?? null,
            EndDate                   : request.query.EndDate ?? null,
        };
        return  filters;
    }

}
