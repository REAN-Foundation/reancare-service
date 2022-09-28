import express from 'express';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { GoalDomainModel } from '../../../../domain.types/users/patient/goal/goal.domain.model';
import { GoalSearchFilters } from '../../../../domain.types/users/patient/goal/goal.search.types';
import { BaseValidator, Where } from '../../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class GoalValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): GoalDomainModel => {

        const GoalModel: GoalDomainModel = {
            PatientUserId        : request.body.PatientUserId,
            Provider             : request.body.Provider ?? null,
            ProviderCareplanCode : request.body.ProviderCareplanCode ?? null,
            ProviderCareplanName : request.body.ProviderCareplanName ?? null,
            ProviderEnrollmentId : request.body.ProviderEnrollmentId ?? null,
            ProviderGoalCode     : request.body.ProviderGoalCode ?? null,
            Title                : request.body.Title ?? null,
            Sequence             : request.body.Sequence ?? null,
            HealthPriorityId     : request.body.HealthPriorityId ?? null,
            GoalAchieved         : request.body.GoalAchieved ?? null,
            GoalAbandoned        : request.body.GoalAbandoned ?? null,
            StartedAt            : request.body.StartedAt ?? new Date(),
            CompletedAt          : request.body.CompletedAt ?? null,
            ScheduledEndDate     : request.body.ScheduledEndDate,
        };

        return GoalModel;
    };

    create = async (request: express.Request): Promise<GoalDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    getParamUuid = async(request: express.Request, field: string): Promise<uuid> => {
        this.validateUuid(request, field, Where.Param, true, false);
        this.validateRequest(request);
        return request.params[field];
    };

    search = async (request: express.Request): Promise<GoalSearchFilters> => {

        await this.validateUuid(request, 'patientUserId', Where.Query, false, false);
        await this.validateString(request, 'provider', Where.Query, false, false);
        await this.validateString(request, 'providerEnrollmentId', Where.Query, false, false);
        await this.validateString(request, 'providerCareplanName', Where.Query, false, false);
        await this.validateString(request, 'providerCareplanCode', Where.Query, false, false);
        await this.validateString(request, 'providerGoalCode', Where.Query, false, false);
        await this.validateString(request, 'title', Where.Query, false, false);
        await this.validateString(request, 'sequence', Where.Query, false, false);
        await this.validateString(request, 'categoryCode', Where.Query, false, false);
        await this.validateString(request, 'healthPriorityId', Where.Query, false, false);
        await this.validateBoolean(request, 'goalAchieved', Where.Query, false, false);
        await this.validateBoolean(request, 'goalAbandoned', Where.Query, false, false);
        await this.validateDate(request, 'startedAt', Where.Query, false, false);
        await this.validateDate(request, 'scheduledEndDate', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<GoalDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private  async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateString(request, 'Provider', Where.Body, false, true);
        await this.validateString(request, 'ProviderCareplanCode', Where.Body, false, true);
        await this.validateString(request, 'ProviderCareplanName', Where.Body, false, true);
        await this.validateString(request, 'ProviderEnrollmentId', Where.Body, false, true);
        await this.validateString(request, 'ProviderGoalCode', Where.Body, false, true);
        await this.validateString(request, 'Title', Where.Body, true, false);
        await this.validateString(request, 'Sequence', Where.Body, false, true);
        await this.validateString(request, 'HealthPriorityId', Where.Body, false, true);
        await this.validateBoolean(request, 'GoalAchieved', Where.Body, false, true);
        await this.validateBoolean(request, 'GoalAbandoned', Where.Body, false, true);
        await this.validateDate(request, 'StartedAt', Where.Body, false, true);
        await this.validateDate(request, 'CompletedAt', Where.Body, false, true);
        await this.validateDate(request, 'ScheduledEndDate', Where.Body, false, true);

        this.validateRequest(request);
    }

    private  async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateString(request, 'Provider', Where.Body, false, false);
        await this.validateString(request, 'ProviderCareplanCode', Where.Body, false, false);
        await this.validateString(request, 'ProviderCareplanName', Where.Body, false, false);
        await this.validateString(request, 'ProviderEnrollmentId', Where.Body, false, false);
        await this.validateString(request, 'ProviderGoalCode', Where.Body, false, false);
        await this.validateString(request, 'Title', Where.Body, false, false);
        await this.validateString(request, 'Sequence', Where.Body, false, false);
        await this.validateString(request, 'HealthPriorityId', Where.Body, false, false);
        await this.validateBoolean(request, 'GoalAchieved', Where.Body, false, false);
        await this.validateBoolean(request, 'GoalAbandoned', Where.Body, false, false);
        await this.validateDate(request, 'StartedAt', Where.Body, false, false);
        await this.validateDate(request, 'CompletedAt', Where.Body, false, false);
        await this.validateDate(request, 'ScheduledEndDate', Where.Body, false, false);

        this.validateRequest(request);
    }

    private getFilter(request): GoalSearchFilters {

        var filters: GoalSearchFilters = {
            PatientUserId        : request.query.patientUserId ?? null,
            Provider             : request.query.provider ?? null,
            ProviderEnrollmentId : request.query.providerEnrollmentId ?? null,
            ProviderCareplanName : request.query.providerCareplanName ?? null,
            ProviderCareplanCode : request.query.ProviderCareplanCode ?? null,
            ProviderGoalCode     : request.query.providerGoalCode ?? null,
            Title                : request.query.title ?? null,
            Sequence             : request.query.sequence ?? null,
            CategoryCode         : request.query.categoryCode ?? null,
            HealthPriorityId     : request.query.healthPriorityId ?? null,
            GoalAchieved         : request.query.goalAchieved ?? null,
            GoalAbandoned        : request.query.goalAbandoned ?? null,
            StartedAt            : request.query.startedAt ?? null,
            ScheduledEndDate     : request.query.scheduledEndDate ?? null,

        };

        return this.updateBaseSearchFilters(request, filters);
    }

}
