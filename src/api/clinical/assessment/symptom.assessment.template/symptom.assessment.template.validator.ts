import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { Helper } from '../../../../common/helper';
import { SymptomAssessmentTemplateDomainModel } from '../../../../domain.types/clinical/symptom/symptom.assessment.template/symptom.assessment.template.domain.model';
import { SymptomAssessmentTemplateSearchFilters } from '../../../../domain.types/clinical/symptom/symptom.assessment.template/symptom.assessment.template.search.types';
import { BaseValidator, Where } from '../../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class SymptomAssessmentTemplateValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): SymptomAssessmentTemplateDomainModel => {

        const model: SymptomAssessmentTemplateDomainModel = {
            id          : request.params.id ?? null,
            Title       : request.body.Title ?? null,
            Description : request.body.Description ?? null,
            Tags        : request.body.Tags ?? null
        };

        return model;
    };

    create = async (request: express.Request): Promise<SymptomAssessmentTemplateDomainModel> => {

        await this.validateCreateBody(request);
        return this.getDomainModel(request);

    };

    search = async (request: express.Request): Promise<SymptomAssessmentTemplateSearchFilters> => {

        await this.validateUuid(request, 'symptomTypeId', Where.Query, false, false);
        await this.validateString(request, 'title', Where.Query, false, false, true);
        await this.validateString(request, 'tag', Where.Query, false, false, true);
        await this.validateString(request, 'symptomName', Where.Query, false, false, true);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);

    };

    update = async (request: express.Request): Promise<SymptomAssessmentTemplateDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    addRemoveSymptomTypes = async (request: express.Request): Promise<any> => {

        await param('id').exists()
            .isUUID()
            .run(request);

        await body('SymptomTypeIds').exists()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        var model = {
            id             : request.params.id,
            SymptomTypeIds : request.body.SymptomTypeIds
        };

        return model;
    };

    private async validateCreateBody(request) {

        await this.validateString(request, 'Tags', Where.Body, true, false);
        await this.validateString(request, 'Description', Where.Body, true, false);
        await this.validateString(request, 'Title', Where.Body, true, false);

        this.validateRequest(request);

    }

    private async validateUpdateBody(request) {

        await this.validateString(request, 'Tags', Where.Body, false, false);
        await this.validateString(request, 'Description', Where.Body, false, false);
        await this.validateString(request, 'Title', Where.Body, false, false);

        this.validateRequest(request);

    }

    private getFilter(request): SymptomAssessmentTemplateSearchFilters {

        const filters: SymptomAssessmentTemplateSearchFilters = {
            Title         : request.query.title ?? null,
            Tag           : request.query.tag ?? null,
            SymptomName   : request.query.symptomName ?? null,
            SymptomTypeId : request.query.symptomTypeId ?? null,
        };

        return this.updateBaseSearchFilters(request, filters);

    }

}
