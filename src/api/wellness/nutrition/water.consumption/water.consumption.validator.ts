import express from 'express';
import { WaterConsumptionDomainModel } from '../../../../domain.types/wellness/nutrition/water.consumption/water.consumption.domain.model';
import { WaterConsumptionSearchFilters } from '../../../../domain.types/wellness/nutrition/water.consumption/water.consumption.search.types';
import { BaseValidator, Where } from '../../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class WaterConsumptionValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): WaterConsumptionDomainModel => {

        const WaterConsumptionModel: WaterConsumptionDomainModel = {
            PatientUserId : request.body.PatientUserId,
            Volume        : request.body.Volume,
            Time          : request.body.Time ?? null,
        };

        return WaterConsumptionModel;
    };

    create = async (request: express.Request): Promise<WaterConsumptionDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<WaterConsumptionSearchFilters> => {

        await this.validateUuid(request,'patientUserId', Where.Query, false, false);
        await this.validateInt(request, 'dailyVolumeFrom', Where.Query, false, false);
        await this.validateInt(request, 'dailyVolumeTo', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<WaterConsumptionDomainModel> => {
        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private  async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateInt(request, 'Volume', Where.Body, true, false);
        await this.validateDate(request, 'Time', Where.Body, true, false);

        this.validateRequest(request);
    }

    private  async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateInt(request, 'Volume', Where.Body, false, false);
        await this.validateDate(request, 'Time', Where.Body, false, false);

        this.validateRequest(request);
    }

    private getFilter(request): WaterConsumptionSearchFilters {

        var filters: WaterConsumptionSearchFilters = {
            PatientUserId   : request.query.patientUserId ?? null,
            DailyVolumeFrom : request.query.dailyVolumeFrom ?? null,
            DailyVolumeTo   : request.query.dailyVolumeTo ?? null,

        };

        return this.updateBaseSearchFilters(request, filters);
    }

}
