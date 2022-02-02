import express from 'express';
import { ActionPlanDomainModel } from '../../../domain.types/goal.action.plan/goal.action.plan.domain.model';
import { BaseValidator, Where } from '../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class ActionPlanValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): ActionPlanDomainModel => {
 
        const ActionPlanDomainModel: ActionPlanDomainModel = {
            PatientUserId        : request.body.PatientUserId,
            Provider             : request.body.Provider ?? null,
            ProviderEnrollmentId : request.body.ProviderEnrollmentId,
            ProviderCareplanCode : request.body.ProviderCareplanCode ?? null,
            ProviderCareplanName : request.body.ProviderCareplanName ?? null,
            GoalId               : request.body.GoalId ?? null,
            Title                : request.body.Title ?? null,
            StartedAt            : request.body.StartedAt ?? new Date(),
            ScheduledEndDate     : request.body.ScheduledEndDate,
        };
 
        return ActionPlanDomainModel;
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
        await this.validateDate(request, 'StartedAt', Where.Body, false, true);
        await this.validateDate(request, 'ScheduledEndDate', Where.Body, false, true);

        this.validateRequest(request);
    }

    getActionPlans = async (request: express.Request): Promise<ActionPlanDomainModel> => {

        await this.validateUuid(request, 'goalId', Where.Param, true, false);
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

    private getFilter(request): ActionPlanDomainModel {

        const filters: ActionPlanDomainModel = {
            GoalId               : request.params.goalId ?? null,
            PatientUserId        : request.params.patientUserId ?? null,
            ProviderEnrollmentId : request.query.providerEnrollmentId ?? null,
            Provider             : request.query.provider ?? null,
            ProviderCareplanName : request.query.providerCareplanName ?? null,
            ProviderCareplanCode : request.query.providerCareplanCode ?? null,

        };
        return this.updateBaseSearchFilters(request, filters);
    }

}
