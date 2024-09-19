import express from 'express';
import { MedicationDto } from '../../../../domain.types/clinical/medication/medication/medication.dto';
import { AnalyticsEvent, AnalyticsEventCategory, AnalyticsEventSubject, AnalyticsEventType } from '../../../../modules/analytics/analytics.types';
import { AnalyticsHandler } from '../../../../modules/analytics/analytics.handler';
import { Logger } from '../../../../common/logger';

///////////////////////////////////////////////////////////////////////////////////////

export class MedicationEvents {

    static async onMedicationCreated(request: express.Request, medication: MedicationDto) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = request.currentUser?.UserId ?? null;
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' created medication '${medication.id}'.`;
            const eventName = AnalyticsEventType.MedicationCreate;
            const eventCategory = AnalyticsEventCategory.Medication;
            const eventSubject = AnalyticsEventSubject.Medication;
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : medication.id,
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
                    DrugId        : medication.DrugId,
                    Dose          : medication.Dose,
                    DosageUnit    : medication.DosageUnit,
                    Frequency     : medication.Frequency,
                    FrequencyUnit : medication.FrequencyUnit,
                    Duration      : medication.Duration,
                    DurationUnit  : medication.DurationUnit,
                    Route         : medication.Route,
                    StartDate     : medication.StartDate,
                    EndDate       : medication.EndDate,
                }
            };
            AnalyticsHandler.pushEvent(event);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    }

    static async onMedicationUpdated(request: express.Request, medication: MedicationDto) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = request.currentUser?.UserId ?? null;
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' updated medication '${medication.id}'.`;
            const eventName = AnalyticsEventType.MedicationUpdate;
            const eventCategory = AnalyticsEventCategory.Medication;
            const eventSubject = AnalyticsEventSubject.Medication;
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : medication.id,
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
                    DrugId        : medication.DrugId,
                    Dose          : medication.Dose,
                    DosageUnit    : medication.DosageUnit,
                    Frequency     : medication.Frequency,
                    FrequencyUnit : medication.FrequencyUnit,
                    Duration      : medication.Duration,
                    DurationUnit  : medication.DurationUnit,
                    Route         : medication.Route,
                    StartDate     : medication.StartDate,
                    EndDate       : medication.EndDate,
                }
            };
            AnalyticsHandler.pushEvent(event);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    }

    static async onMedicationDeleted(request: express.Request, medication: MedicationDto) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = request.currentUser?.UserId ?? null;
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' deleted medication '${medication.id}'.`;
            const eventName = AnalyticsEventType.MedicationDelete;
            const eventCategory = AnalyticsEventCategory.Medication;
            const eventSubject = AnalyticsEventSubject.Medication;
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : medication.id,
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
                    DrugId        : medication.DrugId,
                    Dose          : medication.Dose,
                    DosageUnit    : medication.DosageUnit,
                    Frequency     : medication.Frequency,
                    FrequencyUnit : medication.FrequencyUnit,
                    Duration      : medication.Duration,
                    DurationUnit  : medication.DurationUnit,
                    Route         : medication.Route,
                    StartDate     : medication.StartDate,
                    EndDate       : medication.EndDate,
                }
            };
            AnalyticsHandler.pushEvent(event);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    }

}
