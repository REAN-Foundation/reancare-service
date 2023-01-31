import express from 'express';
import { TimeHelper } from '../../../common/time.helper';
import { ProgressStatus, uuid } from '../../../domain.types/miscellaneous/system.types';
import { DurationType } from '../../../domain.types/miscellaneous/time.types';
import { UserTaskDomainModel } from '../../../domain.types/users/user.task/user.task.domain.model';
import { UserTaskSearchFilters } from '../../../domain.types/users/user.task/user.task.search.types';
import { UserService } from '../../../services/users/user/user.service';
import { Loader } from '../../../startup/loader';
import { BaseValidator, Where } from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class UserTaskValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): UserTaskDomainModel => {

        const model: UserTaskDomainModel = {
            UserId               : request.body.UserId ?? null,
            Task                 : request.body.Task ?? null,
            Description          : request.body.Description ?? null,
            Category             : request.body.Category ?? null,
            ActionType           : request.body.ActionType ?? null,
            ActionId             : request.body.ActionId ?? null,
            ScheduledStartTime   : request.body.ScheduledStartTime ?? null,
            ScheduledEndTime     : request.body.ScheduledEndTime ?? null,
            IsRecurrent          : request.body.IsRecurrent ?? null,
            RecurrenceScheduleId : request.body.RecurrenceScheduleId ?? null
        };

        return model;
    };

    create = async (request: express.Request): Promise<UserTaskDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<UserTaskSearchFilters> => {

        await this.validateUuid(request, 'userId', Where.Query, false, false);
        await this.validateString(request, 'task', Where.Query, false, false, true);
        await this.validateString(request, 'category', Where.Query, false, false, true);
        await this.validateString(request, 'actionType', Where.Query, false, false, true);
        await this.validateUuid(request, 'actionId', Where.Query, false, false);
        await this.validateString(request, 'scheduledFrom', Where.Query, false, false);
        await this.validateString(request, 'scheduledTo', Where.Query, false, false);
        await this.validateString(request, 'status', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<UserTaskDomainModel> => {
        await this.validateUpdateBody(request);
        var domainModel = this.getDomainModel(request);
        const id = await this.getParamUuid(request, 'id');
        domainModel.id = id;
        return domainModel;
    };

    finishTask = async (request: express.Request): Promise<any> => {

        const id: string = await this.getParamUuid(request, 'id');
        await this.validateDate(request, 'FinishedAt', Where.Body, false, false);
        await this.validateString(request, 'UserResponse', Where.Body, false, false);
        await this.validateArray(request, 'Items', Where.Body, false, false);
        this.validateRequest(request);

        var finishedAt = request.body.FinishedAt ?? null;
        var userResponse = request.body.UserResponse ?? null;
        return { id, finishedAt, userResponse };
    };

    cancelTask = async (request: express.Request): Promise<any> => {
        const id: string = await this.getParamUuid(request, 'id');
        await this.validateString(request, 'Reason', Where.Body, false, false);
        this.validateRequest(request);
        var reason = request.body.Reason ?? null;
        return { id, reason };
    };

    getTaskSummaryForDay = async (request: express.Request): Promise<any> => {
        const userId: string = await this.getParamUuid(request, 'userId');
        await this.validateDateString(request, 'date', Where.Param, false, false);
        this.validateRequest(request);
        var dateStr = request.params.date;
        var todayStr = new Date()
            .toISOString()
            .split('T')[0];
        var date = request.params.date ? dateStr.split('T')[0] : todayStr;
        return { userId, date };
    };

    private async validateCreateBody(request) {

        await this.validateUuid(request, 'UserId', Where.Body, true, false);
        await this.validateString(request, 'Task', Where.Body, true, false, true);
        await this.validateString(request, 'Category', Where.Body, true, false);
        await this.validateString(request, 'ActionType', Where.Body, false, false);
        await this.validateUuid(request, 'ActionId', Where.Body, false, true);
        await this.validateString(request, 'ActionType', Where.Body, false, true);
        await this.validateDate(request, 'ScheduledStartTime', Where.Body, true, false);
        await this.validateDate(request, 'ScheduledEndTime', Where.Body, false, false);
        await this.validateBoolean(request, 'IsRecurrent', Where.Body, false, true);
        await this.validateUuid(request, 'RecurrenceScheduleId', Where.Body, false, true);

        this.validateRequest(request);
    }

    private async validateUpdateBody(request) {

        await this.validateString(request, 'Task', Where.Body, false, false, true);
        await this.validateString(request, 'Category', Where.Body, false, false);
        await this.validateString(request, 'ActionType', Where.Body, false, false);
        await this.validateUuid(request, 'ActionId', Where.Body, false, true);
        await this.validateString(request, 'ActionType', Where.Body, false, true);
        await this.validateDate(request, 'ScheduledStartTime', Where.Body, false, false);
        await this.validateDate(request, 'ScheduledEndTime', Where.Body, false, false);
        await this.validateBoolean(request, 'IsRecurrent', Where.Body, false, true);
        await this.validateUuid(request, 'RecurrenceScheduleId', Where.Body, false, true);

        this.validateRequest(request);
    }

    private async getFilter(request: express.Request): Promise<UserTaskSearchFilters> {

        var status: ProgressStatus = null;

        if (request.query.status) {
            var statusStr: string = request.query.status.toString().toLowerCase();
            if (statusStr === 'inProgress') {
                status = ProgressStatus.InProgress;
            }
            if (statusStr === 'pending' || statusStr === 'upcoming') {
                status = ProgressStatus.Pending;
            }
            if (statusStr === 'completed' || statusStr === 'finished') {
                status = ProgressStatus.Completed;
            }
            if (statusStr === 'delayed' || statusStr === 'overdue') {
                status = ProgressStatus.Delayed;
            }
            if (statusStr === 'cancelled') {
                status = ProgressStatus.Cancelled;
            }
        }

        var userId = request.currentUser.UserId;
        if (request.query.userId !== undefined) {
            userId = request.query.userId as uuid;
        }

        var userService = Loader.container.resolve(UserService);

        var scheduledFrom: Date = null;
        if (request.query.scheduledFrom) {
            const scheduledFromStr : string = request.query.scheduledFrom as string;
            scheduledFrom = await userService.getDateInUserTimeZone(userId, scheduledFromStr);
        }
        var scheduledTo: Date = null;
        if (request.query.scheduledTo) {
            const scheduledToStr : string = request.query.scheduledTo as string;
            scheduledTo = await userService.getDateInUserTimeZone(userId, scheduledToStr);
            scheduledTo = TimeHelper.addDuration(scheduledTo, 24, DurationType.Hour);
        }

        var filters: UserTaskSearchFilters = {
            UserId        : userId,
            Task          : request.query.task as string ?? null,
            Category      : request.query.category as string ?? null,
            ActionType    : request.query.actionType as string ?? null,
            ActionId      : request.query.actionId as uuid ?? null,
            ScheduledFrom : scheduledFrom,
            ScheduledTo   : scheduledTo,
            Status        : status,
        };

        return this.updateBaseSearchFilters(request, filters);

    }

}
