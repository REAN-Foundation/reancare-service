import express from 'express';
import { PhysicalActivityDomainModel } from '../../../../domain.types/wellness/exercise/physical.activity/physical.activity.domain.model';
import { PhysicalActivitySearchFilters } from '../../../../domain.types/wellness/exercise/physical.activity/physical.activity.search.types';
import { BaseValidator, Where } from '../../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class PhysicalActivityValidator extends BaseValidator {

    getDomainModel = (request: express.Request): PhysicalActivityDomainModel => {

        const physicalActivityModel: PhysicalActivityDomainModel = {
            PatientUserId               : request.body.PatientUserId ?? null,
            Exercise                    : request.body.Exercise ?? null,
            Description                 : request.body.Description ?? null,
            Category                    : request.body.Category,
            Intensity                   : request.body.Intensity,
            CaloriesBurned              : request.body.CaloriesBurned ?? null,
            StartTime                   : request.body.StartTime ?? null,
            EndTime                     : request.body.EndTime ?? null,
            DurationInMin               : request.body.DurationInMin ?? null,
            PhysicalActivityQuestionAns : request.body.PhysicalActivityQuestionAns ?? null,
        };

        return physicalActivityModel;
    };

    create = async (request: express.Request): Promise<PhysicalActivityDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<PhysicalActivitySearchFilters> => {

        await this.validateUuid(request, 'patientUserId', Where.Query, false, false);
        await this.validateString(request, 'exercise', Where.Query, false, false, true);
        await this.validateString(request, 'category', Where.Query, false, false, true);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<PhysicalActivityDomainModel> => {

        await this.validateUpdateBody(request);

        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');

        return domainModel;
    };

    private async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateString(request, 'Exercise', Where.Body, false, true);
        await this.validateString(request, 'Description', Where.Body, false, true);
        await this.validateString(request, 'Category', Where.Body, false, true);
        await this.validateString(request, 'Intensity', Where.Body, false, true);
        await this.validateDecimal(request, 'CaloriesBurned', Where.Body, false, true);
        await this.validateDate(request, 'StartTime', Where.Body, false, true);
        await this.validateDate(request, 'EndTime', Where.Body, false, true);
        await this.validateDecimal(request, 'DurationInMin', Where.Body, false, true);
        await this.validateBoolean(request, 'PhysicalActivityQuestionAns', Where.Body, false, true);

        this.validateRequest(request);

    }

    private  async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateString(request, 'Exercise', Where.Body, false, false);
        await this.validateString(request, 'Description', Where.Body, false, false);
        await this.validateString(request, 'Category', Where.Body, false, false);
        await this.validateString(request, 'Intensity', Where.Body, false, false);
        await this.validateDecimal(request, 'CaloriesBurned', Where.Body, false, false);
        await this.validateDate(request, 'StartTime', Where.Body, false, false);
        await this.validateDate(request, 'EndTime', Where.Body, false, false);
        await this.validateDecimal(request, 'DurationInMin', Where.Body, false, false);

        this.validateRequest(request);
    }

    private getFilter(request): PhysicalActivitySearchFilters {

        var filters: PhysicalActivitySearchFilters = {
            PatientUserId : request.query.patientUserId ?? null,
            Exercise      : request.query.exercise ?? null,
            Category      : request.query.category ?? null,

        };
        return this.updateBaseSearchFilters(request, filters);
    }

}
