import express from 'express';
import { MedicationDto } from '../../../../domain.types/clinical/medication/medication/medication.dto';
import { AnalyticsEvent } from '../../../../modules/analytics/analytics.types';
import { AnalyticsHandler } from '../../../../modules/analytics/analytics.handler';

///////////////////////////////////////////////////////////////////////////////////////

export class MedicationEvents {

    static async onMedicationCreated(request: express.Request, medication: MedicationDto) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = request.currentUser?.UserId ?? null;
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' created medication '${medication.id}'.`;
            const eventName = 'medication-create';
            const event: AnalyticsEvent = {
                UserId: userId,
                TenantId: tenantId,
                SessionId: sessionId,
                ResourceId: medication.id,
                ResourceType: 'medication',
                SourceName: sourceName,
                SourceVersion: null,
                EventName: eventName,
                EventSubject: 'medication',
                EventCategory: 'medication',
                ActionType: 'user-action',
                ActionStatement: message,
                Timestamp: new Date(),
                Attributes: {
                    DrugId: medication.DrugId,
                    Dose: medication.Dose,
                    DosageUnit: medication.DosageUnit,
                    Frequency: medication.Frequency,
                    FrequencyUnit: medication.FrequencyUnit,
                    Duration: medication.Duration,
                    DurationUnit: medication.DurationUnit,
                    Route: medication.Route,
                    StartDate: medication.StartDate,
                    EndDate: medication.EndDate,
                }
            };
            AnalyticsHandler.pushEvent(event);
        } catch (error) {
            console.error(error);
        }
    }

    static async onMedicationUpdated(request: express.Request, medication: MedicationDto) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = request.currentUser?.UserId ?? null;
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' updated medication '${medication.id}'.`;
            const eventName = 'medication-update';
            const event: AnalyticsEvent = {
                UserId: userId,
                TenantId: tenantId,
                SessionId: sessionId,
                ResourceId: medication.id,
                ResourceType: 'medication',
                SourceName: sourceName,
                SourceVersion: null,
                EventName: eventName,
                EventSubject: 'medication',
                EventCategory: 'medication',
                ActionType: 'user-action',
                ActionStatement: message,
                Timestamp: new Date(),
                Attributes: {
                    DrugId: medication.DrugId,
                    Dose: medication.Dose,
                    DosageUnit: medication.DosageUnit,
                    Frequency: medication.Frequency,
                    FrequencyUnit: medication.FrequencyUnit,
                    Duration: medication.Duration,
                    DurationUnit: medication.DurationUnit,
                    Route: medication.Route,
                    StartDate: medication.StartDate,
                    EndDate: medication.EndDate,
                }
            };
            AnalyticsHandler.pushEvent(event);
        } catch (error) {
            console.error(error);
        }
    }

    static async onMedicationDeleted(request: express.Request, medication: MedicationDto) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = request.currentUser?.UserId ?? null;
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' deleted medication '${medication.id}'.`;
            const eventName = 'medication-delete';
            const event: AnalyticsEvent = {
                UserId: userId,
                TenantId: tenantId,
                SessionId: sessionId,
                ResourceId: medication.id,
                ResourceType: 'medication',
                SourceName: sourceName,
                SourceVersion: null,
                EventName: eventName,
                EventSubject: 'medication',
                EventCategory: 'medication',
                ActionType: 'user-action',
                ActionStatement: message,
                Timestamp: new Date(),
                Attributes: {
                    DrugId: medication.DrugId,
                    Dose: medication.Dose,
                    DosageUnit: medication.DosageUnit,
                    Frequency: medication.Frequency,
                    FrequencyUnit: medication.FrequencyUnit,
                    Duration: medication.Duration,
                    DurationUnit: medication.DurationUnit,
                    Route: medication.Route,
                    StartDate: medication.StartDate,
                    EndDate: medication.EndDate,
                }
            };
            AnalyticsHandler.pushEvent(event);
        } catch (error) {
            console.error(error);
        }
    }
}