import express from 'express';
import { AnalyticsEvent, AnalyticsEventCategory, AnalyticsEventSubject, AnalyticsEventType } from '../../../modules/analytics/analytics.types';
import { AnalyticsHandler } from '../../../modules/analytics/analytics.handler';
import { Logger } from '../../../common/logger';
import { AssessmentDto } from '../../../domain.types/clinical/assessment/assessment.dto';
import { DailyAssessmentDto } from '../../../domain.types/clinical/daily.assessment/daily.assessment.dto';
import { SymptomAssessmentDto } from '../../../domain.types/clinical/symptom/symptom.assessment/symptom.assessment.dto';
import { AssessmentQuestionResponseDto } from '../../../domain.types/clinical/assessment/assessment.question.response.dto';

///////////////////////////////////////////////////////////////////////////////////////
type AssessmentEventDto = AssessmentDto | DailyAssessmentDto | SymptomAssessmentDto;
/////////////////////////////////////////////////////////////////////////////////////

export class AssessmentEvents {

    static getEventSubject(type: string): AnalyticsEventSubject {
        switch (type) {
            case 'assessment':
                return AnalyticsEventSubject.Assessment;
            case 'daily.assessment':
                return AnalyticsEventSubject.DailyAssessment;
            case 'symptom.assessment':
                return AnalyticsEventSubject.SymptomAssessment;
            case 'survey.assessment':
                return AnalyticsEventSubject.SurveyAssessment;
            case 'form.assessment':
                return AnalyticsEventSubject.FormAssessment;
            default:
                return AnalyticsEventSubject.Assessment;
        }
    }

    static async onAssessmentCreated(request: express.Request, record: AssessmentEventDto, type: string) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = record.PatientUserId ?? (request.currentUser?.UserId ?? null);
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' created assessment '${record.id}' of type ${type}.`;
            const eventName = AnalyticsEventType.AssessmentCreate;
            const eventCategory = AnalyticsEventCategory.Assessment;
            const eventSubject = this.getEventSubject(type);
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : record.id,
                ResourceType    : 'assessment',
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

    static async onAssessmentDeleted(request: express.Request, record: AssessmentEventDto, type: string) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = record.PatientUserId ?? (request.currentUser?.UserId ?? null);
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' deleted assessment '${record.id}' of type ${type}.`;
            const eventName = AnalyticsEventType.AssessmentDelete;
            const eventCategory = AnalyticsEventCategory.Assessment;
            const eventSubject = this.getEventSubject(type);
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : record.id,
                ResourceType    : 'assessment',
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

    static async onAssessmentStarted(request: express.Request, record: AssessmentEventDto, type: string) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = record.PatientUserId ?? (request.currentUser?.UserId ?? null);
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' started assessment '${record.id}' of type ${type}.`;
            const eventName = AnalyticsEventType.AssessmentStart;
            const eventCategory = AnalyticsEventCategory.Assessment;
            const eventSubject = this.getEventSubject(type);
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : record.id,
                ResourceType    : 'assessment',
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

    static async onAssessmentCompleted(request: express.Request, record: AssessmentEventDto, type: string) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = record.PatientUserId ?? (request.currentUser?.UserId ?? null);
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' completed assessment '${record.id}' of type ${type}.`;
            const eventName = AnalyticsEventType.AssessmentComplete;
            const eventCategory = AnalyticsEventCategory.Assessment;
            const eventSubject = this.getEventSubject(type);
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : record.id,
                ResourceType    : 'assessment',
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

    static async onAssessmentQuestionAnswered(
        request: express.Request,
        questionResponse: AssessmentQuestionResponseDto,
        assessment: AssessmentEventDto,
        type: string) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const questionId = questionResponse.Answer?.NodeId ?? null;
            const userId = assessment.PatientUserId ?? (request.currentUser?.UserId ?? null);
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' answered a question '${questionId}' in assessment ${assessment.id} of type ${type}.`;
            const eventName = AnalyticsEventType.AssessmentQuestionAnswer;
            const eventCategory = AnalyticsEventCategory.Assessment;
            const eventSubject = AnalyticsEventSubject.AssessmentQuestion;
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : questionId,
                ResourceType    : 'assessment-question',
                SourceName      : sourceName,
                SourceVersion   : null,
                EventName       : eventName,
                EventSubject    : eventSubject,
                EventCategory   : eventCategory,
                ActionType      : 'user-action',
                ActionStatement : message,
                Timestamp       : new Date(),
                Attributes      : {
                    Response   : { ...questionResponse },
                    Assessment : { ...assessment },
                }
            };
            AnalyticsHandler.pushEvent(event);
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    }

    static async onAssessmentQuestionSkipped(
        request: express.Request,
        questionResponse: AssessmentQuestionResponseDto,
        assessment: AssessmentEventDto,
        type: string) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const questionId = questionResponse.Answer?.NodeId ?? null;
            const userId = assessment.PatientUserId ?? (request.currentUser?.UserId ?? null);
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' skipped a question '${questionId}' in assessment ${assessment.id} of type ${type}.`;
            const eventName = AnalyticsEventType.AssessmentQuestionSkip;
            const eventCategory = AnalyticsEventCategory.Assessment;
            const eventSubject = AnalyticsEventSubject.AssessmentQuestion;
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : questionId,
                ResourceType    : 'assessment-question',
                SourceName      : sourceName,
                SourceVersion   : null,
                EventName       : eventName,
                EventSubject    : eventSubject,
                EventCategory   : eventCategory,
                ActionType      : 'user-action',
                ActionStatement : message,
                Timestamp       : new Date(),
                Attributes      : {
                    Response   : { ...questionResponse },
                    Assessment : { ...assessment },
                }
            };
            AnalyticsHandler.pushEvent(event);
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    }

}
