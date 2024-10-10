import express from 'express';
import { AnalyticsEvent, AnalyticsEventCategory, AnalyticsEventSubject, AnalyticsEventType } from '../../../modules/analytics/analytics.types';
import { AnalyticsHandler } from '../../../modules/analytics/analytics.handler';
import { Logger } from '../../../common/logger';
import { EnrollmentDto } from '../../../domain.types/clinical/careplan/enrollment/enrollment.dto';

///////////////////////////////////////////////////////////////////////////////////////

export class CareplanEvents {

    static async onCareplanEnrolled(request: express.Request, enrollment: EnrollmentDto) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = request.currentUser?.UserId ?? null;
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' has enrolled in careplan '${enrollment.PlanName}'.`;
            const eventName = AnalyticsEventType.CareplanEnrollment;
            const eventCategory = AnalyticsEventCategory.Careplan;
            const eventSubject = `${AnalyticsEventSubject.CareplanEnrollment}-${enrollment.PlanCode}`;
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : enrollment.id,
                ResourceType    : 'careplan-enrollment',
                SourceName      : sourceName,
                SourceVersion   : null,
                EventName       : eventName,
                EventSubject    : eventSubject,
                EventCategory   : eventCategory,
                ActionType      : 'user-action',
                ActionStatement : message,
                Timestamp       : new Date(),
                Attributes      : {
                    PatientUserId : enrollment.PatientUserId,
                    Provider      : enrollment.Provider,
                    PlanName      : enrollment.PlanName,
                    PlanCode      : enrollment.PlanCode,
                    StartDate     : enrollment.StartAt,
                    EndDate       : enrollment.EndAt,
                }
            };
            AnalyticsHandler.pushEvent(event);
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    }

    static async onCareplanCompleted(request: express.Request, enrollment: EnrollmentDto) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = request.currentUser?.UserId ?? null;
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' has completed careplan '${enrollment.PlanName}'.`;
            const eventName = AnalyticsEventType.CareplanComplete;
            const eventCategory = AnalyticsEventCategory.Careplan;
            const eventSubject = AnalyticsEventSubject.CareplanEnrollment;
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : enrollment.id,
                ResourceType    : 'careplan-enrollment',
                SourceName      : sourceName,
                SourceVersion   : null,
                EventName       : eventName,
                EventSubject    : eventSubject,
                EventCategory   : eventCategory,
                ActionType      : 'user-action',
                ActionStatement : message,
                Timestamp       : new Date(),
                Attributes      : {
                    PatientUserId : enrollment.PatientUserId,
                    Provider      : enrollment.Provider,
                    PlanName      : enrollment.PlanName,
                    PlanCode      : enrollment.PlanCode,
                    StartDate     : enrollment.StartAt,
                    EndDate       : enrollment.EndAt,
                    StoppedAt     : enrollment.StoppedAt,
                }
            };
            AnalyticsHandler.pushEvent(event);
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    }

    static async onCareplanStopped(request: express.Request, enrollment: EnrollmentDto) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = request.currentUser?.UserId ?? null;
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' has stopped careplan '${enrollment.PlanName}'.`;
            const eventName = AnalyticsEventType.CareplanStop;
            const eventCategory = AnalyticsEventCategory.Careplan;
            const eventSubject = `${AnalyticsEventSubject.CareplanStop}-${enrollment.PlanCode}`;
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : enrollment.id,
                ResourceType    : 'careplan-enrollment',
                SourceName      : sourceName,
                SourceVersion   : null,
                EventName       : eventName,
                EventSubject    : eventSubject,
                EventCategory   : eventCategory,
                ActionType      : 'user-action',
                ActionStatement : message,
                Timestamp       : new Date(),
                Attributes      : {
                    PatientUserId : enrollment.PatientUserId,
                    Provider      : enrollment.Provider,
                    PlanName      : enrollment.PlanName,
                    PlanCode      : enrollment.PlanCode,
                    StartDate     : enrollment.StartAt,
                    EndDate       : enrollment.EndAt,
                    StoppedAt     : enrollment.StoppedAt,
                }
            };
            AnalyticsHandler.pushEvent(event);
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    }

}

