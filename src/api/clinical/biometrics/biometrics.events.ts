import express from 'express';
import { AnalyticsEvent, AnalyticsEventCategory, AnalyticsEventSubject, AnalyticsEventType } from '../../../modules/analytics/analytics.types';
import { AnalyticsHandler } from '../../../modules/analytics/analytics.handler';
import { Logger } from '../../../common/logger';
import { BloodCholesterolDto } from '../../../domain.types/clinical/biometrics/blood.cholesterol/blood.cholesterol.dto';
import { BloodGlucoseDto } from '../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.dto';
import { BloodOxygenSaturationDto } from '../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.dto';
import { BodyHeightDto } from '../../../domain.types/clinical/biometrics/body.height/body.height.dto';
import { BloodPressureDto } from '../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.dto';
import { BodyTemperatureDto } from '../../../domain.types/clinical/biometrics/body.temperature/body.temperature.dto';
import { BodyWeightDto } from '../../../domain.types/clinical/biometrics/body.weight/body.weight.dto';
import { PulseDto } from '../../../domain.types/clinical/biometrics/pulse/pulse.dto';

///////////////////////////////////////////////////////////////////////////////////////
type BiometricsDto = BloodCholesterolDto | BloodGlucoseDto | BloodOxygenSaturationDto |
                     BloodPressureDto | BodyTemperatureDto | BodyWeightDto | PulseDto |
                     BodyHeightDto;
///////////////////////////////////////////////////////////////////////////////////////

export class BiometricsEvents {

    static getEventSubject(type: string): AnalyticsEventSubject {
        switch (type) {
            case 'blood.pressure':
                return AnalyticsEventSubject.VitalsBloodPressure;
            case 'blood.glucose':
                return AnalyticsEventSubject.VitalsBloodGlucose;
            case 'blood.cholesterol':
                return AnalyticsEventSubject.VitalsCholesterol;
            case 'blood.oxygen.saturation':
                return AnalyticsEventSubject.VitalsBloodOxygenSaturation;
            case 'body.temperature':
                return AnalyticsEventSubject.VitalsBodyTemperature;
            case 'body.weight':
                return AnalyticsEventSubject.VitalsBodyWeight;
            case 'pulse':
                return AnalyticsEventSubject.VitalsPulse;
            case 'body.height':
                return AnalyticsEventSubject.VitalsBodyHeight;
            case 'respiratory.rate':
                return AnalyticsEventSubject.VitalsRespiratoryRate;
            default:
                return AnalyticsEventSubject.VitalsPulse;
        }
    }

    static async onBiometricsAdded(request: express.Request, record: BiometricsDto, type: string) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = request.currentUser?.UserId ?? null;
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' has added biometrics record.`;
            const eventName = AnalyticsEventType.VitalsAdd;
            const eventCategory = AnalyticsEventCategory.Vitals;
            const eventSubject = this.getEventSubject(type);
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : record.id,
                ResourceType    : 'vitals',
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

    static async onBiometricsUpdated(request: express.Request, record: BiometricsDto, type: string) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = request.currentUser?.UserId ?? null;
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' has updated biometrics record.`;
            const eventName = AnalyticsEventType.VitalsUpdate;
            const eventCategory = AnalyticsEventCategory.Vitals;
            const eventSubject = this.getEventSubject(type);
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : record.id,
                ResourceType    : 'vitals',
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

    static async onBiometricsDeleted(request: express.Request, record: BiometricsDto, type: string) {
        try {
            const sourceName = request.currentClient?.ClientName ?? 'Unknown';
            const userId = request.currentUser?.UserId ?? null;
            const tenantId = request.currentUser?.TenantId ?? (request.currentUserTenantId ?? null);
            const sessionId = request.currentUser?.SessionId ?? null;
            const message = `User '${userId}' has deleted biometrics record.`;
            const eventName = AnalyticsEventType.VitalsDelete;
            const eventCategory = AnalyticsEventCategory.Vitals;
            const eventSubject = this.getEventSubject(type);
            const event: AnalyticsEvent = {
                UserId          : userId,
                TenantId        : tenantId,
                SessionId       : sessionId,
                ResourceId      : record.id,
                ResourceType    : 'vitals',
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
