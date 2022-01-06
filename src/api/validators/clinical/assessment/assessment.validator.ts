import express from 'express';
import { AssessmentDomainModel } from '../../../../domain.types/clinical/assessment/assessment.domain.model';
import { AssessmentSearchFilters } from '../../../../domain.types/clinical/assessment/assessment.search.types';
import { BaseValidator, Where } from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class AssessmentValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): AssessmentDomainModel => {

        const patientAssessmentModel: AssessmentDomainModel = {
            PatientUserId         : request.body.PatientUserId ?? null,
            Assessment            : request.body.Assessment ?? null,
            AllergenCategory      : request.body.AllergenCategory ?? null,
            AllergenExposureRoute : request.body.AllergenExposureRoute,
            Severity              : request.body.Severity ?? null,
            Reaction              : request.body.Reaction ?? null,
            OtherInformation      : request.body.OtherInformation ?? null,
            LastOccurrence        : request.body.LastOccurrence ?? null,
        };

        return patientAssessmentModel;
    };

    create = async (request: express.Request): Promise<AssessmentDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (
        request: express.Request
    ): Promise<AssessmentSearchFilters> => {

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

    private getFilter(request): AssessmentSearchFilters {

        var filters: AssessmentSearchFilters = {
            PatientUserId         : request.query.patientUserId ?? null,
            AllergenCategory      : request.query.allergenCategory ?? null,
            AllergenExposureRoute : request.query.allergenExposureRoute ?? null,
            Assessment            : request.query.allergy ?? null,
            Severity              : request.query.severity ?? null,
            Reaction              : request.query.reaction ?? null,
        };

        return this.updateBaseSearchFilters(request, filters);
    }

    update = async (request: express.Request): Promise<AssessmentDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');

        return domainModel;
    };

    private async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Query, true, false);
        await this.validateString(request, 'Assessment', Where.Query, true, false);
        await this.validateString(request, 'AllergenCategory', Where.Query, false, false);
        await this.validateString(request, 'AllergenExposureRoute', Where.Query, false, false);
        await this.validateString(request, 'Severity', Where.Query, true, false);
        await this.validateString(request, 'Reaction', Where.Query, false, false);

        this.validateRequest(request);

    }

    private async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Query, false, false);
        await this.validateString(request, 'Assessment', Where.Query, false, false);
        await this.validateString(request, 'AllergenCategory', Where.Query, false, false);
        await this.validateString(request, 'AllergenExposureRoute', Where.Query, false, false);
        await this.validateString(request, 'Severity', Where.Query, false, false);
        await this.validateString(request, 'Reaction', Where.Query, false, false);

        this.validateRequest(request);
        
    }

}
