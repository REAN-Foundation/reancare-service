import express from 'express';
import { AnalyticsEvent, AnalyticsEventCategory, AnalyticsEventSubject, AnalyticsEventType } from '../../../modules/analytics/analytics.types';
import { AnalyticsHandler } from '../../../modules/analytics/analytics.handler';
import { Logger } from '../../../common/logger';
import { SleepDto } from '../../../domain.types/wellness/daily.records/sleep/sleep.dto';
import { StepCountDto } from '../../../domain.types/wellness/daily.records/step.count/step.count.dto';
import { StandDto } from '../../../domain.types/wellness/daily.records/stand/stand.dto';

///////////////////////////////////////////////////////////////////////////////////////
type DailyRecordEventDto = SleepDto | StepCountDto | StandDto;
/////////////////////////////////////////////////////////////////////////////////////

export class DailyRecordEvents {

    static getEventType(type: string): AnalyticsEventType {
        switch (type) {
            case 'stand-record-add':
                return AnalyticsEventType.StandRecordAdd;
            case 'step-record-add':
                return AnalyticsEventType.StepRecordAdd;
            case 'sleep-record-add':
                return AnalyticsEventType.SleepRecordAdd;
            case 'mood-record-add':
                return AnalyticsEventType.MoodRecordAdd;
        }
    }

    static getEventCategory(type: string): AnalyticsEventCategory {
        switch (type) {
            case 'steps':
                return AnalyticsEventCategory.Steps;
            case 'sleep':
                return AnalyticsEventCategory.Sleep;
            case 'stand':
                return AnalyticsEventCategory.Stand;
            case 'mood':
                return AnalyticsEventCategory.Mood;
        }
    }

    static getEventSubject(type: string): AnalyticsEventSubject {
        switch (type) {
            case 'step':
                return AnalyticsEventSubject.Step;
            case 'sleep':
                return AnalyticsEventSubject.Sleep;
            case 'stand':
                return AnalyticsEventSubject.Stand;
            case 'mood':
                return AnalyticsEventSubject.Mood;
        }
    }

    static async onDailyRecordAdd(
        request: express.Request,
        record: DailyRecordEventDto,
        type: string,
        category: string,
        subject: string) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = request.currentUser?.UserId ?? null;
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' added daily record '${record.id}'.`;
            const eventName = this.getEventType(type);
            const eventCategory = this.getEventCategory(category);
            const eventSubject = this.getEventSubject(subject);
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : record.id,
                ResourceType    : 'daily-record',
                SourceName      : sourceName,
                SourceVersion   : null,
                EventName       : eventName,
                EventSubject    : eventSubject,
                EventCategory   : eventCategory,
                ActionType      : 'user-action',
                ActionStatement : message,
                Timestamp       : new Date(),
                Attributes      : {
                    ...record
                }
            };
            AnalyticsHandler.pushEvent(event);

        } catch (error) {
            Logger.instance().log(error.message);
        }
    }

}
