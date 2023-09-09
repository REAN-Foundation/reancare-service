import express from 'express';
import {
    CohortCreateDomainModel,
    CohortUpdateDomainModel,
    CohortSearchFilters
} from '../../../domain.types/community/cohorts/cohort.domain.model';
import { BaseValidator, Where } from '../../base.validator';
import { uuid } from '../../../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////////////////////

export class CohortValidator extends BaseValidator {

    constructor() {
        super();
    }

    create = async (request: express.Request): Promise<CohortCreateDomainModel> => {
        await this.validateCreate(request);
        return this.getCreateModel(request.body, request.currentUser.UserId);
    };

    public search = async (request: express.Request): Promise<CohortSearchFilters> => {
        await this.validateSearch(request);
        const filters = this.getSearchFilters(request);
        return filters;
    };

    public update = async (request: express.Request): Promise<CohortUpdateDomainModel> => {
        await this.validateUpdate(request);
        const filters = this.getUpdateModel(request.body);
        return filters;
    };

    private getCreateModel = (requestBody: any, currentUserId: uuid): CohortCreateDomainModel => {

        const model: CohortCreateDomainModel = {
            TenantId    : requestBody.TenantId ?? null,
            Name        : requestBody.Name ?? null,
            Description : requestBody.Description ?? null,
            ImageUrl    : requestBody.ImageUrl ?? null,
            OwnerUserId : currentUserId,
        };
        return model;
    };

    private getUpdateModel = (requestBody: any): CohortUpdateDomainModel => {

        const model: CohortUpdateDomainModel = {
            TenantId    : requestBody.TenantId ?? null,
            Name        : requestBody.Name ?? null,
            Description : requestBody.Description ?? null,
            ImageUrl    : requestBody.ImageUrl ?? null,
        };

        return model;
    };

    private getSearchFilters = (request: express.Request): CohortSearchFilters => {

        var filters: CohortSearchFilters = {
            Name     : request.query.name as string ?? null,
            UserId   : request.query.userId as string  ?? null,
            TenantId : request.query.tenantId as string  ?? null,
        };

        return this.updateBaseSearchFilters(request, filters);
    };

    private async validateCreate(request) {
        await this.validateUuid(request, 'TenantId', Where.Body, true, false);
        await this.validateString(request, 'Name', Where.Body, true, false);
        await this.validateString(request, 'Description', Where.Body, false, false);
        await this.validateString(request, 'ImageUrl', Where.Body, false, false);
        await this.validateRequest(request);
    }

    private async validateUpdate(request) {
        await this.validateUuid(request, 'TenantId', Where.Body, false, false);
        await this.validateString(request, 'Name', Where.Body, false, false);
        await this.validateString(request, 'Description', Where.Body, false, false);
        await this.validateString(request, 'ImageUrl', Where.Body, false, false);
        await this.validateRequest(request);
    }

    private async validateSearch(request) {
        await this.validateString(request, 'name', Where.Query, false, false);
        await this.validateUuid(request, 'userId', Where.Query, false, false);
        await this.validateUuid(request, 'tenantId', Where.Query, false, false);
        await this.validateRequest(request);
    }

}
