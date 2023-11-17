import express from 'express';
import { HealthSystemDomainModel } from '../../../domain.types/hospitals/health.system/health.system.domain.model';
import { HealthSystemSearchFilters } from '../../../domain.types/hospitals/health.system/health.system.search.types';
import { BaseValidator, Where } from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class HealthSystemValidator extends BaseValidator {

    constructor() {
        super();
    }

    getCreateDomainModel = (requestBody: any): HealthSystemDomainModel => {

        const model: HealthSystemDomainModel = {
            Name : requestBody.Name,
            Tags : requestBody.Tags ?? [],
        };

        return model;
    };

    getUpdateDomainModel = (requestBody: any): HealthSystemDomainModel => {

        const model: HealthSystemDomainModel = {
            Name : requestBody.Name ?? null,
            Tags : requestBody.Tags ?? null,        };

        return model;
    };

    create = async (request: express.Request): Promise<HealthSystemDomainModel> => {
        await this.validateCreateBody(request);
        return this.getCreateDomainModel(request.body);
    };

    search = async (request: express.Request): Promise<HealthSystemSearchFilters> => {
        await this.validateString(request, 'name', Where.Query, false, false);
        await this.validateString(request, 'tag', Where.Query, false, false);
        await this.validateBaseSearchFilters(request);
        this.validateRequest(request);
        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<HealthSystemDomainModel> => {
        await this.validateUpdateBody(request);
        const domainModel = this.getUpdateDomainModel(request.body);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private async validateCreateBody(request) {
        await this.validateString(request, 'Name', Where.Body, true, false);
        await this.validateArray(request, 'Tags', Where.Body, false, true);
        await this.validateRequest(request);
    }

    private async validateUpdateBody(request) {
        await this.validateString(request, 'Name', Where.Body, false, false);
        await this.validateArray(request, 'Tags', Where.Body, false, false);
        await this.validateRequest(request);
    }

    private getFilter(request): HealthSystemSearchFilters {

        const filters: HealthSystemSearchFilters = {
            Name : request.query.name ?? null,
            Tags : request.query.tag ? request.query.tag.split(',') : null,
        };

        return this.updateBaseSearchFilters(request, filters);
    }

}
