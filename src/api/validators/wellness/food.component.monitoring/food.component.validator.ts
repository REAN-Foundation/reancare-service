import express from 'express';
import { FoodComponentDomainModel } from '../../../../domain.types/wellness/food.component.monitoring/food.component.domain.model';
import { FoodComponentSearchFilters } from '../../../../domain.types/wellness/food.component.monitoring/food.component.search.types';
import { BaseValidator, Where } from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class FoodComponentValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): FoodComponentDomainModel => {

        const foodComponentModel: FoodComponentDomainModel = {
            PatientUserId: request.body.PatientUserId,
            TypeOfFood   : request.body.TypeOfFood,
            Amount       : request.body.Amount,
            Unit         : request.body.Unit,
        };

        return foodComponentModel;
    };

    create = async (request: express.Request): Promise<FoodComponentDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<FoodComponentSearchFilters> => {

        await this.validateUuid(request,'patientUserId', Where.Query, false, false);
        await this.validateString(request, 'typeOfFood', Where.Query, false, false);
        await this.validateDecimal(request, 'amountFrom', Where.Query, false, false);
        await this.validateDecimal(request, 'amountTo', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);
        
        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<FoodComponentDomainModel> => {
        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private  async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateString(request, 'TypeOfFood', Where.Body, true, false);
        await this.validateDecimal(request, 'Amount', Where.Body, true, false);
        await this.validateString(request, 'Unit', Where.Body, false, true);

        this.validateRequest(request);
    }
    
    private  async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateString(request, 'TypeOfFood', Where.Body, false, false);
        await this.validateDecimal(request, 'Amount', Where.Body, false, false);
        await this.validateString(request, 'Unit', Where.Body, true, false);
        
        this.validateRequest(request);
    }

    private getFilter(request): FoodComponentSearchFilters {
        
        var filters: FoodComponentSearchFilters = {
            PatientUserId: request.query.patientUserId ?? null,
            TypeOfFood   : request.query.typeOfFood ?? null,
            AmountFrom   : request.query.amountFrom ?? null,
            AmountTo     : request.query.amountTo ?? null,
        
        };

        return this.updateBaseSearchFilters(request, filters);
    }

}
