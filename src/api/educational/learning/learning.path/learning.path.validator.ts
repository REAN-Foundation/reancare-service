import express from 'express';
import { LearningPathDomainModel } from '../../../../domain.types/educational/learning/learning.path/learning.path.domain.model';
import { LearningPathSearchFilters } from '../../../../domain.types/educational/learning/learning.path/learning.path.search.types';
import { BaseValidator, Where } from '../../../base.validator';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';

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
            DurationInDays   : request.body.DurationInDays ?? null,
            PreferenceWeight : request.body.PreferenceWeight ?? null,
            Enabled          : request.body.Enabled,
            CourseIds        : [],
        };

        if (request.body.CourseIds && request.body.CourseIds.length > 0) {
            var courseIds: uuid[] = [];
            for (var c of request.body.CourseIds ) {
                var courseId: uuid = c;
                courseIds.push(courseId);
            }
            model.CourseIds = courseIds;
        }
        return model;
    };

    create = async (request: express.Request): Promise<LearningPathDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<LearningPathSearchFilters> => {
        await this.validateString(request, 'name', Where.Query, false, false);
        await this.validateDecimal(request, 'PreferenceWeight', Where.Body, false, false);
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
        await this.validateArray(request, 'CourseIds', Where.Body, false, true);
        this.validateRequest(request);
    }

    private async validateUpdateBody(request) {
        await this.validateString(request, 'Name', Where.Body, false, false);
        await this.validateString(request, 'Description', Where.Body, false, true);
        await this.validateString(request, 'ImageUrl', Where.Body, false, false);
        await this.validateDecimal(request, 'DurationInDays', Where.Body, false, true);
        await this.validateDecimal(request, 'PreferenceWeight', Where.Body, false, false);
        await this.validateBoolean(request, 'Enabled', Where.Body, false, false);
        await this.validateArray(request, 'CourseIds', Where.Body, false, false);
        this.validateRequest(request);
    }

    private getFilter(request): LearningPathSearchFilters {
        var filters: LearningPathSearchFilters = {
            Name             : request.query.name ?? null,
            PreferenceWeight : request.query.preferenceWeight ?? null,
        };
        return this.updateBaseSearchFilters(request, filters);
    }

}
