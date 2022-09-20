import express from 'express';
import { CourseDomainModel } from '../../../../domain.types/educational/course/course/course.domain.model';
import { CourseSearchFilters } from '../../../../domain.types/educational/course/course/course.search.types';
import { BaseValidator, Where } from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class CourseValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): CourseDomainModel => {
        const model: CourseDomainModel = {
            Name           : request.body.Name,
            Description    : request.body.Description,
            ImageUrl       : request.body.ImageUrl,
            DurationInDays : request.body.DurationInDays,
            StartDate      : request.body.StartDate,
            EndDate        : request.body.EndDate,
        };
        return model;
    };

    create = async (request: express.Request): Promise<CourseDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<CourseSearchFilters> => {
        await this.validateString(request, 'name', Where.Query, false, false);
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
        await this.validateString(request, 'Name', Where.Body, true, false);
        await this.validateString(request, 'Description', Where.Body, false, true);
        await this.validateString(request, 'ImageUrl', Where.Body, false, true);
        await this.validateDecimal(request, 'DurationInDays', Where.Body, false, true);
        await this.validateDate(request, 'StartDate', Where.Body, false, true);
        await this.validateDate(request, 'EndDate', Where.Body, false, true);
        this.validateRequest(request);
    }

    private  async validateUpdateBody(request) {
        await this.validateString(request, 'Name', Where.Body, false, false);
        await this.validateString(request, 'Description', Where.Body, false, false);
        await this.validateString(request, 'ImageUrl', Where.Body, false, false);
        await this.validateDecimal(request, 'DurationInDays', Where.Body, false, false);
        await this.validateDate(request, 'StartDate', Where.Body, false, false);
        await this.validateDate(request, 'EndDate', Where.Body, false, false);
        this.validateRequest(request);
    }

    private getFilter(request): CourseSearchFilters {
        var filters: CourseSearchFilters = {
            Name : request.query.name ?? null,
        };
        return this.updateBaseSearchFilters(request, filters);
    }

}
