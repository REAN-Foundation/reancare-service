import express from 'express';
import { AnalyticsEvent, AnalyticsEventCategory, AnalyticsEventSubject, AnalyticsEventType } from '../../../modules/analytics/analytics.types';
import { AnalyticsHandler } from '../../../modules/analytics/analytics.handler';
import { Logger } from '../../../common/logger';
import { HowDoYouFeelDto } from '../../../domain.types/clinical/symptom/how.do.you.feel/how.do.you.feel.dto';
import { SymptomDto } from '../../../domain.types/clinical/symptom/symptom/symptom.dto';

///////////////////////////////////////////////////////////////////////////////////////
type SymptomEventDto = HowDoYouFeelDto | SymptomDto;
///////////////////////////////////////////////////////////////////////////////////////

export class SymptomEvents {

    static getEventSubject(type: string): AnalyticsEventSubject {
        switch (type) {
            case 'symptom':
                return AnalyticsEventSubject.Symptom;
            case 'how.do.you.feel':
                return AnalyticsEventSubject.SymptomHowDoYouFeel;
            default:
                return AnalyticsEventSubject.Symptom;
        }
    }

    static async onSymptomAdded(request: express.Request, record: SymptomEventDto, type: string) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = record.PatientUserId ?? (request.currentUser?.UserId ?? null);
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' has added symptom record.`;
            const eventName = AnalyticsEventType.SymptomAdd;
            const eventCategory = AnalyticsEventCategory.Symptoms;
            const eventSubject = this.getEventSubject(type);
            const resourceType = type === 'how.do.you.feel' ? 'symptom-how-do-you-feel' : type;
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : record.id,
                ResourceType    : resourceType,
                SourceName      : sourceName,
                SourceVersion   : null,
                EventName       : eventName,
                EventSubject    : eventSubject,
                EventCategory   : eventCategory,
                ActionType      : 'user-action',
                ActionStatement : message,
                Timestamp       : new Date(),
                Attributes      : {
                    ...record,
                }
            };
            AnalyticsHandler.pushEvent(event);
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    }

    static async onSymptomUpdated(request: express.Request, record: SymptomEventDto, type: string) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = record.PatientUserId ?? (request.currentUser?.UserId ?? null);
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' has updated symptom record.`;
            const eventName = AnalyticsEventType.SymptomUpdate;
            const eventCategory = AnalyticsEventCategory.Symptoms;
            const eventSubject = this.getEventSubject(type);
            const resourceType = type === 'how.do.you.feel' ? 'symptom-how-do-you-feel' : type;
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : record.id,
                ResourceType    : resourceType,
                SourceName      : sourceName,
                SourceVersion   : null,
                EventName       : eventName,
                EventSubject    : eventSubject,
                EventCategory   : eventCategory,
                ActionType      : 'user-action',
                ActionStatement : message,
                Timestamp       : new Date(),
                Attributes      : {
                    ...record,
                }
            };
            AnalyticsHandler.pushEvent(event);
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    }

    static async onSymptomDeleted(request: express.Request, record: SymptomEventDto, type: string) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = record.PatientUserId ?? (request.currentUser?.UserId ?? null);
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' has deleted symptom record.`;
            const eventName = AnalyticsEventType.SymptomDelete;
            const eventCategory = AnalyticsEventCategory.Symptoms;
            const eventSubject = this.getEventSubject(type);
            const resourceType = type === 'how.do.you.feel' ? 'symptom-how-do-you-feel' : type;
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : record.id,
                ResourceType    : resourceType,
                SourceName      : sourceName,
                SourceVersion   : null,
                EventName       : eventName,
                EventSubject    : eventSubject,
                EventCategory   : eventCategory,
                ActionType      : 'user-action',
                ActionStatement : message,
                Timestamp       : new Date(),
                Attributes      : {
                    ...record,
                }
            };
            AnalyticsHandler.pushEvent(event);
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    }

}
