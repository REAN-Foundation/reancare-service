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
            Type                   : request.body.Type ?? null,
            Title                  : request.body.Title ?? null,
            Description            : request.body.Description,
            ProviderAssessmentCode : request.body.ProviderAssessmentCode ?? null,
            Provider               : request.body.Provider ?? null,
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

        await this.validateUuid(request, 'title', Where.Query, false, false);
        await this.validateString(request, 'type', Where.Query, false, false, true);

        await this.validateBaseSearchFilters(request);
        
        this.validateRequest(request);

        return this.getFilter(request);

    };

    private getFilter(request): AssessmentTemplateSearchFilters {

        var filters: AssessmentTemplateSearchFilters = {
            Title : request.query.title ?? null,
            Type  : request.query.type ?? null,
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

        await this.validateString(request, 'Type', Where.Body, true, false);
        await this.validateString(request, 'Title', Where.Body, true, false);
        await this.validateString(request, 'Description', Where.Body, false, false);
        await this.validateString(request, 'ProviderAssessmentCode', Where.Body, false, false);
        await this.validateString(request, 'ProviderAssessmentCode', Where.Body, false, false);

        this.validateRequest(request);

    }

    private async validateUpdateBody(request) {

        await this.validateString(request, 'Type', Where.Body, false, false);
        await this.validateString(request, 'Title', Where.Body, false, false);
        await this.validateString(request, 'Description', Where.Body, false, false);
        await this.validateString(request, 'ProviderAssessmentCode', Where.Body, false, false);
        await this.validateString(request, 'ProviderAssessmentCode', Where.Body, false, false);

        this.validateRequest(request);
        
    }

    importFromJson = async (request: express.Request): Promise<AssessmentTemplateDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

}
