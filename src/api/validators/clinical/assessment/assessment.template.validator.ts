import express from 'express';
import { AssessmentTemplateDomainModel } from '../../../../domain.types/clinical/assessment/assessment.template.domain.model';
import { AssessmentTemplateSearchFilters } from '../../../../domain.types/clinical/assessment/assessment.template.search.types';
import { BaseValidator, Where } from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class AssessmentTemplateValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): AssessmentTemplateDomainModel => {

        const patientAssessmentTemplateModel: AssessmentTemplateDomainModel = {
            PatientUserId         : request.body.PatientUserId ?? null,
            AssessmentTemplate    : request.body.AssessmentTemplate ?? null,
            AllergenCategory      : request.body.AllergenCategory ?? null,
            AllergenExposureRoute : request.body.AllergenExposureRoute,
            Severity              : request.body.Severity ?? null,
            Reaction              : request.body.Reaction ?? null,
            OtherInformation      : request.body.OtherInformation ?? null,
            LastOccurrence        : request.body.LastOccurrence ?? null,
        };

        return patientAssessmentTemplateModel;
    };

    create = async (request: express.Request): Promise<AssessmentTemplateDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (
        request: express.Request
    ): Promise<AssessmentTemplateSearchFilters> => {

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

    private getFilter(request): AssessmentTemplateSearchFilters {

        var filters: AssessmentTemplateSearchFilters = {
            PatientUserId         : request.query.patientUserId ?? null,
            AllergenCategory      : request.query.allergenCategory ?? null,
            AllergenExposureRoute : request.query.allergenExposureRoute ?? null,
            AssessmentTemplate    : request.query.allergy ?? null,
            Severity              : request.query.severity ?? null,
            Reaction              : request.query.reaction ?? null,
        };

        return this.updateBaseSearchFilters(request, filters);
    }

    update = async (request: express.Request): Promise<AssessmentTemplateDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');

        return domainModel;
    };

    private async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Query, true, false);
        await this.validateString(request, 'AssessmentTemplate', Where.Query, true, false);
        await this.validateString(request, 'AllergenCategory', Where.Query, false, false);
        await this.validateString(request, 'AllergenExposureRoute', Where.Query, false, false);
        await this.validateString(request, 'Severity', Where.Query, true, false);
        await this.validateString(request, 'Reaction', Where.Query, false, false);

        this.validateRequest(request);

    }

    private async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Query, false, false);
        await this.validateString(request, 'AssessmentTemplate', Where.Query, false, false);
        await this.validateString(request, 'AllergenCategory', Where.Query, false, false);
        await this.validateString(request, 'AllergenExposureRoute', Where.Query, false, false);
        await this.validateString(request, 'Severity', Where.Query, false, false);
        await this.validateString(request, 'Reaction', Where.Query, false, false);

        this.validateRequest(request);
        
    }

}
