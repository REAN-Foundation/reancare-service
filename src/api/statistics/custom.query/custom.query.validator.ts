import express from 'express';
import { BaseValidator, Where } from '../../base.validator';
import { CustomQueryDomainModel } from '../../../domain.types/statistics/custom.query/custom.query.domain.model';
import { CustomQuerySearchFilters } from '../../../domain.types/statistics/custom.query/custom.query.search.type';

///////////////////////////////////////////////////////////////////////////////////////

export class CustomQueryValidator extends BaseValidator {

    constructor() {
        super();
    }

    getQueryModel = (request: express.Request): CustomQueryDomainModel => {

        const executeQueryDomainModel: CustomQueryDomainModel = {
            Name        : request.body.Name,
            Format      : request.body.Format ?? null,
            Description : request.body.Description ?? null,
            UserId      : request.body.UserId ?? null,
            TenantId    : request.body.TenantId ?? null
        };

        return executeQueryDomainModel;
    };

    validateQuery = async (request: express.Request): Promise<CustomQueryDomainModel> => {
        await this.validateQueryBody(request);
        return this.getQueryModel(request);
    };

    search = async (request: express.Request): Promise<CustomQuerySearchFilters> => {
        await this.validateString(request, 'name', Where.Query, false, false);
        await this.validateUuid(request, 'userId', Where.Query, false, false);
        await this.validateUuid(request, 'tenantId', Where.Query, false, false);
        await this.validateBaseSearchFilters(request);
        this.validateRequest(request);
        return this.getFilter(request);
    };

    private getFilter(request): CustomQuerySearchFilters {
        var filters: CustomQuerySearchFilters = {
            Name     : request.query.name ?? null,
            UserId   : request.query.userId ?? null,
            TenantId : request.query.tenantId ?? null,
        };
        return this.updateBaseSearchFilters(request, filters);
    }

    private  async validateQueryBody(request) {

        await this.validateString(request, 'Name', Where.Body, true, false);
        await this.validateString(request, 'Format', Where.Body, true, false);
        await this.validateString(request, 'Description', Where.Body, false, true);
        await this.validateUuid(request, 'UserId', Where.Body, false, true);
        await this.validateUuid(request, 'TenentId', Where.Body, false, true);
        this.validateRequest(request);
    }

}
