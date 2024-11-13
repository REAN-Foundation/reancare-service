import express from 'express';
import { LabRecordDto } from '../../../domain.types/clinical/lab.record/lab.record/lab.record.dto';
import { Logger } from '../../../common/logger';
import { AnalyticsEvent, AnalyticsEventCategory, AnalyticsEventSubject, AnalyticsEventType } from '../../../modules/analytics/analytics.types';
import { AnalyticsHandler } from '../../../modules/analytics/analytics.handler';

export class LabRecordEvents {

    static async onLabRecordAdd(request: express.Request, labRecord: LabRecordDto) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = request.currentUser?.UserId ?? null;
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' added lab record '${labRecord.id}'.`;
            const eventName = AnalyticsEventType.LabRecordAdd;
            const eventCategory = AnalyticsEventCategory.LabRecords;
            const eventSubject = `lab-record-${labRecord.DisplayName}`;
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : labRecord.id,
                ResourceType    : 'lab-record',
                SourceName      : sourceName,
                SourceVersion   : null,
                EventName       : eventName,
                EventSubject    : eventSubject,
                EventCategory   : eventCategory,
                ActionType      : 'user-action',
                ActionStatement : message,
                Timestamp       : new Date(),
                Attributes      : {
                    EhrId          : labRecord.EhrId,
                    TypeId         : labRecord.TypeId,
                    TypeName       : labRecord.TypeName,
                    DisplayName    : labRecord.DisplayName,
                    PrimaryValue   : labRecord.PrimaryValue,
                    SecondaryValue : labRecord.SecondaryValue,
                    Unit           : labRecord.Unit,
                    ReportId       : labRecord.ReportId,
                    OrderId        : labRecord.OrderId,
                    RecordedAt     : labRecord.RecordedAt,
                }
            };
            AnalyticsHandler.pushEvent(event);

        } catch (error) {
            Logger.instance().log(error.message);
        }
    }

    static async onLabRecordDelete(request: express.Request, labRecord: LabRecordDto) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = request.currentUser?.UserId ?? null;
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' deleted lab record '${labRecord.id}'.`;
            const eventName = AnalyticsEventType.LabRecordDelete;
            const eventCategory = AnalyticsEventCategory.LabRecords;
            const eventSubject = `lab-record-${labRecord.DisplayName}`;
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : labRecord.id,
                ResourceType    : 'lab-record',
                SourceName      : sourceName,
                SourceVersion   : null,
                EventName       : eventName,
                EventSubject    : eventSubject,
                EventCategory   : eventCategory,
                ActionType      : 'user-action',
                ActionStatement : message,
                Timestamp       : new Date(),
                Attributes      : {
                    EhrId          : labRecord.EhrId,
                    TypeId         : labRecord.TypeId,
                    TypeName       : labRecord.TypeName,
                    DisplayName    : labRecord.DisplayName,
                    PrimaryValue   : labRecord.PrimaryValue,
                    SecondaryValue : labRecord.SecondaryValue,
                    Unit           : labRecord.Unit,
                    ReportId       : labRecord.ReportId,
                    OrderId        : labRecord.OrderId,
                    RecordedAt     : labRecord.RecordedAt,
                }
            };
            AnalyticsHandler.pushEvent(event);

        } catch (error) {
            Logger.instance().log(error.message);
        }
    }

    static async onLabRecordSearch(request: express.Request, labRecord: LabRecordDto) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = request.currentUser?.UserId ?? null;
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' searched lab record '${labRecord.id}'.`;
            const eventName = AnalyticsEventType.LabRecordSearch;
            const eventCategory = AnalyticsEventCategory.LabRecords;
            const eventSubject = AnalyticsEventSubject.LabRecord;
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : labRecord.id,
                ResourceType    : 'lab-record',
                SourceName      : sourceName,
                SourceVersion   : null,
                EventName       : eventName,
                EventSubject    : eventSubject,
                EventCategory   : eventCategory,
                ActionType      : 'user-action',
                ActionStatement : message,
                Timestamp       : new Date(),
                Attributes      : {
                    EhrId          : labRecord.EhrId,
                    TypeId         : labRecord.TypeId,
                    TypeName       : labRecord.TypeName,
                    DisplayName    : labRecord.DisplayName,
                    PrimaryValue   : labRecord.PrimaryValue,
                    SecondaryValue : labRecord.SecondaryValue,
                    Unit           : labRecord.Unit,
                    ReportId       : labRecord.ReportId,
                    OrderId        : labRecord.OrderId,
                    RecordedAt     : labRecord.RecordedAt,
                }
            };
            AnalyticsHandler.pushEvent(event);

        } catch (error) {
            Logger.instance().log(error.message);
        }
    }

}
