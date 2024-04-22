import express from 'express';
import {
    ConsentCreateModel,
    ConsentUpdateModel,
    ConsentSearchFilters
} from '../../../domain.types/auth/consent.types';
import { BaseValidator, Where } from '../../base.validator';
import { uuid } from '../../../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////////////////////

export class ConsentValidator extends BaseValidator {

    constructor() {
        super();
    }

    create = async (request: express.Request): Promise<ConsentCreateModel> => {
        await this.validateCreate(request);
        return this.getCreateModel(request.body, request.currentUser.UserId);
    };

    public search = async (request: express.Request): Promise<ConsentSearchFilters> => {
        await this.validateSearch(request);
        const filters = this.getSearchFilters(request);
        return filters;
    };

    public update = async (request: express.Request): Promise<ConsentUpdateModel> => {
        await this.validateUpdate(request);
        const filters = this.getUpdateModel(request.body);
        return filters;
    };

    private getCreateModel = (requestBody: any, currentUserId: uuid): ConsentCreateModel => {

        const model: ConsentCreateModel = {
            ResourceId             : requestBody.ResourceId ?? null,
            ResourceCategory       : requestBody.ResourceCategory ?? null,
            ResourceName           : requestBody.ResourceName ?? null,
            TenantId               : requestBody.TenantId ?? null,
            OwnerUserId            : currentUserId,
            ConsentHolderUserId    : requestBody.ConsentHolderUserId ?? null,
            AllResourcesInCategory : requestBody.AllResourcesInCategory ?? null,
            TenantOwnedResource    : requestBody.TenantOwnedResource ?? null,
            Perpetual              : requestBody.Perpetual ?? null,
            Revoked                : requestBody.Revoked ?? null,
            RevokedTimestamp       : requestBody.RevokedTimestamp ?? null,
            ConsentGivenOn         : requestBody.ConsentGivenOn ?? null,
            ConsentValidFrom       : requestBody.ConsentValidFrom ?? null,
            ConsentValidTill       : requestBody.ConsentValidTill ?? null,
        };
        return model;
    };

    private getUpdateModel = (requestBody: any): ConsentUpdateModel => {

        const model: ConsentUpdateModel = {
            AllResourcesInCategory : requestBody.AllResourcesInCategory ?? null,
            TenantOwnedResource    : requestBody.TenantOwnedResource ?? null,
            Perpetual              : requestBody.Perpetual ?? null,
        };

        return model;
    };

    private getSearchFilters = (request: express.Request): ConsentSearchFilters => {

        var filters: ConsentSearchFilters = {
            TenantId               : request.query.tenantId as string ?? null,
            ResourceCategory       : request.query.resourceCategory as string ?? null,
            ResourceName           : request.query.resourceName as string ?? null,
            OwnerUserId            : request.query.ownerUserId as string ?? null,
            ConsentHolderUserId    : request.query.consentHolderUserId as string ?? null,
            AllResourcesInCategory : request.query.allResourcesInCategory ? request.query.allResourcesInCategory === 'true' : null,
            TenantOwnedResource    : request.query.tenantOwnedResource ? request.query.tenantOwnedResource === 'true' : null,
            Perpetual              : request.query.perpetual ? request.query.perpetual === 'true' : null,
        };

        return this.updateBaseSearchFilters(request, filters);
    };

    private async validateCreate(request) {
        await this.validateUuid(request, 'ResourceId', Where.Body, false, false); //False when consent is given to whole resource category
        await this.validateString(request, 'ResourceCategory', Where.Body, true, false);
        await this.validateString(request, 'ResourceName', Where.Body, false, false);
        await this.validateUuid(request, 'TenantId', Where.Body, true, false);
        await this.validateUuid(request, 'ConsentHolderUserId', Where.Body, true, false);
        await this.validateBoolean(request, 'AllResourcesInCategory', Where.Body, false, false);
        await this.validateBoolean(request, 'TenantOwnedResource', Where.Body, false, false);
        await this.validateBoolean(request, 'Perpetual', Where.Body, false, false);
        await this.validateBoolean(request, 'Revoked', Where.Body, false, false);
        await this.validateDate(request, 'RevokedTimestamp', Where.Body, true, false);
        await this.validateDate(request, 'ConsentGivenOn', Where.Body, true, false);
        await this.validateDate(request, 'ConsentValidFrom', Where.Body, true, false);
        await this.validateDate(request, 'ConsentValidTill', Where.Body, true, false);
        await this.validateRequest(request);
    }

    private async validateUpdate(request) {
        await this.validateBoolean(request, 'AllResourcesInCategory', Where.Body, false, false);
        await this.validateBoolean(request, 'TenantOwnedResource', Where.Body, false, false);
        await this.validateBoolean(request, 'Perpetual', Where.Body, false, false);
        await this.validateRequest(request);
    }

    private async validateSearch(request) {
        await this.validateUuid(request, 'tenantId', Where.Query, false, false);
        await this.validateString(request, 'resourceCategory', Where.Query, false, false);
        await this.validateString(request, 'resourceName', Where.Query, false, false);
        await this.validateUuid(request, 'ownerUserId', Where.Query, false, false);
        await this.validateUuid(request, 'consentHolderUserId', Where.Query, false, false);
        await this.validateBoolean(request, 'allResourcesInCategory', Where.Query, false, false);
        await this.validateBoolean(request, 'tenantOwnedResource', Where.Query, false, false);
        await this.validateBoolean(request, 'perpetual', Where.Query, false, false);
        await this.validateRequest(request);
    }

}
