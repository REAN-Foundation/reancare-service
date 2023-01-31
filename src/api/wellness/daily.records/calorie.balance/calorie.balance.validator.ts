import express from 'express';
import { CalorieBalanceDomainModel } from '../../../../domain.types/wellness/daily.records/calorie.balance/calorie.balance.domain.model';
import { CalorieBalanceSearchFilters } from '../../../../domain.types/wellness/daily.records/calorie.balance/calorie.balance.search.types';
import { BaseValidator, Where } from '../../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class CalorieBalanceValidator extends BaseValidator {

    getDomainModel = (request: express.Request): CalorieBalanceDomainModel => {

        const calorieBalanceModel: CalorieBalanceDomainModel = {
            PatientUserId    : request.body.PatientUserId ?? null,
            CaloriesConsumed : request.body.CaloriesConsumed ?? null,
            CaloriesBurned   : request.body.CaloriesBurned ?? null,
            Unit             : request.body.Unit ?? 'kcal',
            RecordDate       : request.body.RecordDate ?? new Date(),
        };

        return calorieBalanceModel;
    };

    create = async (request: express.Request): Promise<CalorieBalanceDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<CalorieBalanceSearchFilters> => {

        await this.validateUuid(request, 'patientUserId', Where.Query, false, false);
        await this.validateDecimal(request, 'minCaloriesConsumedValue', Where.Query, false, false);
        await this.validateDecimal(request, 'maxCaloriesConsumedValue', Where.Query, false, false);
        await this.validateDecimal(request, 'minCaloriesBurnedValue', Where.Query, false, false);
        await this.validateDecimal(request, 'maxCaloriesBurnedValue', Where.Query, false, false);
        await this.validateDecimal(request, 'minCalorieBalanceValue', Where.Query, false, false);
        await this.validateDecimal(request, 'maxCalorieBalanceValue', Where.Query, false, false);
        await this.validateDate(request, 'createdDateFrom', Where.Query, false, false);
        await this.validateDate(request, 'createdDateTo', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<CalorieBalanceDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private  async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateDecimal(request, 'CaloriesConsumed', Where.Body, true, false);
        await this.validateDecimal(request, 'CaloriesBurned', Where.Body, true, false);
        await this.validateString(request, 'Unit', Where.Body, false, true);
        await this.validateDate(request, 'RecordDate', Where.Body, false, false);

        this.validateRequest(request);
    }

    private  async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateDecimal(request, 'CaloriesConsumed', Where.Body, false, false);
        await this.validateDecimal(request, 'CaloriesBurned', Where.Body, false, false);
        await this.validateDecimal(request, 'CalorieBalance', Where.Body, false, false);
        await this.validateString(request, 'Unit', Where.Body, false, false);
        await this.validateDate(request, 'RecordDate', Where.Body, false, false);

        this.validateRequest(request);
    }

    private getFilter(request): CalorieBalanceSearchFilters {

        var filters: CalorieBalanceSearchFilters = {
            PatientUserId            : request.query.patientUserId ?? null,
            MinCaloriesConsumedValue : request.query.minCaloriesConsumedValue ?? null,
            MaxCaloriesConsumedValue : request.query.maxCaloriesConsumedValue ?? null,
            MinCaloriesBurnedValue   : request.query.minCaloriesBurnedValue ?? null,
            MaxCaloriesBurnedValue   : request.query.maxCaloriesBurnedValue ?? null,
            MinCalorieBalanceValue   : request.query.minCalorieBalanceValue ?? null,
            MaxCalorieBalanceValue   : request.query.maxCalorieBalanceValue ?? null,
            CreatedDateFrom          : request.query.createdDateFrom ?? null,
            CreatedDateTo            : request.query.createdDateTo ?? null,
        };

        return this.updateBaseSearchFilters(request, filters);
    }

}
