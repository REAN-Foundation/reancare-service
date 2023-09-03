import express from 'express';
import { DrugDomainModel } from '../../../../domain.types/clinical/medication/drug/drug.domain.model';
import { DrugSearchFilters } from '../../../../domain.types/clinical/medication/drug/drug.search.types';
import { BaseValidator, Where } from '../../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class DrugValidator extends BaseValidator{

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): DrugDomainModel => {

        const DrugModel: DrugDomainModel = {
            DrugName             : request.body.DrugName,
            GenericName          : request.body.GenericName ?? null,
            Ingredients          : request.body.Ingredients ?? null,
            Strength             : request.body.Strength ?? null,
            OtherCommercialNames : request.body.OtherCommercialNames ?? null,
            Manufacturer         : request.body.Manufacturer ?? null,
            OtherInformation     : request.body.OtherInformation ?? null,

        };

        return DrugModel;
    };

    create = async (request: express.Request): Promise<DrugDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<DrugSearchFilters> => {

        await this.validateString(request, 'name', Where.Query, false, false);
        await this.validateString(request, 'GenericName', Where.Body, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<DrugDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private  async validateCreateBody(request) {

        await this.validateString(request, 'DrugName', Where.Body, true, false);
        await this.validateString(request, 'GenericName', Where.Body, false, true);
        await this.validateString(request, 'Ingredients', Where.Body, false, true);
        await this.validateString(request, 'Strength', Where.Body, false, true);
        await this.validateString(request, 'OtherCommercialNames', Where.Body, false, true);
        await this.validateString(request, 'Manufacturer', Where.Body, false, true);
        await this.validateString(request, 'OtherInformation', Where.Body, false, true);

        this.validateRequest(request);
    }

    private  async validateUpdateBody(request) {

        await this.validateString(request, 'DrugName', Where.Body, false, false);
        await this.validateString(request, 'GenericName', Where.Body, false, true);
        await this.validateString(request, 'Ingredients', Where.Body, false, true);
        await this.validateString(request, 'Strength', Where.Body, false, true);
        await this.validateString(request, 'OtherCommercialNames', Where.Body, false, true);
        await this.validateString(request, 'Manufacturer', Where.Body, false, true);
        await this.validateString(request, 'OtherInformation', Where.Body, false, true);

        this.validateRequest(request);
    }

    private getFilter(request): DrugSearchFilters {

        var filters: DrugSearchFilters = {
            Name        : request.query.name ?? null,
            GenericName : request.query.genericName ?? null,
        };

        return this.updateBaseSearchFilters(request, filters);
    }

}
