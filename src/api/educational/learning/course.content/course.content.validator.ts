import express from 'express';
import { CourseContentType } from '../../../../domain.types/educational/learning/course.content/course.content.type';
import { CourseContentDomainModel } from '../../../../domain.types/educational/learning/course.content/course.content.domain.model';
import { CourseContentSearchFilters } from '../../../../domain.types/educational/learning/course.content/course.content.search.types';
import { BaseValidator, Where } from '../../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class CourseContentValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): CourseContentDomainModel => {
        const courseContentModel: CourseContentDomainModel = {
            ModuleId         : request.body.ModuleId,
            CourseId         : request.body.CourseId,
            LearningPathId   : request.body.LearningPathId,
            Title            : request.body.Title,
            Description      : request.body.Description,
            ImageUrl         : request.body.ImageUrl,
            DurationInMins   : request.body.DurationInMins,
            ContentType      : request.body.ContentType as CourseContentType,
            ResourceLink     : request.body.ResourceLink,
            ActionTemplateId : request.body.ActionTemplateId,
            Sequence         : request.body.Sequence,
        };
        return courseContentModel;
    };

    create = async (request: express.Request): Promise<CourseContentDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<CourseContentSearchFilters> => {
        await this.validateString(request, 'title ', Where.Query, false, false);
        await this.validateUuid(request, 'moduleId ', Where.Query, false, false);
        await this.validateDecimal(request, 'durationForm', Where.Query, false, false);
        await this.validateDecimal(request, 'durationTo', Where.Query, false, false);
        await this.validateUuid(request, 'courseId', Where.Query, false, false);
        await this.validateUuid(request, 'moduleId', Where.Query, false, false);
        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<CourseContentDomainModel> => {
        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private async validateCreateBody(request) {
        await this.validateUuid(request, 'ModuleId', Where.Body, false, true);
        await this.validateUuid(request, 'CourseId', Where.Body, false, true);
        await this.validateUuid(request, 'LearningPathId', Where.Body, false, true);
        await this.validateString(request, 'Title', Where.Body, true, false);
        await this.validateString(request, 'Description', Where.Body, false, true);
        await this.validateString(request, 'ImageUrl', Where.Body, false, true);
        await this.validateDecimal(request, 'DurationInMins', Where.Body, false, true);
        await this.validateString(request, 'ContentType', Where.Body, false, true);
        await this.validateString(request, 'ResourceLink ', Where.Body, false, true);
        await this.validateUuid(request, 'ActionTemplateId ', Where.Body, false, false);
        await this.validateString(request, 'Sequence', Where.Body, false, true);

        this.validateRequest(request);
    }

    private async validateUpdateBody(request) {
        await this.validateUuid(request, 'ModuleId', Where.Body, false, false);
        await this.validateString(request, 'Title', Where.Body, false, false);
        await this.validateString(request, 'Description', Where.Body, false, true);
        await this.validateString(request, 'ImageUrl', Where.Body, false, true);
        await this.validateDecimal(request, 'DurationInMins', Where.Body, false, true);
        await this.validateString(request, 'ContentType', Where.Body, false, true);
        await this.validateString(request, 'ResourceLink ', Where.Body, false, true);
        await this.validateUuid(request, 'ActionTemplateId ', Where.Body, false, false);
        await this.validateString(request, 'Sequence ', Where.Body, false, true);

        this.validateRequest(request);
    }

    private getFilter(request): CourseContentSearchFilters {
        var filters: CourseContentSearchFilters = {
            Title        : request.query.title ?? null,
            ModuleId     : request.query.moduleId ?? null,
            DurationFrom : request.query.DurationFrom ?? null,
            DurationTo   : request.query.DurationTo ?? null,
            CourseId     : request.query.courseId ?? null,
        };

        return this.updateBaseSearchFilters(request, filters);
    }

}
