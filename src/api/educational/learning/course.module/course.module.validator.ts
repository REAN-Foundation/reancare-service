import express from 'express';
import { CourseModuleDomainModel } from '../../../../domain.types/educational/learning/course.module/course.module.domain.model';
import { CourseModuleSearchFilters } from '../../../../domain.types/educational/learning/course.module/course.module.search.types';
import { BaseValidator, Where } from '../../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class CourseModuleValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): CourseModuleDomainModel => {

        const CourseModuleModel: CourseModuleDomainModel = {
            CourseId       : request.body.CourseId,
            LearningPathId : request.body.LearningPathId,
            Name           : request.body.Name,
            Description    : request.body.Description,
            ImageUrl       : request.body.ImageUrl,
            DurationInMins : request.body.DurationInMins,
            Sequence       : request.body.Sequence,
        };

        return CourseModuleModel;
    };

    create = async (request: express.Request): Promise<CourseModuleDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<CourseModuleSearchFilters> => {

        await this.validateString(request, 'name', Where.Query, false, false);
        await this.validateUuid(request, 'courseId', Where.Query, false, false);
        await this.validateDecimal(request, 'durationInMins', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<CourseModuleDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private  async validateCreateBody(request) {
        await this.validateUuid(request, 'CourseId', Where.Body, false, true);
        await this.validateUuid(request, 'LearningPathId', Where.Body, false, true);
        await this.validateString(request, 'Name', Where.Body, true, false);
        await this.validateString(request, 'Description', Where.Body, false, true);
        await this.validateString(request, 'ImageUrl', Where.Body, false, true);
        await this.validateDecimal(request, 'DurationInMins', Where.Body, false, true);
        await this.validateInt(request, 'Sequence', Where.Body, false, true);

        this.validateRequest(request);
    }

    private  async validateUpdateBody(request) {

        await this.validateUuid(request, 'CourseId', Where.Body, false, false);
        await this.validateString(request, 'Name', Where.Body, false, false);
        await this.validateString(request, 'Description', Where.Body, false, false);
        await this.validateString(request, 'ImageUrl', Where.Body, false, false);
        await this.validateDecimal(request, 'DurationInMins', Where.Body, false, false);
        await this.validateInt(request, 'Sequence', Where.Body, false, false);

        this.validateRequest(request);
    }

    private getFilter(request): CourseModuleSearchFilters {

        var filters: CourseModuleSearchFilters = {
            Name           : request.query.name ?? null,
            CourseId       : request.query.courseId ?? null,
            DurationInMins : request.query.durationInMins ?? null,
        };

        return this.updateBaseSearchFilters(request, filters);
    }

}
