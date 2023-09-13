import express from 'express';
import { BaseValidator, Where } from '../../base.validator';
import { WearableDeviceDetailsDomainModel } from '../../../domain.types/webhook/wearable.device.details/webhook.wearable.device.details.domain.model';
import { WearableDeviceDetailsSearchFilters } from '../../../domain.types/webhook/wearable.device.details/webhook.wearable.device.details.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class WearableDeviceDetailsValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): WearableDeviceDetailsDomainModel => {

        const wearableDeviceDetailsDomainModel: WearableDeviceDetailsDomainModel = {
            PatientUserId     : request.body.PatientUserId,
            TerraUserId       : request.body.TerraUserId,
            Provider          : request.body.Provider,
            Scopes            : request.body.Scopes,
            AuthenticatedAt   : request.body.AuthenticatedAt,
            DeauthenticatedAt : request.body.DeauthenticatedAt
        };

        return wearableDeviceDetailsDomainModel;
    };

    create = async (request: express.Request): Promise<WearableDeviceDetailsDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<WearableDeviceDetailsSearchFilters> => {

        await this.validateUuid(request, 'patientUserId', Where.Query, false, false);
        await this.validateUuid(request, 'terraUserId', Where.Query, false, false);
        await this.validateString(request, 'provider', Where.Query, false, false);
        await this.validateDate(request, 'createdDateFrom', Where.Query, false, false);
        await this.validateDate(request, 'createdDateTo', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<WearableDeviceDetailsDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');

        return domainModel;
    };

    private async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateUuid(request, 'TerraUserId', Where.Body, false, false);
        await this.validateString(request, 'Provider', Where.Body, true, false);
        await this.validateString(request, 'Scopes', Where.Body, false, true);
        await this.validateDate(request, 'AuthenticatedAt', Where.Body, false, false);
        await this.validateDate(request, 'DeauthenticatedAt', Where.Body, false, false);

        this.validateRequest(request);

    }

    private  async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateUuid(request, 'TerraUserId', Where.Body, false, false);
        await this.validateString(request, 'Provider', Where.Body, false, false);
        await this.validateString(request, 'Scopes', Where.Body, false, false);
        await this.validateDate(request, 'AuthenticatedAt', Where.Body, false, false);
        await this.validateDate(request, 'DeauthenticatedAt', Where.Body, false, false);

        this.validateRequest(request);
    }

    private getFilter(request): WearableDeviceDetailsSearchFilters {

        const filters: WearableDeviceDetailsSearchFilters = {
            PatientUserId   : request.query.patientUserId ?? null,
            TerraUserId     : request.query.terraUserId ?? null,
            Provider        : request.query.provider ?? null,
            CreatedDateFrom : request.query.createdDateFrom ?? null,
            CreatedDateTo   : request.query.createdDateTo ?? null,

        };
        return this.updateBaseSearchFilters(request, filters);
    }

}
