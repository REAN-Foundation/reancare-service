import express from 'express';
import { SymptomAssessmentDomainModel } from '../../../../domain.types/clinical/symptom/symptom.assessment/symptom.assessment.domain.model';
import { SymptomAssessmentSearchFilters } from '../../../../domain.types/clinical/symptom/symptom.assessment/symptom.assessment.search.types';
import { BaseValidator, Where } from '../../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class SymptomAssessmentValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): SymptomAssessmentDomainModel => {

        const model: SymptomAssessmentDomainModel = {
            id                   : request.body.id ?? null,
            PatientUserId        : request.body.PatientUserId ?? null,
            Title                : request.body.Title,
            AssessmentTemplateId : request.body.AssessmentTemplateId ?? null,
            OverallStatus        : request.body.OverallStatus ?? null,
            AssessmentDate       : request.body.AssessmentDate ?? null,
        };

        return model;
    };

    create = async (request: express.Request): Promise<SymptomAssessmentDomainModel> => {

        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<SymptomAssessmentSearchFilters> => {

        await this.validateUuid(request, 'patientUserId', Where.Query, false, false);
        await this.validateUuid(request, 'assessmentTemplateId', Where.Query, false, false);
        await this.validateString(request, 'title', Where.Query, false, false, true);
        await this.validateDate(request, 'dateFrom', Where.Query, false, false);
        await this.validateDate(request, 'dateTo', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);

    };

    update = async (request: express.Request): Promise<SymptomAssessmentDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private  async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateUuid(request, 'AssessmentTemplateId', Where.Body, false, false);
        await this.validateString(request, 'Title', Where.Body, true, false);
        await this.validateString(request, 'OverallStatus', Where.Body, true, false);
        await this.validateDate(request, 'AssessmentDate', Where.Body, true, false);

        this.validateRequest(request);
    }

    private  async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateUuid(request, 'AssessmentTemplateId', Where.Body, false, false);
        await this.validateString(request, 'Title', Where.Body, false, false);
        await this.validateString(request, 'OverallStatus', Where.Body, false, false);
        await this.validateDate(request, 'AssessmentDate', Where.Body, false, false);

        this.validateRequest(request);
    }

    private getFilter(request): SymptomAssessmentSearchFilters {

        var filters: SymptomAssessmentSearchFilters = {
            Title                : request.query.title ?? null,
            PatientUserId        : request.query.patientUserId ?? null,
            AssessmentTemplateId : request.query.assessmentTemplateId ?? null,
            DateFrom             : request.query.dateFrom ?? null,
            DateTo               : request.query.dateTo ?? null,
        };
        return this.updateBaseSearchFilters(request, filters);
    }

}
