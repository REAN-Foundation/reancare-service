import express from 'express';
import { AnalyticsEvent, AnalyticsEventCategory, AnalyticsEventSubject, AnalyticsEventType } from '../../../../modules/analytics/analytics.types';
import { AnalyticsHandler } from '../../../../modules/analytics/analytics.handler';
import { MedicationConsumptionDto } from '../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.dto';
import { Logger } from '../../../../common/logger';

///////////////////////////////////////////////////////////////////////////////////////

export class MedicationConsumptionEvents {

    static async onMedicationConsumptionTaken(request: express.Request, consumption: MedicationConsumptionDto) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = request.currentUser?.UserId ?? null;
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' has taken medication at schedule '${consumption.id}'.`;
            const eventName = AnalyticsEventType.MedicationScheduleTaken;
            const eventCategory = AnalyticsEventCategory.Medication;
            const eventSubject = AnalyticsEventSubject.MedicationSchedule;
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : consumption.id,
                ResourceType    : 'medication',
                SourceName      : sourceName,
                SourceVersion   : null,
                EventName       : eventName,
                EventSubject    : eventSubject,
                EventCategory   : eventCategory,
                ActionType      : 'user-action',
                ActionStatement : message,
                Timestamp       : new Date(),
                Attributes      : {
                    MedicationId      : consumption.MedicationId,
                    Status            : consumption.Status,
                    DrugName          : consumption.DrugName,
                    TimeScheduleStart : consumption.TimeScheduleStart,
                    TimeScheduleEnd   : consumption.TimeScheduleEnd,
                }
            };
            AnalyticsHandler.pushEvent(event);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    }

    static async onMedicationConsumptionMissed(request: express.Request, consumption: MedicationConsumptionDto) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = request.currentUser?.UserId ?? null;
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' has marked medication at schedule '${consumption.id}' as missed.`;
            const eventName = AnalyticsEventType.MedicationScheduleMissed;
            const eventCategory = AnalyticsEventCategory.Medication;
            const eventSubject = AnalyticsEventSubject.MedicationSchedule;
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : consumption.id,
                ResourceType    : 'medication',
                SourceName      : sourceName,
                SourceVersion   : null,
                EventName       : eventName,
                EventSubject    : eventSubject,
                EventCategory   : eventCategory,
                ActionType      : 'user-action',
                ActionStatement : message,
                Timestamp       : new Date(),
                Attributes      : {
                    MedicationId      : consumption.MedicationId,
                    Status            : consumption.Status,
                    DrugName          : consumption.DrugName,
                    TimeScheduleStart : consumption.TimeScheduleStart,
                    TimeScheduleEnd   : consumption.TimeScheduleEnd,
                }
            };
            AnalyticsHandler.pushEvent(event);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    }

}
