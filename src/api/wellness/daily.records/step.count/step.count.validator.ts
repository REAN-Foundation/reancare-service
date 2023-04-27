import express from 'express';
import { StepCountDomainModel } from '../../../../domain.types/wellness/daily.records/step.count/step.count.domain.model';
import { StepCountSearchFilters } from '../../../../domain.types/wellness/daily.records/step.count/step.count.search.types';
import { BaseValidator, Where } from '../../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class StepCountValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): StepCountDomainModel => {

        const stepCountModel: StepCountDomainModel = {
            PatientUserId  : request.body.PatientUserId,
            StepCount      : request.body.StepCount,
            Unit           : request.body.Unit ?? 'steps',
            RecordDate     : request.body.RecordDate ?? null,
            Provider       : request.body.Provider ?? null,
            TerraSummaryId : request.body.TerraSummaryId ?? null,
        };

        return stepCountModel;
    };

    create = async (request: express.Request): Promise<StepCountDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<StepCountSearchFilters> => {

        await this.validateUuid(request, 'patientUserId', Where.Query, false, false);
        await this.validateInt(request, 'minValue', Where.Query, false, false);
        await this.validateInt(request, 'maxValue', Where.Query, false, false);
        await this.validateDate(request, 'createdDateFrom', Where.Query, false, false);
        await this.validateDate(request, 'createdDateTo', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<StepCountDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');

        return domainModel;
    };

    private async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateInt(request, 'StepCount', Where.Body, true, false);
        await this.validateString(request, 'Unit', Where.Body, true, true);
        await this.validateDate(request, 'RecordDate', Where.Body, false, false);

        this.validateRequest(request);
    }

    private  async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateInt(request, 'StepCount', Where.Body, false, false);
        await this.validateString(request, 'Unit', Where.Body, false, false);
        await this.validateDate(request, 'RecordDate', Where.Body, false, false);

        this.validateRequest(request);
    }

    private getFilter(request): StepCountSearchFilters {

        const filters: StepCountSearchFilters = {
            PatientUserId   : request.query.patientUserId ?? null,
            MinValue        : request.query.minValue ?? null,
            MaxValue        : request.query.maxValue ?? null,
            CreatedDateFrom : request.query.createdDateFrom ?? null,
            CreatedDateTo   : request.query.createdDateTo ?? null
        };
        return this.updateBaseSearchFilters(request, filters);
    }

}
