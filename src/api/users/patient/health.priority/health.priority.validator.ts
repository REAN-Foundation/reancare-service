import express from 'express';
import { HealthPrioritySearchFilters } from '../../../../domain.types/users/patient/health.priority/health.priority.search.types';
import { HealthPriorityDomainModel } from '../../../../domain.types/users/patient/health.priority/health.priority.domain.model';
import { BaseValidator, Where } from '../../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class HealthPriorityValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): HealthPriorityDomainModel => {

        const HealthPriorityModel: HealthPriorityDomainModel = {
            PatientUserId        : request.body.PatientUserId,
            Source               : request.body.Source ?? null,
            Provider             : request.body.Provider ?? null,
            ProviderEnrollmentId : request.body.ProviderEnrollmentId,
            ProviderCareplanCode : request.body.ProviderCareplanCode ?? null,
            ProviderCareplanName : request.body.ProviderCareplanName ?? null,
            HealthPriorityType   : request.body.HealthPriorityType ?? null,
            StartedAt            : request.body.StartedAt ?? new Date(),
            CompletedAt          : request.body.CompletedAt ?? null,
            Status               : request.body.Status ?? null,
            IsPrimary            : request.body.IsPrimary ?? null,
        };

        return HealthPriorityModel;
    };

    create = async (request: express.Request): Promise<HealthPriorityDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    private  async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, true);
        await this.validateString(request, 'Source', Where.Body, true, false);
        await this.validateString(request, 'Provider', Where.Body, true, false);
        await this.validateString(request, 'ProviderEnrollmentId', Where.Body, false, true);
        await this.validateString(request, 'ProviderCareplanCode', Where.Body, true, false);
        await this.validateString(request, 'ProviderCareplanName', Where.Body, true, false);
        await this.validateString(request, 'HealthPriorityType', Where.Body, false, true);
        await this.validateDate(request, 'StartedAt', Where.Body, false, true);
        await this.validateDate(request, 'CompletedAt', Where.Body, false, true);
        await this.validateString(request, 'Status', Where.Body, false, true);
        await this.validateBoolean(request, 'IsPrimary', Where.Body, true, false);

        this.validateRequest(request);
    }

    getPatientHealthPriorities = async (request: express.Request): Promise<HealthPriorityDomainModel> => {

        await this.validateUuid(request, 'patientUserId', Where.Param, true, false);
        await this.validateQueryParams(request);

        return this.getFilter(request);
    };

    search = async (request: express.Request): Promise<HealthPrioritySearchFilters> => {

        await this.validateUuid(request, 'patientUserId', Where.Query, false, false);
        await this.validateInt(request, 'providerEnrollmentId', Where.Query, false, false);
        await this.validateString(request, 'provider', Where.Query, false, false);
        await this.validateString(request, 'healthPriorityType', Where.Query, false, false);
        await this.validateString(request, 'providerCareplanName', Where.Query, false, false);
        await this.validateString(request, 'providerCareplanCode', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<HealthPriorityDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private  async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateString(request, 'Source', Where.Body, false, false);
        await this.validateString(request, 'Provider', Where.Body, false, false);
        await this.validateString(request, 'ProviderEnrollmentId', Where.Body, false, false);
        await this.validateString(request, 'ProviderCareplanCode', Where.Body, false, false);
        await this.validateString(request, 'ProviderCareplanName', Where.Body, false, false);
        await this.validateString(request, 'HealthPriorityType', Where.Body, false, false);
        await this.validateDate(request, 'StartedAt', Where.Body, false, false);
        await this.validateDate(request, 'CompletedAt', Where.Body, false, false);
        await this.validateString(request, 'Status', Where.Body, false, false);
        await this.validateBoolean(request, 'IsPrimary', Where.Body, false, false);

        this.validateRequest(request);
    }

    private async validateQueryParams(request) {

        await this.validateString(request, 'providerEnrollmentId', Where.Query, true, false);
        await this.validateString(request, 'provider', Where.Query, true, false);
        await this.validateString(request, 'providerCareplanName', Where.Query, true, false);
        await this.validateString(request, 'providerCareplanCode', Where.Query, true, false);

        this.validateRequest(request);
    }

    private getFilter(request): HealthPriorityDomainModel {

        const filters: HealthPriorityDomainModel = {
            PatientUserId        : request.query.patientUserId ?? null,
            ProviderEnrollmentId : request.query.providerEnrollmentId ?? null,
            Provider             : request.query.provider ?? null,
            HealthPriorityType   : request.query.healthPriorityType ?? null,
            ProviderCareplanName : request.query.providerCareplanName ?? null,
            ProviderCareplanCode : request.query.providerCareplanCode ?? null,

        };
        return this.updateBaseSearchFilters(request, filters);
    }

}
