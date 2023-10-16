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
            Query       : request.body.Query,
            Tags        : request.body.Tags ?? null,
            Format      : request.body.Format ?? null,
            Description : request.body.Description ?? null,
            UserId      : request.body.UserId ?? null,
            TenantId    : request.body.TenantId ?? null
        };

        return executeQueryDomainModel;
    };

    validateQuery = async (request: express.Request): Promise<CustomQueryDomainModel> => {
        await this.validateCreateBody(request);
        return this.getQueryModel(request);
    };

    update = async (request: express.Request): Promise<CustomQueryDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getQueryModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    search = async (request: express.Request): Promise<CustomQuerySearchFilters> => {
        await this.validateString(request, 'name', Where.Query, false, false);
        await this.validateUuid(request, 'userId', Where.Query, false, false);
        await this.validateUuid(request, 'tenantId', Where.Query, false, false);
        await this.validateString(request, 'tags', Where.Query, false, false);
        await this.validateBaseSearchFilters(request);
        this.validateRequest(request);
        return this.getFilter(request);
    };

    private  async validateCreateBody(request) {

        await this.validateString(request, 'Name', Where.Body, true, false);
        await this.validateString(request, 'Query', Where.Body, true, false);
        await this.validateString(request, 'Format', Where.Body, true, false);
        await this.validateString(request, 'Description', Where.Body, false, true);
        await this.validateUuid(request, 'UserId', Where.Body, false, true);
        await this.validateUuid(request, 'TenantId', Where.Body, false, true);
        await this.validateArray(request, 'Tags', Where.Body, false, true);
        this.validateRequest(request);
    }

    private getFilter(request): CustomQuerySearchFilters {
        var filters: CustomQuerySearchFilters = {
            Name     : request.query.name ?? null,
            UserId   : request.query.userId ?? null,
            TenantId : request.query.tenantId ?? null,
            Tags     : request.query.tags ?? null
        };
        return this.updateBaseSearchFilters(request, filters);
    }

    private  async validateUpdateBody(request) {

        await this.validateString(request, 'Name', Where.Body, false , false);
        await this.validateString(request, 'Query', Where.Body, false, false);
        await this.validateString(request, 'Format', Where.Body, false, true);
        await this.validateString(request, 'Description', Where.Body, false, true);
        await this.validateUuid(request, 'UserId', Where.Body, false, true);
        await this.validateUuid(request, 'TenantId', Where.Body, false, true);
        await this.validateArray(request, 'Tags', Where.Body, false, true);
        this.validateRequest(request);
    }

}
