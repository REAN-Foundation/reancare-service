import express from 'express';
import { body, param, validationResult, query } from 'express-validator';

import { Helper } from '../../common/helper';
import { UserTaskDomainModel } from '../../domain.types/user/user.task/user.task.domain.model';
import { UserTaskSearchFilters } from '../../domain.types/user/user.task/user.task.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class UserTaskValidator {

    static getDomainModel = (request: express.Request): UserTaskDomainModel => {

        const userTaskModel: UserTaskDomainModel = {
            DisplayId            : request.body.DisplayId ?? null,
            UserId               : request.body.UserId ?? null,
            UserRole             : request.body.UserRole ?? null,
            TaskName             : request.body.TaskName ?? null,
            Category             : request.body.Category ?? null,
            Action               : request.body.Action ?? null,
            ScheduledStartTime   : request.body.ScheduledStartTime ?? null,
            ScheduledEndTime     : request.body.ScheduledEndTime ?? null,
            Started              : request.body.Started ?? null,
            StartedAt            : request.body.StartedAt ?? null,
            Finished             : request.body.Finished ?? null,
            FinishedAt           : request.body.FinishedAt ?? null,
            TaskIsSuccess        : request.body.TaskIsSuccess ?? null,
            Cancelled            : request.body.Cancelled ?? null,
            CancelledAt          : request.body.CancelledAt ?? null,
            CancellationReason   : request.body.CancellationReason ?? null,
            IsRecurrent          : request.body.IsRecurrent ?? null,
            RecurrenceScheduleId : request.body.RecurrenceScheduleId ?? null
        };

        return userTaskModel;
    };

    static create = async (request: express.Request): Promise<UserTaskDomainModel> => {
        await UserTaskValidator.validateBody(request);
        return UserTaskValidator.getDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await UserTaskValidator.getParamId(request);
    };
    
    static getByOrganizationId = async (request: express.Request): Promise<string> => {

        await param('organizationId').trim()
            .escape()
            .isUUID()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        
        return request.params.organizationId;
    };
    
    static getByPersonId = async (request: express.Request): Promise<string> => {

        await param('personId').trim()
            .escape()
            .isUUID()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        
        return request.params.personId;
    };

    static delete = async (request: express.Request): Promise<string> => {
        return await UserTaskValidator.getParamId(request);
    };

    static search = async (request: express.Request): Promise<UserTaskSearchFilters> => {

        await query('userId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('userRole').optional()
            .trim()
            .escape()
            .run(request);

        await query('name').optional()
            .trim()
            .escape()
            .run(request);

        await query('categoryId').optional()
            .trim()
            .run(request);

        await query('actionType').optional()
            .trim()
            .escape()
            .run(request);

        await query('referenceItemId').optional()
            .trim()
            .escape()
            .run(request);

        await query('scheduledStartTimeFrom').optional()
            .trim()
            .escape()
            .toDate()
            .run(request);

        await query('scheduledStartTimeTo').optional()
            .trim()
            .escape()
            .toDate()
            .run(request);

        await query('scheduledEndTimeFrom').optional()
            .trim()
            .escape()
            .toDate()
            .run(request);

        await query('scheduledEndTimeTo').optional()
            .trim()
            .escape()
            .toDate()
            .run(request);

        await query('Started').optional()
            .trim()
            .escape()
            .isBoolean()
            .run(request);

        await query('finished').optional()
            .trim()
            .escape()
            .isBoolean()
            .run(request);

        await query('Cancelled').optional()
            .trim()
            .escape()
            .isBoolean()
            .run(request);

        await query('createdDateFrom').optional()
            .trim()
            .escape()
            .toDate()
            .run(request);

        await query('createdDateTo').optional()
            .trim()
            .escape()
            .toDate()
            .run(request);

        await query('orderBy').optional()
            .trim()
            .escape()
            .run(request);

        await query('order').optional()
            .trim()
            .escape()
            .run(request);

        await query('pageIndex').optional()
            .trim()
            .escape()
            .isInt()
            .run(request);

        await query('itemsPerPage').optional()
            .trim()
            .escape()
            .isInt()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        return UserTaskValidator.getFilter(request);
    };

    static update = async (request: express.Request): Promise<UserTaskDomainModel> => {

        const id = await UserTaskValidator.getParamId(request);
        await UserTaskValidator.validateBody(request);

        const domainModel = UserTaskValidator.getDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

    static startTask = async (request: express.Request): Promise<string> => {

        return await UserTaskValidator.getParamId(request);
    };

    static finishTask = async (request: express.Request): Promise<string> => {

        return await UserTaskValidator.getParamId(request);
    };

    static getTasksForTodaySummary = async (request: express.Request): Promise<string> => {

        return await UserTaskValidator.getParamPatientUserId(request);
    };

    private static async validateBody(request) {

        await body('DisplayId').optional()
            .trim()
            .escape()
            .run(request);

        await body('UserId').optional()
            .trim()
            .isUUID()
            .escape()
            .run(request);

        await body('UserRole').optional()
            .trim()
            .escape()
            .run(request);

        await body('TaskName').optional()
            .trim()
            .escape()
            .run(request);

        await body('Category').optional()
            .trim()
            .escape()
            .run(request);

        await body('Action').optional()
            .trim()
            .escape()
            .run(request);

        await body('ScheduledStartTime').optional()
            .trim()
            .escape()
            .run(request);

        await body('ScheduledEndTime').optional()
            .trim()
            .escape()
            .run(request);
            
        await body('Started').optional()
            .trim()
            .escape()
            .run(request);
            
        await body('StartedAt').optional()
            .trim()
            .escape()
            .run(request);
            
        await body('Finished').optional()
            .trim()
            .escape()
            .run(request);
            
        await body('FinishedAt').optional()
            .trim()
            .escape()
            .run(request);
            
        await body('TaskIsSuccess').optional()
            .trim()
            .escape()
            .run(request);
            
        await body('Cancelled').optional()
            .trim()
            .escape()
            .run(request);
            
        await body('CancelledAt').optional()
            .trim()
            .escape()
            .run(request);
            
        await body('CancellationReason').optional()
            .trim()
            .escape()
            .run(request);
            
        await body('IsRecurrent').optional()
            .trim()
            .escape()
            .run(request);
            
        await body('RecurrenceScheduleId').optional()
            .trim()
            .escape()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
    }

    private static getFilter(request): UserTaskSearchFilters {
        const pageIndex = request.query.pageIndex !== 'undefined' ? parseInt(request.query.pageIndex as string, 10) : 0;

        const itemsPerPage =
            request.query.itemsPerPage !== 'undefined' ? parseInt(request.query.itemsPerPage as string, 10) : 25;

        const filters: UserTaskSearchFilters = {
            UserId                 : request.query.userId,
            UserRole               : request.query.userRole,
            Name                   : request.query.name,
            CategoryId             : request.query.categoryId,
            ActionType             : request.query.actionType,
            ReferenceItemId        : request.query.referenceItemId,
            ScheduledStartTimeFrom : request.query.scheduledStartTimeFrom,
            ScheduledStartTimeTo   : request.query.scheduledStartTimeTo,
            ScheduledEndTimeFrom   : request.query.scheduledEndTimeFrom,
            ScheduledEndTimeTo     : request.query.scheduledEndTimeTo,
            Started                : request.query.started,
            Finished               : request.query.finished,
            Cancelled              : request.query.cancelled,
            CreatedDateFrom        : request.query.createdDateFrom,
            CreatedDateTo          : request.query.createdDateTo,
            OrderBy                : request.query.orderBy ?? 'CreatedAt',
            Order                  : request.query.order ?? 'descending',
            PageIndex              : pageIndex,
            ItemsPerPage           : itemsPerPage,
        };
        return filters;
    }

    private static async getParamId(request) {

        await param('id').trim()
            .escape()
            .isUUID()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        return request.params.id;
    }

    private static async getParamPatientUserId(request) {

        await param('patientUserId').trim()
            .escape()
            .isUUID()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        return request.params.patientUserId;
    }

}
