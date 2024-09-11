import express from 'express';
import { BaseValidator, Where } from '../../../../api/base.validator';
import { FollowUpCancellationDomainModel } from '../../../../domain.types/tenant/followups/cancellations/follow.up.cancellation.domain.model';
import { FollowUpCancellationSearchFilters } from '../../../../domain.types/tenant/followups/cancellations/follow.up.cancellation.search.types';

export class FollowUpCancellationValidator extends BaseValidator {

    constructor() {
        super();
    }

    getCreateDomainModel = (request: express.Request): FollowUpCancellationDomainModel => {

        const model: FollowUpCancellationDomainModel = {
            TenantId   : request.body.TenantId,
            TenantName : request.body.TenantName ?? null,
            CancelDate : request.body.CancelDate,
        };

        return model;
    };

    getUpdateDomainModel = (request: any): FollowUpCancellationDomainModel => {
        const model: FollowUpCancellationDomainModel = {
            CancelDate : request.body.CancelDate ?? null,
        };

        return model;
    };

    create = async (request: express.Request): Promise<FollowUpCancellationDomainModel> => {
        await this.validateCreateBody(request);
        return this.getCreateDomainModel(request);
    };

    search = async (request: express.Request): Promise<FollowUpCancellationDomainModel> => {
        await this.validateUuid(request, 'tenantId', Where.Body, false, false);
        await this.validateString(request, 'tenantName', Where.Query, false, false);
        await this.validateDate(request, 'cancelDate', Where.Body, false, false);
        await this.validateDate(request, 'dateFrom', Where.Query, false, false);
        await this.validateDate(request, 'dateTo', Where.Query, false, false);
        await this.validateBaseSearchFilters(request);
        this.validateRequest(request);
        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<FollowUpCancellationDomainModel> => {
        await this.validateUpdateBody(request);
        const domainModel = this.getUpdateDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private async validateCreateBody(request) {
        await this.validateUuid(request, 'TenantId', Where.Body, true, false);
        await this.validateString(request, 'TenantName', Where.Body, false, true);
        await this.validateDate(request, 'CancelDate', Where.Body, true, false);
        await this.validateRequest(request);
    }

    private async validateUpdateBody(request) {
        await this.validateUuid(request, 'TenantId', Where.Body, false, false);
        await this.validateString(request, 'TenantName', Where.Body, false, false);
        await this.validateDate(request, 'CancelDate', Where.Body, true, false);
        await this.validateRequest(request);
    }

    private getFilter(request): FollowUpCancellationSearchFilters {

        const filters: FollowUpCancellationSearchFilters = {
            TenantId   : request.query.tenantId ?? null,
            TenantName : request.query.tenantName ?? null,
            CancelDate : request.query.cancelDate ?? null,
            DateFrom   : request.query.dateFrom ?? null,
            DateTo     : request.query.dateTo ?? null,
        };

        return this.updateBaseSearchFilters(request, filters);
    }

}
