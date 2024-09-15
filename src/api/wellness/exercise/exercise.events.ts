import express from 'express';
import { AnalyticsEvent, AnalyticsEventCategory, AnalyticsEventSubject, AnalyticsEventType } from '../../../modules/analytics/analytics.types';
import { MeditationDto } from '../../../domain.types/wellness/exercise/meditation/meditation.dto';
import { AnalyticsHandler } from '../../../modules/analytics/analytics.handler';
import { Logger } from '../../../common/logger';
import { PhysicalActivityDto } from '../../../domain.types/wellness/exercise/physical.activity/physical.activity.dto';

export class ExerciseEvent {

    static async onExerciseStart(request: express.Request, exerciseDto: MeditationDto | PhysicalActivityDto) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = request.currentUser?.UserId ?? null;
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' started exercise '${exerciseDto.id}'.`;
            const eventName = AnalyticsEventType.ExerciseStart;
            const eventCategory = AnalyticsEventCategory.Exercise;
            const eventSubject = AnalyticsEventSubject.Exercise;
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : exerciseDto.id,
                ResourceType    : 'exercise',
                SourceName      : sourceName,
                SourceVersion   : null,
                EventName       : eventName,
                EventSubject    : eventSubject,
                EventCategory   : eventCategory,
                ActionType      : 'user-action',
                ActionStatement : message,
                Timestamp       : new Date(),
                Attributes      : {
                    ...exerciseDto
                }
            };
            AnalyticsHandler.pushEvent(event);

        } catch (error) {
            Logger.instance().log(error.message);
        }
    }

    static async onExerciseComplete(request: express.Request, exerciseDto: MeditationDto | PhysicalActivityDto) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = request.currentUser?.UserId ?? null;
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' completed exercise '${exerciseDto.id}'.`;
            const eventName = AnalyticsEventType.ExerciseComplete;
            const eventCategory = AnalyticsEventCategory.Exercise;
            const eventSubject = AnalyticsEventSubject.Exercise;
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : exerciseDto.id,
                ResourceType    : 'exercise',
                SourceName      : sourceName,
                SourceVersion   : null,
                EventName       : eventName,
                EventSubject    : eventSubject,
                EventCategory   : eventCategory,
                ActionType      : 'user-action',
                ActionStatement : message,
                Timestamp       : new Date(),
                Attributes      : {
                    ...exerciseDto
                }
            };
            AnalyticsHandler.pushEvent(event);

        } catch (error) {
            Logger.instance().log(error.message);
        }
    }

    static async onExerciseCancel(request: express.Request, exerciseDto: MeditationDto | PhysicalActivityDto) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = request.currentUser?.UserId ?? null;
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' cancelled exercise '${exerciseDto.id}'.`;
            const eventName = AnalyticsEventType.ExerciseCancel;
            const eventCategory = AnalyticsEventCategory.Exercise;
            const eventSubject = AnalyticsEventSubject.Exercise;
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : exerciseDto.id,
                ResourceType    : 'exercise',
                SourceName      : sourceName,
                SourceVersion   : null,
                EventName       : eventName,
                EventSubject    : eventSubject,
                EventCategory   : eventCategory,
                ActionType      : 'user-action',
                ActionStatement : message,
                Timestamp       : new Date(),
                Attributes      : {
                    ...exerciseDto
                }
            };
            AnalyticsHandler.pushEvent(event);

        } catch (error) {
            Logger.instance().log(error.message);
        }
    }

    static async onExerciseUpdate(request: express.Request, exerciseDto: MeditationDto | PhysicalActivityDto) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = request.currentUser?.UserId ?? null;
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' updated exercise '${exerciseDto.id}'.`;
            const eventName = AnalyticsEventType.ExerciseUpdate;
            const eventCategory = AnalyticsEventCategory.Exercise;
            const eventSubject = AnalyticsEventSubject.Exercise;
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : exerciseDto.id,
                ResourceType    : 'exercise',
                SourceName      : sourceName,
                SourceVersion   : null,
                EventName       : eventName,
                EventSubject    : eventSubject,
                EventCategory   : eventCategory,
                ActionType      : 'user-action',
                ActionStatement : message,
                Timestamp       : new Date(),
                Attributes      : {
                    ...exerciseDto
                }
            };
            AnalyticsHandler.pushEvent(event);

        } catch (error) {
            Logger.instance().log(error.message);
        }
    }

}
