import express from 'express';
import { UserTaskDomainModel } from '../../../domain.types/user/user.task/user.task.domain.model';
import { UserTaskSearchFilters } from '../../../domain.types/user/user.task/user.task.search.types';
import { BaseValidator, Where } from '../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class UserTaskValidator extends BaseValidator{

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
        await this.validateDate(request, 'scheduledFrom', Where.Query, false, false);
        await this.validateDate(request, 'scheduledTo', Where.Query, false, false);
        await this.validateBoolean(request, 'started', Where.Query, false, false);
        await this.validateBoolean(request, 'finished', Where.Query, false, false);
        await this.validateBoolean(request, 'cancelled', Where.Query, false, false);
        await this.validateCommonSearchFilters(request);
        
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

     cancelTask = async (request: express.Request): Promise<any> => {
         const id: string = await this.getParamUuid(request, 'id');
         await this.validateString(request, 'Reason', Where.Body, false, false);
         this.validateRequest(request);
         var reason = request.body.Reason ?? null;
         return { id, reason };
     }

     getTaskSummaryForDay = async (request: express.Request): Promise<any> => {
         const id: string = await this.getParamUuid(request, 'userId');
         await this.validateDateString(request, 'date', Where.Param, false, false);
         this.validateRequest(request);
         var dateStr = request.params.date;
         var todayStr = new Date()
             .toISOString()
             .split('T')[0];
         var date = request.params.date ? dateStr.split('T')[0] : todayStr;
         return { id, date };
     };

     private  async validateCreateBody(request) {

         await this.validateUuid(request, 'UserId', Where.Body, true, false);
         await this.validateString(request, 'Task', Where.Body, true, false, true);
         await this.validateString(request, 'Category', Where.Body, true, false);
         await this.validateString(request, 'ActionType', Where.Body, false, false);
         await this.validateUuid(request, 'ActionId', Where.Body, false, true);
         await this.validateString(request, 'ActionType', Where.Body, false, true);
         await this.validateDateString(request, 'ScheduledStartTime', Where.Body, true, false);
         await this.validateDateString(request, 'ScheduledEndTime', Where.Body, false, false);
         await this.validateBoolean(request, 'IsRecurrent', Where.Body, false, true);
         await this.validateUuid(request, 'RecurrenceScheduleId', Where.Body, false, true);

         this.validateRequest(request);
     }
     
     private  async validateUpdateBody(request) {

         await this.validateString(request, 'Task', Where.Body, false, false, true);
         await this.validateString(request, 'Category', Where.Body, false, false);
         await this.validateString(request, 'ActionType', Where.Body, false, false);
         await this.validateUuid(request, 'ActionId', Where.Body, false, true);
         await this.validateString(request, 'ActionType', Where.Body, false, true);
         await this.validateDateString(request, 'ScheduledStartTime', Where.Body, false, false);
         await this.validateDateString(request, 'ScheduledEndTime', Where.Body, false, false);
         await this.validateBoolean(request, 'IsRecurrent', Where.Body, false, true);
         await this.validateUuid(request, 'RecurrenceScheduleId', Where.Body, false, true);

         this.validateRequest(request);
     }

     private  getFilter(request): UserTaskSearchFilters {

         const filters: UserTaskSearchFilters = {
             UserId          : request.query.userId,
             Task            : request.query.Task,
             Category        : request.query.category,
             ActionType      : request.query.actionType,
             ActionId        : request.query.actionId,
             ScheduledFrom   : request.query.scheduledFrom,
             ScheduledTo     : request.query.scheduledTo,
             Started         : request.query.started,
             Finished        : request.query.finished,
             Cancelled       : request.query.cancelled,
             CreatedDateFrom : request.query.createdDateFrom,
             CreatedDateTo   : request.query.createdDateTo
         };
         
         return this.updateCommonSearchFilters(request, filters);

     }

}
