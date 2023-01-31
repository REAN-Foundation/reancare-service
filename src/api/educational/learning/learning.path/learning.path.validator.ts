import express from 'express';
import { LearningPathDomainModel } from '../../../../domain.types/educational/learning/learning.path/learning.path.domain.model';
import { LearningPathSearchFilters } from '../../../../domain.types/educational/learning/learning.path/learning.path.search.types';
import { BaseValidator, Where } from '../../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class LearningPathValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): LearningPathDomainModel => {
        const model: LearningPathDomainModel = {
            Name             : request.body.Name,
            Description      : request.body.Description,
            ImageUrl         : request.body.ImageUrl,
            DurationInDays   : request.body.DurationInDays,
            PreferenceWeight : request.body.PreferenceWeight,
            Enabled          : request.body.Enabled,
        };
        return model;
    };

    create = async (request: express.Request): Promise<LearningPathDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<LearningPathSearchFilters> => {
        await this.validateString(request, 'name', Where.Query, false, false);
        await this.validateBaseSearchFilters(request);
        this.validateRequest(request);
        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<LearningPathDomainModel> => {
        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private async validateCreateBody(request) {
        await this.validateString(request, 'Name', Where.Body, true, false);
        await this.validateString(request, 'Description', Where.Body, false, true);
        await this.validateString(request, 'ImageUrl', Where.Body, false, true);
        await this.validateDecimal(request, 'DurationInDays', Where.Body, false, true);
        await this.validateDecimal(request, 'PreferenceWeight', Where.Body, false, true);
        await this.validateBoolean(request, 'Enabled', Where.Body, false, true);
        this.validateRequest(request);
    }

    private async validateUpdateBody(request) {
        await this.validateString(request, 'Name', Where.Body, false, false);
        await this.validateString(request, 'Description', Where.Body, false, false);
        await this.validateString(request, 'ImageUrl', Where.Body, false, false);
        await this.validateDecimal(request, 'DurationInDays', Where.Body, false, false);
        await this.validateDecimal(request, 'PreferenceWeight', Where.Body, false, false);
        await this.validateBoolean(request, 'Enabled', Where.Body, false, false);
        this.validateRequest(request);
    }

    private getFilter(request): LearningPathSearchFilters {
        var filters: LearningPathSearchFilters = {
            Name : request.query.name ?? null,
        };
        return this.updateBaseSearchFilters(request, filters);
    }

}
