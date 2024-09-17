import express from 'express';
import { AnalyticsEvent, AnalyticsEventCategory, AnalyticsEventSubject, AnalyticsEventType } from '../../../modules/analytics/analytics.types';
import { AnalyticsHandler } from '../../../modules/analytics/analytics.handler';
import { Logger } from '../../../common/logger';
import { WaterConsumptionDto } from '../../../domain.types/wellness/nutrition/water.consumption/water.consumption.dto';
import { FoodConsumptionDto } from '../../../domain.types/wellness/nutrition/food.consumption/food.consumption.dto';

///////////////////////////////////////////////////////////////////////////////////////
type NutritionEventDto = WaterConsumptionDto | FoodConsumptionDto ;
/////////////////////////////////////////////////////////////////////////////////////

export class NutritionEvents {

    static getEventType(type: string): AnalyticsEventType {
        switch (type) {
            case 'nutrition-start':
                return AnalyticsEventType.NutritionStart;
            case 'nutrition-complete':
                return AnalyticsEventType.NutritionComplete;
            case 'nutrition-cancel':
                return AnalyticsEventType.NutritionCancel;
            case 'nutrition-update':
                return AnalyticsEventType.NutritionUpdate;
            case 'water-intake-add':
                return AnalyticsEventType.WaterIntakeAdd;
            case 'water-intake-update':
                return AnalyticsEventType.WaterIntakeUpdate;
            case 'water-intake-delete':
                return AnalyticsEventType.WaterIntakeDelete;
        }
    }

    static getEventCategory(type: string): AnalyticsEventCategory {
        switch (type) {
            case 'nutrition':
                return AnalyticsEventCategory.Nutrition;
            case 'water-intake':
                return AnalyticsEventCategory.WaterIntake;
        }
    }

    static getEventSubject(type: string): AnalyticsEventSubject {
        switch (type) {
            case 'food':
                return AnalyticsEventSubject.Food;
            case 'water':
                return AnalyticsEventSubject.Water;
        }
    }

    static async onNutritionCreate(
        request: express.Request,
        record: NutritionEventDto,
        type: string,
        category: string,
        subject: string) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = record.PatientUserId ?? (request.currentUser?.UserId ?? null);
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' created nutrition of type ${type}.`;
            const eventName = this.getEventType(type);
            const eventCategory = this.getEventCategory(category);
            const eventSubject = this.getEventSubject(subject);
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : record.id,
                ResourceType    : 'nutrition',
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

    static async onNutritionUpdate(
        request: express.Request,
        record: NutritionEventDto,
        type: string,
        category: string,
        subject: string) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = record.PatientUserId ?? (request.currentUser?.UserId ?? null);
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' updated nutrition of type ${type}.`;
            const eventName = this.getEventType(type);
            const eventCategory = this.getEventCategory(category);
            const eventSubject = this.getEventSubject(subject);
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : record.id,
                ResourceType    : 'nutrition',
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

    static async onNutritionDelete(
        request: express.Request,
        record: NutritionEventDto,
        type: string,
        category: string,
        subject: string) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = record.PatientUserId ?? (request.currentUser?.UserId ?? null);
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' deleted nutrition of type ${type}.`;
            const eventName = this.getEventType(type);
            const eventCategory = this.getEventCategory(category);
            const eventSubject = this.getEventSubject(subject);
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : record.id,
                ResourceType    : 'nutrition',
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
