import express from 'express';
import { FoodConsumptionDomainModel } from '../../../../domain.types/wellness/nutrition/food.consumption/food.consumption.domain.model';
import { FoodConsumptionSearchFilters } from '../../../../domain.types/wellness/nutrition/food.consumption/food.consumption.search.types';
import { BaseValidator, Where } from '../../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class FoodConsumptionValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): FoodConsumptionDomainModel => {

        const FoodConsumptionModel: FoodConsumptionDomainModel = {
            PatientUserId   : request.body.PatientUserId ?? null,
            Food            : request.body.Food ?? null,
            FoodTypes       : request.body.FoodTypes ?? [],
            Servings        : request.body.Servings ?? null,
            ServingUnit     : request.body.ServingUnit ?? null,
            Tags            : request.body.Tags ?? [],
            UserResponse    : request.body.UserResponse ?? null,
            Description     : request.body.Description ?? null,
            ConsumedAs      : request.body.ConsumedAs ?? null,
            Calories        : request.body.Calories ?? null,
            ImageResourceId : request.body.ImageResourceId ?? null,
            StartTime       : request.body.StartTime ?? null,
            EndTime         : request.body.EndTime ?? null,
        };

        return FoodConsumptionModel;
    };

    create = async (request: express.Request): Promise<FoodConsumptionDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<FoodConsumptionSearchFilters> => {

        await this.validateUuid(request, 'patientUserId', Where.Query, false, false);
        await this.validateString(request, 'food', Where.Query, false, false, true);
        await this.validateArray(request, 'foodTypes', Where.Query, false, false);
        await this.validateDecimal(request, 'servings', Where.Query, false, false);
        await this.validateString(request, 'servingUnit', Where.Query, false, false);
        await this.validateArray(request, 'tags', Where.Query, false, false);
        await this.validateBoolean(request, 'userResponse', Where.Query, false, false);
        await this.validateString(request, 'consumedAs', Where.Query, false, false, true);
        await this.validateDate(request, 'dateFrom', Where.Query, false, false);
        await this.validateDate(request, 'dateTo', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<FoodConsumptionDomainModel> => {
        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private  async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateString(request, 'Food', Where.Body, false, true);
        await this.validateArray(request, 'FoodTypes', Where.Body, false, true);
        await this.validateDecimal(request, 'Servings', Where.Body, false, true);
        await this.validateString(request, 'ServingUnit', Where.Body, false, true);
        await this.validateArray(request, 'Tags', Where.Body, false, true);
        await this.validateBoolean(request, 'UserResponse', Where.Query, false, true);
        await this.validateString(request, 'Description', Where.Body, false, true);
        await this.validateString(request, 'ConsumedAs', Where.Body, false, true);
        await this.validateDecimal(request, 'Calories', Where.Body, false, true);
        await this.validateDate(request, 'StartTime', Where.Body, false, true);
        await this.validateDate(request, 'EndTime', Where.Body, false, true);

        this.validateRequest(request);
    }

    private  async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateString(request, 'Food', Where.Body, false, false);
        await this.validateArray(request, 'FoodTypes', Where.Body, false, false);
        await this.validateDecimal(request, 'Servings', Where.Body, false, false);
        await this.validateString(request, 'ServingUnit', Where.Body, false, false);
        await this.validateArray(request, 'Tags', Where.Body, false, false);
        await this.validateBoolean(request, 'UserResponse', Where.Query, false, false);
        await this.validateString(request, 'Description', Where.Body, false, false);
        await this.validateString(request, 'ConsumedAs', Where.Body, false, false);
        await this.validateDecimal(request, 'Calories', Where.Body, false, false);
        await this.validateDate(request, 'StartTime', Where.Body, false, false);
        await this.validateDate(request, 'EndTime', Where.Body, false, false);

        this.validateRequest(request);
    }

    private getFilter(request): FoodConsumptionSearchFilters {

        var filters: FoodConsumptionSearchFilters = {
            PatientUserId : request.query.patientUserId ?? null,
            Food          : request.query.food ?? null,
            FoodTypes     : request.query.foodTypes ?? null,
            Servings      : request.query.servings ?? null,
            ServingUnit   : request.query.servingUnit ?? null,
            Tags          : request.query.tags ?? null,
            UserResponse  : request.query.userResponse ?? null,
            ConsumedAs    : request.query.consumedAs ?? null,
            DateFrom      : request.query.dateFrom ?? null,
            DateTo        : request.query.dateTo ?? null,
        };

        return this.updateBaseSearchFilters(request, filters);
    }

}
