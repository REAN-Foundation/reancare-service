import express from 'express';
import { SleepDomainModel } from '../../../../domain.types/wellness/daily.records/sleep/sleep.domain.model';
import { SleepSearchFilters } from '../../../../domain.types/wellness/daily.records/sleep/sleep.search.types';
import { BaseValidator, Where } from '../../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class SleepValidator extends BaseValidator{

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): SleepDomainModel => {

        const sleepModel: SleepDomainModel = {
            PatientUserId : request.body.PatientUserId ?? null,
            SleepDuration : request.body.SleepDuration ?? null,
            RecordDate    : request.body.RecordDate ?? new Date(),
            Unit          : request.body.Unit
        };

        return sleepModel;
    };

    create = async (request: express.Request): Promise<SleepDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<SleepSearchFilters> => {

        await this.validateUuid(request, 'patientUserId', Where.Query, false, false);
        await this.validateInt(request, 'minValue', Where.Query, false, false);
        await this.validateInt(request, 'maxValue', Where.Query, false, false);
        await this.validateDate(request, 'createdDateFrom', Where.Query, false, false);
        await this.validateDate(request, 'createdDateTo', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<SleepDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private  async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateInt(request, 'SleepDuration', Where.Body, true, false);
        await this.validateString(request, 'Unit', Where.Body, false, true);
        await this.validateDate(request, 'RecordDate', Where.Body, false, true);

        this.validateRequest(request);
    }

    private  async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateInt(request, 'SleepDuration', Where.Body, false, false);
        await this.validateString(request, 'Unit', Where.Body, false, false);
        await this.validateDate(request, 'RecordDate', Where.Body, false, false);

        this.validateRequest(request);
    }

    private getFilter(request): SleepSearchFilters {

        var filters: SleepSearchFilters = {
            PatientUserId   : request.query.patientUserId ?? null,
            MinValue        : request.query.minValue ?? null,
            MaxValue        : request.query.maxValue ?? null,
            CreatedDateFrom : request.query.createdDateFrom ?? null,
            CreatedDateTo   : request.query.createdDateTo ?? null,
        };

        return this.updateBaseSearchFilters(request, filters);
    }

}
