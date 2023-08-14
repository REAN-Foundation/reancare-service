import express from 'express';
import { TenantSearchFilters } from '../../domain.types/tenant/tenant.search.types';
import { TenantDomainModel } from '../../domain.types/tenant/tenant.domain.model';
import { BaseValidator, Where } from '../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class TenantValidator extends BaseValidator {

    constructor() {
        super();
    }

    createOrUpdate = async (request: express.Request, update = false): Promise<TenantDomainModel> => {

        const nameRequired = update ? false : true;
        await this.validateString(request, 'Name', Where.Body, nameRequired, false);
        await this.validateString(request, 'Description', Where.Body, false, true);
        await this.validateString(request, 'Code', Where.Body, false, true);
        await this.validateString(request, 'Phone', Where.Body, false, false);
        await this.validateString(request, 'Email', Where.Body, false, false);

        this.validateRequest(request);

        const body = request.body;

        const model: TenantDomainModel = {
            Name        : body.Name ?? null,
            Description : body.Description ?? null,
            Code        : body.Code ?? null,
            Phone       : body.Phone ?? null,
            Email       : body.Email ?? null,
        };
        if (update) {
            model.id = await this.getParamUuid(request, 'id');
        }
        return model;
    };

    search = async (request: express.Request): Promise<TenantSearchFilters> => {

        await this.validateString(request, 'name', Where.Query, false, false);
        await this.validateString(request, 'code', Where.Query, false, false);
        await this.validateString(request, 'phone', Where.Query, false, false);
        await this.validateString(request, 'email', Where.Query, false, false);
        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        const filters: TenantSearchFilters = {
            Name  : request.query.name as string ?? null,
            Code  : request.query.code as string  ?? null,
            Phone : request.query.phone as string  ?? null,
            Email : request.query.email as string  ?? null,
        };
        return this.updateBaseSearchFilters(request, filters);
    };

}
