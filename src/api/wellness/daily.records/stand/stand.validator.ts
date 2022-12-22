import express from 'express';
import { StandDomainModel } from '../../../../domain.types/wellness/daily.records/stand/stand.domain.model';
import { StandSearchFilters } from '../../../../domain.types/wellness/daily.records/stand/stand.search.types';
import { BaseValidator, Where } from '../../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class StandValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): StandDomainModel => {

        const standModel: StandDomainModel = {
            PatientUserId : request.body.PatientUserId,
            Stand         : request.body.Stand,
            Unit          : request.body.Unit,
            RecordDate    : request.body.RecordDate ?? new Date(),
        };

        return standModel;
    };

    create = async (request: express.Request): Promise<StandDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<StandSearchFilters> => {

        await this.validateUuid(request, 'patientUserId', Where.Query, false, false);
        await this.validateInt(request, 'minValue', Where.Query, false, false);
        await this.validateInt(request, 'maxValue', Where.Query, false, false);
        await this.validateDate(request, 'createdDateFrom', Where.Query, false, false);
        await this.validateDate(request, 'createdDateTo', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<StandDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');

        return domainModel;
    };

    private async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateInt(request, 'Stand', Where.Body, true, false);
        await this.validateString(request, 'Unit', Where.Body, true, false);
        await this.validateDate(request, 'RecordDate', Where.Body, false, true);

        this.validateRequest(request);
    }

    private  async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateInt(request, 'Stand', Where.Body, false, false);
        await this.validateString(request, 'Unit', Where.Body, false, false);
        await this.validateDate(request, 'RecordDate', Where.Body, false, false);

        this.validateRequest(request);
    }

    private getFilter(request): StandSearchFilters {

        const filters: StandSearchFilters = {
            PatientUserId   : request.query.patientUserId ?? null,
            MinValue        : request.query.minValue ?? null,
            MaxValue        : request.query.maxValue ?? null,
            CreatedDateFrom : request.query.createdDateFrom ?? null,
            CreatedDateTo   : request.query.createdDateTo ?? null
        };
        return this.updateBaseSearchFilters(request, filters);
    }

}
