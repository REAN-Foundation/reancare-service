import express from 'express';
import { BodyTemperatureDomainModel } from '../../../../domain.types/clinical/biometrics/body.temperature/body.temperature.domain.model';
import { BodyTemperatureSearchFilters } from '../../../../domain.types/clinical/biometrics/body.temperature/body.temperature.search.types';
import { BaseValidator, Where } from '../../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class BodyTemperatureValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): BodyTemperatureDomainModel => {

        const BodyTemperatureModel: BodyTemperatureDomainModel = {
            PatientUserId    : request.body.PatientUserId,
            BodyTemperature  : request.body.BodyTemperature,
            Unit             : request.body.Unit,
            RecordDate       : request.body.RecordDate ?? new Date(),
            RecordedByUserId : request.body.RecordedByUserId ?? request.currentUser.UserId,
        };

        return BodyTemperatureModel;
    };

    create = async (request: express.Request): Promise<BodyTemperatureDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<BodyTemperatureSearchFilters> => {

        await this.validateUuid(request, 'patientUserId', Where.Query, false, false);
        await this.validateDecimal(request, 'minValue', Where.Query, false, false);
        await this.validateDecimal(request, 'maxValue', Where.Query, false, false);
        await this.validateDate(request, 'createdDateFrom', Where.Query, false, false);
        await this.validateDate(request, 'createdDateTo', Where.Query, false, false);
        await this.validateUuid(request, 'recordedByUserId', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<BodyTemperatureDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private  async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateDecimal(request, 'BodyTemperature', Where.Body, true, false);
        await this.validateString(request, 'Unit', Where.Body, false, true);
        await this.validateDate(request, 'RecordDate', Where.Body, false, false);
        await this.validateUuid(request, 'RecordedByUserId', Where.Body, false, true);

        this.validateRequest(request);
    }

    private  async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateDecimal(request, 'BodyTemperature', Where.Body, false, false);
        await this.validateString(request, 'Unit', Where.Body, false, false);
        await this.validateDate(request, 'RecordDate', Where.Body, false, false);
        await this.validateUuid(request, 'RecordedByUserId', Where.Body, false, true);

        this.validateRequest(request);
    }

    private getFilter(request): BodyTemperatureSearchFilters {

        var filters: BodyTemperatureSearchFilters = {
            PatientUserId    : request.query.patientUserId ?? null,
            MinValue         : request.query.minValue ?? null,
            MaxValue         : request.query.maxValue ?? null,
            CreatedDateFrom  : request.query.createdDateFrom ?? null,
            CreatedDateTo    : request.query.createdDateTo ?? null,
            RecordedByUserId : request.query.recordedByUserId ?? null,

        };

        return this.updateBaseSearchFilters(request, filters);
    }

}
