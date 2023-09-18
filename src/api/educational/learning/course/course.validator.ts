import express from 'express';
import { CourseDomainModel } from '../../../../domain.types/educational/learning/course/course.domain.model';
import { CourseSearchFilters } from '../../../../domain.types/educational/learning/course/course.search.types';
import { BaseValidator, Where } from '../../../base.validator';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////////////////////

export class CourseValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): CourseDomainModel => {
        const model: CourseDomainModel = {
            LearningPathIds : request.body.LearningPathIds ?? [],
            Name            : request.body.Name,
            Description     : request.body.Description ?? null,
            ImageUrl        : request.body.ImageUrl ?? null,
            DurationInDays  : request.body.DurationInDays ?? null,
        };
        if (request.body.LearningPathIds && request.body.LearningPathIds.length > 0) {
            var learningPathIds: uuid[] = [];
            for (var l of request.body.LearningPathIds ) {
                var learningPathId: uuid = l;
                learningPathIds.push(learningPathId);
            }
            model.LearningPathIds = learningPathIds;
        }

        return model;
    };

    create = async (request: express.Request): Promise<CourseDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<CourseSearchFilters> => {
        await this.validateString(request, 'name', Where.Query, false, false);
        await this.validateInt(request, 'DurationInDays', Where.Body, false, false);
        await this.validateBaseSearchFilters(request);
        this.validateRequest(request);
        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<CourseDomainModel> => {
        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private  async validateCreateBody(request) {
        await this.validateArray(request, 'LearningPathIds', Where.Body, false, false);
        await this.validateString(request, 'Name', Where.Body, true, false);
        await this.validateString(request, 'Description', Where.Body, false, true);
        await this.validateString(request, 'ImageUrl', Where.Body, false, true);
        await this.validateDecimal(request, 'DurationInDays', Where.Body, false, true);
        this.validateRequest(request);
    }

    private  async validateUpdateBody(request) {
        await this.validateUuid(request, 'LearningPathId', Where.Body, false, false);
        await this.validateString(request, 'Name', Where.Body, false, false);
        await this.validateString(request, 'Description', Where.Body, false, true);
        await this.validateString(request, 'ImageUrl', Where.Body, false, true);
        await this.validateDecimal(request, 'DurationInDays', Where.Body, false, true);
        this.validateRequest(request);
    }

    private getFilter(request): CourseSearchFilters {
        var filters: CourseSearchFilters = {
            Name           : request.query.name ?? null,
            DurationInDays : request.query.durationInDays ?? null,
            LearningPathId : request.query.learningPathId ?? null,
        };
        return this.updateBaseSearchFilters(request, filters);
    }

}
