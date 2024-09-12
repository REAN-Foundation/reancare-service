import express from 'express';
import { AnalyticsEvent, AnalyticsEventCategory, AnalyticsEventSubject, AnalyticsEventType } from '../../../modules/analytics/analytics.types';
import { AnalyticsHandler } from '../../../modules/analytics/analytics.handler';
import { Logger } from '../../../common/logger';
import { UserTaskDto } from '../../../domain.types/users/user.task/user.task.dto';

///////////////////////////////////////////////////////////////////////////////////////

export class UserTaskEvents {

    static async onUserTaskStarted(request: express.Request, task: UserTaskDto) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = task.UserId ?? (request.currentUser?.UserId ?? null);
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' has started task '${task.id}'.`;
            const eventName = AnalyticsEventType.UserTaskStart;
            const eventCategory = AnalyticsEventCategory.UserTask;
            const eventSubject = AnalyticsEventSubject.UserTask;
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : task.id,
                ResourceType    : 'user-task',
                SourceName      : sourceName,
                SourceVersion   : null,
                EventName       : eventName,
                EventSubject    : eventSubject,
                EventCategory   : eventCategory,
                ActionType      : 'user-action',
                ActionStatement : message,
                Timestamp       : new Date(),
                Attributes      : {
                    TaskName           : task.Task,
                    TaskType           : task.Category,
                    Channel            : task.Channel,
                    ScheduledStartTime : task.ScheduledStartTime,
                    ScheduledEndTime   : task.ScheduledEndTime,
                }
            };
            AnalyticsHandler.pushEvent(event);
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    }

    static async onUserTaskCompleted(request: express.Request, task: UserTaskDto) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = task.UserId ?? (request.currentUser?.UserId ?? null);
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' has completed task '${task.id}'.`;
            const eventName = AnalyticsEventType.UserTaskComplete;
            const eventCategory = AnalyticsEventCategory.UserTask;
            const eventSubject = AnalyticsEventSubject.UserTask;
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : task.id,
                ResourceType    : 'user-task',
                SourceName      : sourceName,
                SourceVersion   : null,
                EventName       : eventName,
                EventSubject    : eventSubject,
                EventCategory   : eventCategory,
                ActionType      : 'user-action',
                ActionStatement : message,
                Timestamp       : new Date(),
                Attributes      : {
                    TaskName           : task.Task,
                    TaskType           : task.Category,
                    Channel            : task.Channel,
                    ScheduledStartTime : task.ScheduledStartTime,
                    ScheduledEndTime   : task.ScheduledEndTime,
                }
            };
            AnalyticsHandler.pushEvent(event);
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    }

    static async onUserTaskCancelled(request: express.Request, task: UserTaskDto) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = task.UserId ?? (request.currentUser?.UserId ?? null);
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' has cancelled task '${task.id}'.`;
            const eventName = AnalyticsEventType.UserTaskCancel;
            const eventCategory = AnalyticsEventCategory.UserTask;
            const eventSubject = AnalyticsEventSubject.UserTask;
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : task.id,
                ResourceType    : 'user-task',
                SourceName      : sourceName,
                SourceVersion   : null,
                EventName       : eventName,
                EventSubject    : eventSubject,
                EventCategory   : eventCategory,
                ActionType      : 'user-action',
                ActionStatement : message,
                Timestamp       : new Date(),
                Attributes      : {
                    TaskName           : task.Task,
                    TaskType           : task.Category,
                    Channel            : task.Channel,
                    ScheduledStartTime : task.ScheduledStartTime,
                    ScheduledEndTime   : task.ScheduledEndTime,
                }
            };
            AnalyticsHandler.pushEvent(event);
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    }

    static async onUserTaskUpdated(request: express.Request, task: UserTaskDto) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = task.UserId ?? (request.currentUser?.UserId ?? null);
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' has updated task '${task.id}'.`;
            const eventName = AnalyticsEventType.UserTaskUpdate;
            const eventCategory = AnalyticsEventCategory.UserTask;
            const eventSubject = AnalyticsEventSubject.UserTask;
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : task.id,
                ResourceType    : 'user-task',
                SourceName      : sourceName,
                SourceVersion   : null,
                EventName       : eventName,
                EventSubject    : eventSubject,
                EventCategory   : eventCategory,
                ActionType      : 'user-action',
                ActionStatement : message,
                Timestamp       : new Date(),
                Attributes      : {
                    TaskName           : task.Task,
                    TaskType           : task.Category,
                    Channel            : task.Channel,
                    ScheduledStartTime : task.ScheduledStartTime,
                    ScheduledEndTime   : task.ScheduledEndTime,
                }
            };
            AnalyticsHandler.pushEvent(event);
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    }

}
