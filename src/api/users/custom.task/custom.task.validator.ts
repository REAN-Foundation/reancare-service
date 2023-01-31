import express from 'express';
import { UserActionType } from '../../../domain.types/users/user.task/user.task.types';
import { CustomTaskDomainModel } from '../../../domain.types/users/custom.task/custom.task.domain.model';
import { BaseValidator, Where } from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class CustomTaskValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): CustomTaskDomainModel => {

        const model: CustomTaskDomainModel = {
            UserId               : request.body.UserId ?? null,
            Task                 : request.body.Task ?? null,
            Description          : request.body.Description ?? null,
            Category             : request.body.Category ?? null,
            ActionType           : UserActionType.Custom,
            Details              : request.body.Details,
            ScheduledStartTime   : request.body.ScheduledStartTime ?? null,
            ScheduledEndTime     : request.body.ScheduledEndTime ?? null,
            IsRecurrent          : request.body.IsRecurrent ?? null,
            RecurrenceScheduleId : request.body.RecurrenceScheduleId ?? null
        };

        return model;
    };

    create = async (request: express.Request): Promise<CustomTaskDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    update = async (request: express.Request): Promise<CustomTaskDomainModel> => {
        await this.validateUpdateBody(request);
        var domainModel = this.getDomainModel(request);
        const id = await this.getParamUuid(request, 'id');
        domainModel.id = id;
        return domainModel;
    };

    private async validateCreateBody(request) {

        await this.validateUuid(request, 'UserId', Where.Body, true, false);
        await this.validateString(request, 'Task', Where.Body, true, false, true);
        await this.validateString(request, 'Description', Where.Body, false, false, true);
        await this.validateString(request, 'Category', Where.Body, true, false);
        await this.validateObject(request, 'Details', Where.Body, true, false);
        await this.validateDate(request, 'ScheduledStartTime', Where.Body, true, false);
        await this.validateDate(request, 'ScheduledEndTime', Where.Body, false, false);
        await this.validateBoolean(request, 'IsRecurrent', Where.Body, false, true);
        await this.validateUuid(request, 'RecurrenceScheduleId', Where.Body, false, true);

        this.validateRequest(request);
    }

    private async validateUpdateBody(request) {

        await this.validateString(request, 'Task', Where.Body, false, false, true);
        await this.validateString(request, 'Description', Where.Body, false, false, true);
        await this.validateString(request, 'Category', Where.Body, false, false);
        await this.validateObject(request, 'Details', Where.Body, false, false);
        await this.validateDate(request, 'ScheduledStartTime', Where.Body, false, false);
        await this.validateDate(request, 'ScheduledEndTime', Where.Body, false, false);
        await this.validateBoolean(request, 'IsRecurrent', Where.Body, false, true);
        await this.validateUuid(request, 'RecurrenceScheduleId', Where.Body, false, true);

        this.validateRequest(request);
    }

}
