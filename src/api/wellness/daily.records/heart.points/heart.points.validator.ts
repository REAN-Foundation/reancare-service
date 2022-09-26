import express from 'express';
import { HeartPointsDomainModel } from '../../../../domain.types/wellness/daily.records/heart.points/heart.points.domain.model';
import { HeartPointsSearchFilters } from '../../../../domain.types/wellness/daily.records/heart.points/heart.points.search.types';
import { BaseValidator, Where } from '../../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class HeartPointValidator extends BaseValidator{

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): HeartPointsDomainModel => {

        const heartPointsModel: HeartPointsDomainModel = {
            PatientUserId : request.body.PatientUserId ?? null,
            HeartPoints   : request.body.HeartPoints ?? null,
            Unit          : request.body.Unit,
            RecordDate    : request.body.RecordDate ?? new Date(),
        };

        return heartPointsModel;
    };

    create = async (request: express.Request): Promise<HeartPointsDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<HeartPointsSearchFilters> => {

        await this.validateUuid(request, 'patientUserId', Where.Query, false, false);
        await this.validateInt(request, 'minValue', Where.Query, false, false );
        await this.validateInt(request, 'maxValue', Where.Query, false, false);
        await this.validateDate(request, 'createdDateFrom', Where.Query, false, false);
        await this.validateDate(request, 'createdDateTo', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<HeartPointsDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private  async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateInt(request, 'HeartPoints', Where.Body, true, false);
        await this.validateString(request, 'Unit', Where.Body, false, true);
        await this.validateDate(request, 'RecordDate', Where.Body, false, false);

        this.validateRequest(request);
    }

    private  async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateInt(request, 'HeartPoints', Where.Body, false, false);
        await this.validateString(request, 'Unit', Where.Body, false, false);
        await this.validateDate(request, 'RecordDate', Where.Body, false, false);

        this.validateRequest(request);
    }

    private getFilter(request): HeartPointsSearchFilters {

        var filters: HeartPointsSearchFilters = {
            PatientUserId   : request.query.patientUserId ?? null,
            MinValue        : request.query.minValue ?? null,
            MaxValue        : request.query.maxValue ?? null,
            CreatedDateFrom : request.query.createdDateFrom ?? null,
            CreatedDateTo   : request.query.createdDateTo ?? null,
        };

        return this.updateBaseSearchFilters(request, filters);
    }

}
