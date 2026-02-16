import { BotMessagingType } from "../../../domain.types/miscellaneous/bot,request.types";
import { NotificationChannel } from "../../../domain.types/general/notification/notification.types";
import { BloodCholesterolSearchFilters } from "./blood.cholesterol/blood.cholesterol.search.types";
import { BloodGlucoseSearchFilters } from "./blood.glucose/blood.glucose.search.types";
import { BloodOxygenSaturationSearchFilters } from "./blood.oxygen.saturation/blood.oxygen.saturation.search.types";
import { BloodPressureSearchFilters } from "./blood.pressure/blood.pressure.search.types";
import { BodyHeightSearchFilters } from "./body.height/body.height.search.types";
import { BodyTemperatureSearchFilters } from "./body.temperature/body.temperature.search.types";
import { BodyWeightSearchFilters } from "./body.weight/body.weight.search.types";
import { PulseSearchFilters } from "./pulse/pulse.search.types";
import { BloodGlucoseAlertModel } from "./alert.notificattion/blood.glucose";
import { BloodPressureAlertModel } from "./alert.notificattion/blood.pressure";
import { PulseAlertModel } from "./alert.notificattion/pulse";
import { BodyTemperatureAlertModel } from "./alert.notificattion/body.temperature";
import { BloodOxygenAlertModel } from "./alert.notificattion/blood.oxygen.saturation";
import { BodyBmiAlertModel } from "./alert.notificattion/body.bmi";
import { BodyWeightAlertModel } from "./alert.notificattion/body.weight";

export enum BiometricsType {
    BloodGlucose          = 'Blood Glucose',
    BloodOxygenSaturation = 'Blood Oxygen Saturation',
    BloodPressure         = 'Blood Pressure',
    BodyHeight            = 'Body Height',
    BodyWeight            = 'Body Weight',
    BodyTemperature       = 'Body Temperature',
    Pulse                 = 'Pulse',
}

export const DEFAULT_ALERT_TITLE = "Dear {{PatientName}},";

export enum BiometricAlertType {
    BloodGlucoseAlert          = 'BloodGlucoseAlert',
    BloodOxygenSaturationAlert = 'BloodOxygenSaturationAlert',
    BloodPressureAlert         = 'BloodPressureAlert',
    BodyBmiAlert               = 'BodyBmiAlert',
    BodyTemperatureAlert       = 'BodyTemperatureAlert',
    BodyWeightAlert            = 'BodyWeightAlert',
    PulseAlert                 = 'PulseAlert',
}

export const BiometricsTypeList: BiometricsType[] = [
    BiometricsType.BloodGlucose,
    BiometricsType.BloodOxygenSaturation,
    BiometricsType.BloodPressure,
    BiometricsType.BodyHeight,
    BiometricsType.BodyWeight,
    BiometricsType.BodyTemperature,
    BiometricsType.Pulse,
];

export type BiometricSearchFilters = BloodCholesterolSearchFilters
    | BloodGlucoseSearchFilters
    | BloodOxygenSaturationSearchFilters
    | BloodPressureSearchFilters
    | BodyHeightSearchFilters
    | BodyWeightSearchFilters
    | BodyTemperatureSearchFilters
    | PulseSearchFilters;
    
export enum Severity {
    LOW = "Low",
    NORMAL = "Normal",
    ELEVATED = "Elevated",
    HYPERTENSION_STAGE1 = "Hypertension Stage1",
    HYPERTENSION_STAGE2 = "Hypertension Stage2",
    HYPERTENSIVE_CRISIS = "Hypertensive Crisis",
    HIGH = "High",
    VERY_HIGH = "Very High",
    LOW_INVALID = "Low Invalid",
    HIGH_INVALID = "High Invalid"
    }

export interface AlertNotificationCreateModel {
        severity: Severity;
        range: string;
        title: string;
        message: string;
    }

export interface AlertNotification {
        severity: Severity;
        range: string;
        title: {[key: string]: string};
        message: {[key: string]: string};
    }

export interface BiometricAlertSettings {
    Channel: NotificationChannel;
    ClientName: string;
    BiometricAlertCategories: string[];
    Type: BotMessagingType;
    TemplateName?: string;
}
export interface AlertMessage {
    Title: string;
    Message: string;
    Phone: string;
    UniqueReferenceId: string;
    TenantCode: string;
    Email?: string;
}

export interface AlertModel {
    PatientUserId?: string;
    BiometricAlertSettings?: BiometricAlertSettings;
}

export type BiometricAlertModel =  BloodGlucoseAlertModel |
                                BloodPressureAlertModel |
                                PulseAlertModel |
                                BodyTemperatureAlertModel |
                                BloodOxygenAlertModel |
                                BodyBmiAlertModel |
                                BodyWeightAlertModel;
