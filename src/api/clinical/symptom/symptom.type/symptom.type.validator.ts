import express from 'express';
import { SymptomTypeDomainModel } from '../../../../domain.types/clinical/symptom/symptom.type/symptom.type.domain.model';
import { SymptomTypeSearchFilters } from '../../../../domain.types/clinical/symptom/symptom.type/symptom.type.search.types';
import { BaseValidator, Where } from '../../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class SymptomTypeValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): SymptomTypeDomainModel => {

        const model: SymptomTypeDomainModel = {
            id              : request.body.id ?? null,
            Symptom         : request.body.Symptom ?? null,
            Description     : request.body.Description ?? null,
            Language        : request.body.Language,
            Tags            : request.body.Tags ?? [],
            ImageResourceId : request.body.ImageResourceId ?? null,
        };

        return model;
    };

    create = async (request: express.Request): Promise<SymptomTypeDomainModel> => {

        await this.validateCreateBody(request);
        return this.getDomainModel(request);

    };

    search = async (request: express.Request): Promise<SymptomTypeSearchFilters> => {

        await this.validateString(request, 'symptom', Where.Query, false, false, true);
        await this.validateString(request, 'tag', Where.Query, false, false, true);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);

    };

    update = async (request: express.Request): Promise<SymptomTypeDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;

    };

    private  async validateCreateBody(request) {

        await this.validateUuid(request, 'ImageResourceId', Where.Body, false, false);
        await this.validateString(request, 'Symptom', Where.Body, true, false);
        await this.validateString(request, 'Description', Where.Body, false, true);
        await this.validateArray(request, 'Tags', Where.Body, false, true);
        await this.validateString(request, 'Language', Where.Body, true, false);

        this.validateRequest(request);
    }

    private  async validateUpdateBody(request) {

        await this.validateUuid(request, 'ImageResourceId', Where.Body, false, true);
        await this.validateString(request, 'Symptom', Where.Body, false, false);
        await this.validateString(request, 'Description', Where.Body, false, true);
        await this.validateArray(request, 'Tags', Where.Body, false, true);
        await this.validateString(request, 'Language', Where.Body, false, false);

        this.validateRequest(request);
    }

    private getFilter(request): SymptomTypeSearchFilters {

        const filters: SymptomTypeSearchFilters = {
            Symptom : request.query.symptom ?? null,
            Tag     : request.query.tag ?? null,
        };
        return this.updateBaseSearchFilters(request, filters);
    }

}

