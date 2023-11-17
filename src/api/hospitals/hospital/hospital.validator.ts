import express from 'express';
import { HospitalDomainModel } from '../../../domain.types/hospitals/hospital/hospital.domain.model';
import { HospitalSearchFilters } from '../../../domain.types/hospitals/hospital/hospital.search.types';
import { BaseValidator, Where } from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class HospitalValidator extends BaseValidator {

    constructor() {
        super();
    }

    getCreateDomainModel = (requestBody: any): HospitalDomainModel => {

        const model: HospitalDomainModel = {
            HealthSystemId : requestBody.HealthSystemId ?? null,
            Name           : requestBody.Name,
            Tags           : requestBody.Tags ?? [],
        };

        return model;
    };

    getUpdateDomainModel = (requestBody: any): HospitalDomainModel => {

        const model: HospitalDomainModel = {
            HealthSystemId : requestBody.HealthSystemId ?? null,
            Name           : requestBody.Name ?? null,
            Tags           : requestBody.Tags ?? null,
        };

        return model;
    };

    create = async (request: express.Request): Promise<HospitalDomainModel> => {
        await this.validateCreateBody(request);
        return this.getCreateDomainModel(request.body);
    };

    search = async (request: express.Request): Promise<HospitalSearchFilters> => {

        await this.validateUuid(request, 'healthSystemId', Where.Query, false, false);
        await this.validateString(request, 'name', Where.Query, false, false);
        await this.validateString(request, 'tag', Where.Query, false, false);
        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<HospitalDomainModel> => {
        await this.validateUpdateBody(request);
        const domainModel = this.getUpdateDomainModel(request.body);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private async validateCreateBody(request) {
        await this.validateUuid(request, 'HealthSystemId', Where.Body, false, false);
        await this.validateString(request, 'Name', Where.Body, true, false);
        await this.validateArray(request, 'Tags', Where.Body, false, true);
        await this.validateRequest(request);
    }

    private async validateUpdateBody(request) {
        await this.validateUuid(request, 'HealthSystemId', Where.Body, false, false);
        await this.validateString(request, 'Name', Where.Body, false, false);
        await this.validateArray(request, 'Tags', Where.Body, false, false);
        await this.validateRequest(request);
    }

    private getFilter(request): HospitalSearchFilters {

        const filters: HospitalSearchFilters = {
            HealthSystemId : request.query.healthSystemId ?? null,
            Name           : request.query.name ?? null,
            Tags           : request.query.tag ? request.query.tag.split(',') : null,
        };

        return this.updateBaseSearchFilters(request, filters);
    }

}
