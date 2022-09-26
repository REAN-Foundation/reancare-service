import express from 'express';
import { ActionPlanSearchFilters } from '../../../../domain.types/users/patient/action.plan/action.plan.search.types';
import { ActionPlanDomainModel } from '../../../../domain.types/users/patient/action.plan/action.plan.domain.model';
import { BaseValidator, Where } from '../../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class ActionPlanValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): ActionPlanDomainModel => {

        const model: ActionPlanDomainModel = {
            PatientUserId        : request.body.PatientUserId,
            Provider             : request.body.Provider ?? null,
            ProviderEnrollmentId : request.body.ProviderEnrollmentId,
            ProviderCareplanCode : request.body.ProviderCareplanCode ?? null,
            ProviderCareplanName : request.body.ProviderCareplanName ?? null,
            GoalId               : request.body.GoalId ?? null,
            Title                : request.body.Title ?? null,
            StartedAt            : request.body.StartedAt ?? new Date(),
            CompletedAt          : request.body.CompletedAt ?? null,
            Status               : request.body.Status ?? null,
            ScheduledEndDate     : request.body.ScheduledEndDate,
        };

        return model;
    };

    create = async (request: express.Request): Promise<ActionPlanDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    getSelectedActionPlans = async (request: express.Request): Promise<ActionPlanDomainModel> => {

        await this.validateUuid(request, 'patientUserId', Where.Param, true, false);
        await this.validateQueryParams(request);

        return this.getFilter(request);
    };

    private  async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, true);
        await this.validateString(request, 'Provider', Where.Body, true, false);
        await this.validateString(request, 'ProviderEnrollmentId', Where.Body, false, true);
        await this.validateString(request, 'ProviderCareplanCode', Where.Body, true, false);
        await this.validateString(request, 'ProviderCareplanName', Where.Body, true, false);
        await this.validateUuid(request, 'GoalId', Where.Body, true, false);
        await this.validateString(request, 'Title', Where.Body, true, false);
        await this.validateString(request, 'Status', Where.Body, false, true);
        await this.validateDate(request, 'StartedAt', Where.Body, false, true);
        await this.validateDate(request, 'CompletedAt', Where.Body, false, true);
        await this.validateDate(request, 'ScheduledEndDate', Where.Body, false, true);

        this.validateRequest(request);
    }

    getActionPlans = async (request: express.Request): Promise<ActionPlanDomainModel> => {

        await this.validateUuid(request, 'goalId', Where.Param, true, false);
        await this.validateQueryParams(request);

        return this.getFilter(request);
    };

    search = async (request: express.Request): Promise<ActionPlanSearchFilters> => {

        await this.validateUuid(request, 'patientUserId', Where.Query, false, false);
        await this.validateUuid(request, 'goalId', Where.Query, false, false);
        await this.validateInt(request, 'providerEnrollmentId', Where.Query, false, false);
        await this.validateString(request, 'title', Where.Query, false, false);
        await this.validateString(request, 'healthPriorityType', Where.Query, false, false);
        await this.validateString(request, 'providerCareplanName', Where.Query, false, false);
        await this.validateString(request, 'providerCareplanCode', Where.Query, false, false);
        await this.validateDate(request, 'startedAt', Where.Query, false, false);
        await this.validateDate(request, 'scheduledEndDate', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<ActionPlanDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private  async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateString(request, 'Provider', Where.Body, false, false);
        await this.validateString(request, 'ProviderEnrollmentId', Where.Body, false, false);
        await this.validateString(request, 'ProviderCareplanCode', Where.Body, false, false);
        await this.validateString(request, 'ProviderCareplanName', Where.Body, false, false);
        await this.validateUuid(request, 'GoalId', Where.Body, false, false);
        await this.validateString(request, 'Title', Where.Body, false, false);
        await this.validateDate(request, 'StartedAt', Where.Body, false, false);
        await this.validateDate(request, 'CompletedAt', Where.Body, false, false);
        await this.validateString(request, 'Status', Where.Body, false, false);
        await this.validateDate(request, 'ScheduledEndDate', Where.Body, false, false);

        this.validateRequest(request);
    }

    private async validateQueryParams(request) {

        await this.validateString(request, 'providerEnrollmentId', Where.Query, true, false);
        await this.validateString(request, 'provider', Where.Query, true, false);
        await this.validateString(request, 'providerCareplanName', Where.Query, true, false);
        await this.validateString(request, 'providerCareplanCode', Where.Query, true, false);

        this.validateRequest(request);
    }

    private getFilter(request): ActionPlanDomainModel {

        const filters: ActionPlanDomainModel = {
            GoalId               : request.query.goalId ?? null,
            PatientUserId        : request.query.patientUserId ?? null,
            ProviderEnrollmentId : request.query.providerEnrollmentId ?? null,
            Provider             : request.query.provider ?? null,
            ProviderCareplanName : request.query.providerCareplanName ?? null,
            ProviderCareplanCode : request.query.providerCareplanCode ?? null,
            Title                : request.query.title ?? null,
            StartedAt            : request.query.startedAt ?? null,
            ScheduledEndDate     : request.query.scheduledEndDate ?? null,

        };
        return this.updateBaseSearchFilters(request, filters);
    }

}
