import express from 'express';
import { AnalyticsHandler } from '../../../../modules/analytics/analytics.handler';
import { Logger } from '../../../../common/logger';
import { GoalDto } from '../../../../domain.types/users/patient/goal/goal.dto';
import { AnalyticsEvent, AnalyticsEventCategory, AnalyticsEventSubject, AnalyticsEventType } from '../../../../modules/analytics/analytics.types';

///////////////////////////////////////////////////////////////////////////////////////

export class GoalEvents {

    static async onGoalStart(request: express.Request, goal: GoalDto) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = request.currentUser?.UserId ?? null;
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' has started goal.`;
            const eventName = AnalyticsEventType.GoalCreate;
            const eventCategory = AnalyticsEventCategory.Goals;
            const eventSubject = AnalyticsEventSubject.Goal;
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : goal.id,
                ResourceType    : 'goals',
                SourceName      : sourceName,
                SourceVersion   : null,
                EventName       : eventName,
                EventSubject    : eventSubject,
                EventCategory   : eventCategory,
                ActionType      : 'user-action',
                ActionStatement : message,
                Timestamp       : new Date(),
                Attributes      : {
                    ...goal
                }
            };
            AnalyticsHandler.pushEvent(event);
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    }

    static async onGoalComplete(request: express.Request, goal: GoalDto) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = request.currentUser?.UserId ?? null;
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' has completed goal.`;
            const eventName = AnalyticsEventType.GoalComplete;
            const eventCategory = AnalyticsEventCategory.Goals;
            const eventSubject = AnalyticsEventSubject.Goal;
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : goal.id,
                ResourceType    : 'goals',
                SourceName      : sourceName,
                SourceVersion   : null,
                EventName       : eventName,
                EventSubject    : eventSubject,
                EventCategory   : eventCategory,
                ActionType      : 'user-action',
                ActionStatement : message,
                Timestamp       : new Date(),
                Attributes      : {
                    ...goal
                }
            };
            AnalyticsHandler.pushEvent(event);
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    }

    static async onGoalCancel(request: express.Request, goal: GoalDto) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = request.currentUser?.UserId ?? null;
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' has cancelled goal '${goal.id}'.`;
            const eventName = AnalyticsEventType.GoalCancel;
            const eventCategory = AnalyticsEventCategory.Goals;
            const eventSubject = AnalyticsEventSubject.Goal;
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : goal.id,
                ResourceType    : 'goals',
                SourceName      : sourceName,
                SourceVersion   : null,
                EventName       : eventName,
                EventSubject    : eventSubject,
                EventCategory   : eventCategory,
                ActionType      : 'user-action',
                ActionStatement : message,
                Timestamp       : new Date(),
                Attributes      : {
                    ...goal
                }
            };
            AnalyticsHandler.pushEvent(event);
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    }

    static async onGoalUpdate(request: express.Request, goal: GoalDto) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = request.currentUser?.UserId ?? null;
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' has updated exercise '${goal.id}'.`;
            const eventName = AnalyticsEventType.GoalUpdate;
            const eventCategory = AnalyticsEventCategory.Goals;
            const eventSubject = AnalyticsEventSubject.Goal;
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : goal.id,
                ResourceType    : 'goals',
                SourceName      : sourceName,
                SourceVersion   : null,
                EventName       : eventName,
                EventSubject    : eventSubject,
                EventCategory   : eventCategory,
                ActionType      : 'user-action',
                ActionStatement : message,
                Timestamp       : new Date(),
                Attributes      : {
                    ...goal
                }
            };
            AnalyticsHandler.pushEvent(event);
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    }

}
