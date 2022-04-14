import express from 'express';
import { HealthPriorityDomainModel } from '../../../domain.types/health.priority/health.priority.domain.model';
import { BaseValidator, Where } from '../base.validator';

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
        await this.validateBoolean(request, 'IsPrimary', Where.Body, true, false);

        this.validateRequest(request);
    }

    getPatientHealthPriorities = async (request: express.Request): Promise<HealthPriorityDomainModel> => {

        await this.validateUuid(request, 'patientUserId', Where.Param, true, false);
        await this.validateQueryParams(request);

        return this.getFilter(request);
    };

    private async validateQueryParams(request) {

        await this.validateString(request, 'providerEnrollmentId', Where.Query, true, false);
        await this.validateString(request, 'provider', Where.Query, true, false);
        await this.validateString(request, 'providerCareplanName', Where.Query, true, false);
        await this.validateString(request, 'providerCareplanCode', Where.Query, true, false);
    
        this.validateRequest(request);
    }

    private getFilter(request): HealthPriorityDomainModel {

        const filters: HealthPriorityDomainModel = {
            PatientUserId        : request.params.patientUserId ?? null,
            ProviderEnrollmentId : request.query.providerEnrollmentId ?? null,
            Provider             : request.query.provider ?? null,
            ProviderCareplanName : request.query.providerCareplanName ?? null,
            ProviderCareplanCode : request.query.providerCareplanCode ?? null,

        };
        return this.updateBaseSearchFilters(request, filters);
    }

}
