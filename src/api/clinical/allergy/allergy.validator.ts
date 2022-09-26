import express from 'express';
import { AllergyDomainModel } from '../../../domain.types/clinical/allergy/allergy.domain.model';
import { AllergySearchFilters } from '../../../domain.types/clinical/allergy/allergy.search.types';
import { BaseValidator, Where } from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class AllergyValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): AllergyDomainModel => {

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

    create = async (request: express.Request): Promise<AllergyDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (
        request: express.Request
    ): Promise<AllergySearchFilters> => {

        await this.validateUuid(request, 'patientUserId', Where.Query, false, false);
        await this.validateString(request, 'allergy', Where.Query, false, false, true);
        await this.validateString(request, 'allergenCategory', Where.Query, false, false, true);
        await this.validateString(request, 'allergenExposureRoute', Where.Query, false, false, true);
        await this.validateString(request, 'severity', Where.Query, false, false, true);
        await this.validateString(request, 'reaction', Where.Query, false, false, true);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);

    };

    private getFilter(request): AllergySearchFilters {

        var filters: AllergySearchFilters = {
            PatientUserId         : request.query.patientUserId ?? null,
            AllergenCategory      : request.query.allergenCategory ?? null,
            AllergenExposureRoute : request.query.allergenExposureRoute ?? null,
            Allergy               : request.query.allergy ?? null,
            Severity              : request.query.severity ?? null,
            Reaction              : request.query.reaction ?? null,
        };

        return this.updateBaseSearchFilters(request, filters);
    }

    update = async (request: express.Request): Promise<AllergyDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');

        return domainModel;
    };

    private async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateString(request, 'Allergy', Where.Body, true, false);
        await this.validateString(request, 'AllergenCategory', Where.Body, false, false);
        await this.validateString(request, 'AllergenExposureRoute', Where.Body, false, false);
        await this.validateString(request, 'Severity', Where.Body, true, false);
        await this.validateString(request, 'Reaction', Where.Body, false, false);

        this.validateRequest(request);

    }

    private async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateString(request, 'Allergy', Where.Body, false, false);
        await this.validateString(request, 'AllergenCategory', Where.Body, false, false);
        await this.validateString(request, 'AllergenExposureRoute', Where.Body, false, false);
        await this.validateString(request, 'Severity', Where.Body, false, false);
        await this.validateString(request, 'Reaction', Where.Body, false, false);

        this.validateRequest(request);

    }

}
