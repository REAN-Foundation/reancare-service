import express from 'express';
import { FoodComponentMonitoringDomainModel } from '../../../domain.types/wellness/food.component.monitoring/food.component.monitoring.domain.model';
import { FoodComponentMonitoringSearchFilters } from '../../../domain.types/wellness/food.component.monitoring/food.component.monitoring.search.types';
import { BaseValidator, Where } from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class FoodComponentMonitoringValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): FoodComponentMonitoringDomainModel => {

        const foodComponentMonitoringModel: FoodComponentMonitoringDomainModel = {
            PatientUserId          : request.body.PatientUserId,
            MonitoredFoodComponent : request.body.MonitoredFoodComponent,
            Amount                 : request.body.Amount,
            Unit                   : request.body.Unit,
        };

        return foodComponentMonitoringModel;
    };

    create = async (request: express.Request): Promise<FoodComponentMonitoringDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<FoodComponentMonitoringSearchFilters> => {

        await this.validateUuid(request,'patientUserId', Where.Query, false, false);
        await this.validateString(request, 'monitoredFoodComponent', Where.Query, false, false);
        await this.validateDecimal(request, 'amountFrom', Where.Query, false, false);
        await this.validateDecimal(request, 'amountTo', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<FoodComponentMonitoringDomainModel> => {
        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private  async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateString(request, 'MonitoredFoodComponent', Where.Body, false, true);
        await this.validateDecimal(request, 'Amount', Where.Body, true, false);
        await this.validateString(request, 'Unit', Where.Body, false, true);

        this.validateRequest(request);
    }

    private  async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateString(request, 'MonitoredFoodcomponent', Where.Body, false, false);
        await this.validateDecimal(request, 'Amount', Where.Body, false, false);
        await this.validateString(request, 'Unit', Where.Body, true, false);

        this.validateRequest(request);
    }

    private getFilter(request): FoodComponentMonitoringSearchFilters {

        var filters: FoodComponentMonitoringSearchFilters = {
            PatientUserId          : request.query.patientUserId ?? null,
            MonitoredFoodComponent : request.query.monitoredFoodComponent ?? null,
            AmountFrom             : request.query.amountFrom ?? null,
            AmountTo               : request.query.amountTo ?? null,

        };

        return this.updateBaseSearchFilters(request, filters);
    }

}
