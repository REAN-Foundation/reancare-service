import express from 'express';
import { MedicalConditionDomainModel } from '../../../domain.types/clinical/medical.condition/medical.condition.domain.model';
import { MedicalConditionSearchFilters } from '../../../domain.types/clinical/medical.condition/medical.condition.search.types';
import { BaseValidator, Where } from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class MedicalConditionValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): MedicalConditionDomainModel => {

        const MedicalConditionModel: MedicalConditionDomainModel = {
            Condition   : request.body.Condition,
            Description : request.body.Description,
            Language    : request.body.Language,
        };

        return MedicalConditionModel;
    };

    create = async (request: express.Request): Promise<MedicalConditionDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<MedicalConditionSearchFilters> => {

        await this.validateUuid(request, 'condition', Where.Query, false, false);
        await this.validateBaseSearchFilters(request);
        this.validateRequest(request);

        return this.getFilter(request);

    };

    update = async (request: express.Request): Promise<MedicalConditionDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');

        return domainModel;
    };

    private async validateCreateBody(request) {

        await this.validateString(request, 'Condition', Where.Body, true, false);
        await this.validateString(request, 'Description', Where.Body, true, false);
        await this.validateString(request, 'Language', Where.Body, true, true);

        this.validateRequest(request);
    }

    private async validateUpdateBody(request) {

        await this.validateString(request, 'Condition', Where.Body, false, false);
        await this.validateString(request, 'Description', Where.Body, false, false);
        await this.validateString(request, 'Language', Where.Body, false, false);

        this.validateRequest(request);
    }

    private getFilter(request): MedicalConditionSearchFilters {

        var filters: MedicalConditionSearchFilters = {
            Condition : request.query.condition ?? null,

        };
        return this.updateBaseSearchFilters(request, filters);
    }

}
