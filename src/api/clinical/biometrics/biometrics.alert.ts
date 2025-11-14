import { Logger } from "../../../common/logger";
import { BiometricAlerNotificationHandler } from "./biometrics.alert.notification.handler";
import { AlertNotification, BiometricAlertSettings, Severity } from "../../../domain.types/clinical/biometrics/biometrics.types";
import { BloodPressureDto } from "../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.dto";
import { BloodPressureAlertCreateModel, bloodPressureNotificationTemplate } from "../../../domain.types/clinical/biometrics/alert.notificattion/blood.pressure";
import { Injector } from "../../../startup/injector";
import { UserService } from "../../../services/users/user/user.service";
import { SupportedLanguage } from "../../../domain.types/users/user/user.types";
import { NotificationChannel } from "../../../domain.types/general/notification/notification.types";
import { BiometricAlertMessagingHandler } from "./biometrics.alert.messaging.handler";
import { ApiError } from "../../../common/api.error";
import { BloodGlucoseDto } from "../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.dto";
import { BloodGlucoseAlertCreateModel } from "../../../domain.types/clinical/biometrics/alert.notificattion/blood.glucose";
import { GLUCOSE_LOW_THRESHOLD } from "../../../domain.types/clinical/biometrics/alert.notificattion/blood.glucose";
import { glucoseNotificationTemplate } from "../../../domain.types/clinical/biometrics/alert.notificattion/blood.glucose";
import { GLUCOSE_NORMAL_MIN } from "../../../domain.types/clinical/biometrics/alert.notificattion/blood.glucose";
import { GLUCOSE_NORMAL_MAX } from "../../../domain.types/clinical/biometrics/alert.notificattion/blood.glucose";
import { GLUCOSE_HIGH_MIN } from "../../../domain.types/clinical/biometrics/alert.notificattion/blood.glucose";
import { GLUCOSE_HIGH_MAX } from "../../../domain.types/clinical/biometrics/alert.notificattion/blood.glucose";
import { GLUCOSE_VERY_HIGH_THRESHOLD } from "../../../domain.types/clinical/biometrics/alert.notificattion/blood.glucose";
import { PULSE_HIGH_THRESHOLD, PULSE_LOW_THRESHOLD, PULSE_NORMAL_MAX, PULSE_NORMAL_MIN, PulseAlertCreateModel, pulseNotificationTemplate } from "../../../domain.types/clinical/biometrics/alert.notificattion/pulse";
import { PulseDto } from "../../../domain.types/clinical/biometrics/pulse/pulse.dto";
import { BodyTemperatureDto } from "../../../domain.types/clinical/biometrics/body.temperature/body.temperature.dto";
import { BodyTemperatureAlertCreateModel, bodyTemperatureNotificationTemplate, bodyTemperatureUnits, TEMP_ELEVATED_MAX, TEMP_ELEVATED_MIN, TEMP_FEVER_MAX, TEMP_FEVER_MIN, TEMP_HIGH_THRESHOLD, TEMP_LOW_THRESHOLD, TEMP_NORMAL_MAX, TEMP_NORMAL_MIN } from "../../../domain.types/clinical/biometrics/alert.notificattion/body.temperature";
import { BloodOxygenSaturationDto } from "../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.dto";
import { BloodOxygenAlertCreateModel, OXYGEN_NORMAL_MAX, OXYGEN_NORMAL_MIN, bloodOxygenNotificationTemplate, OXYGEN_LOW_RANGE_MIN, OXYGEN_LOW_THRESHOLD } from "../../../domain.types/clinical/biometrics/alert.notificattion/blood.oxygen.saturation";
import { BMI_OBESE_THRESHOLD, BMI_OVERWEIGHT_MAX, BMI_NORMAL_MAX, BMI_NORMAL_MIN, BMI_UNDERWEIGHT_THRESHOLD, BodyBmiAlertCreateModel, weightNotificationTemplate, BMI_OVERWEIGHT_MIN } from "../../../domain.types/clinical/biometrics/alert.notificattion/body.bmi";
import { BodyWeightDto } from "../../../domain.types/clinical/biometrics/body.weight/body.weight.dto";
import { BodyHeightDto } from "../../../domain.types/clinical/biometrics/body.height/body.height.dto";

///////////////////////////////////////////////////////////////////////////////

enum BloodPressureCategory {
    Normal = 1,
    Elevated = 2,
    HypertensionStage1 = 3,
    HypertensionStage2 = 4,
    HypertensiveCrisis = 5
}

///////////////////////////////////////////////////////////////////////////////

export class BiometricAlerts {

    private static DEFAULT_USER_LANGUAGE_PREFERENCE = SupportedLanguage.English;

    private static resolveUserServiceDependency(): UserService {
        return Injector.Container.resolve(UserService);
    }

    static async forBloodGlucose(model: BloodGlucoseDto,
        notificationChannel: NotificationChannel = NotificationChannel.MobilePush,
        metaData: BiometricAlertSettings | null = null) {
        try {
            const notification = BiometricAlerts.getGlucoseNotification(model.BloodGlucose);
            if (!notification) {
                return;
            }
            const biometricAlertHandler = BiometricAlerts.getBiometricAlertHandler(notificationChannel);
            if (!biometricAlertHandler) {
                throw new ApiError(500, 'Biometric alert handler not found.');
            }
            const glucoseAlertmodel: BloodGlucoseAlertCreateModel = {};
            glucoseAlertmodel.PatientUserId = model.PatientUserId;
            glucoseAlertmodel.BloodGlucose = model.BloodGlucose;
            const userLanguagePreference = await BiometricAlerts.getUserLanguagePreference(model.PatientUserId);
            glucoseAlertmodel.GlucoseNotification = {
                severity : notification.severity,
                range    : notification.range,
                title    : notification.title[userLanguagePreference] ??
                notification.title[BiometricAlerts.DEFAULT_USER_LANGUAGE_PREFERENCE],
                message : notification.message[userLanguagePreference] ??
                notification.message[BiometricAlerts.DEFAULT_USER_LANGUAGE_PREFERENCE]
            };
            await biometricAlertHandler.bloodGlucoseAlert(glucoseAlertmodel, metaData);
        } catch (error) {
            Logger.instance().log(`Error in sending blood glucose alert notification : ${error}`);
        }
    }
    
    static async forBloodPressure(model: BloodPressureDto,
        notificationChannel: NotificationChannel = NotificationChannel.MobilePush,
        metaData: BiometricAlertSettings | null = null) {
        try {
            const biometricAlertHandler = BiometricAlerts.getBiometricAlertHandler(notificationChannel);
            if (!biometricAlertHandler) {
                throw new ApiError(500, 'Biometric alert handler not found.');
            }
            const notification = BiometricAlerts.getBloodPressureNotification(model.Systolic, model.Diastolic);
            if (!notification || notification?.severity === Severity.NORMAL) {
                return;
            }
            const bloodPressureAlertmodel: BloodPressureAlertCreateModel = {};
            bloodPressureAlertmodel.PatientUserId = model.PatientUserId;
            bloodPressureAlertmodel.Systolic = model.Systolic;
            bloodPressureAlertmodel.Diastolic = model.Diastolic;

            const userLanguagePreference = await BiometricAlerts.getUserLanguagePreference(model.PatientUserId);
            bloodPressureAlertmodel.BloodPressureNotification = {
                severity : notification.severity,
                range    : notification.range,
                title    : notification.title[userLanguagePreference] ??
                notification.title[BiometricAlerts.DEFAULT_USER_LANGUAGE_PREFERENCE],
                message : notification.message[userLanguagePreference] ??
                notification.message[BiometricAlerts.DEFAULT_USER_LANGUAGE_PREFERENCE]
            };

            await biometricAlertHandler.bloodPressureAlert(bloodPressureAlertmodel, metaData);
        } catch (error) {
            Logger.instance().log(`Error in sending blood glucose alert notification : ${error}`);
        }
    }

    static async forPulse(model: PulseDto,
        notificationChannel: NotificationChannel = NotificationChannel.MobilePush,
        metaData: BiometricAlertSettings | null = null) {
        try {
            const notification = BiometricAlerts.getPulseNotification(model.Pulse!);
            if (!notification || notification?.severity === Severity.NORMAL) {
                return;
            }
            const biometricAlertHandler = BiometricAlerts.getBiometricAlertHandler(notificationChannel);
            if (!biometricAlertHandler) {
                throw new ApiError(500, 'Biometric alert handler not found.');
            }
            const pulseAlertModel: PulseAlertCreateModel = {};
            pulseAlertModel.PatientUserId = model.PatientUserId;
            pulseAlertModel.Pulse = model.Pulse;
            const userLanguagePreference = await BiometricAlerts.getUserLanguagePreference(model.PatientUserId);
            pulseAlertModel.PulseNotification = {
                severity : notification.severity,
                range    : notification.range,
                title    : notification.title[userLanguagePreference] ??
                notification.title[BiometricAlerts.DEFAULT_USER_LANGUAGE_PREFERENCE],
                message : notification.message[userLanguagePreference] ??
                notification.message[BiometricAlerts.DEFAULT_USER_LANGUAGE_PREFERENCE]
            };

            await biometricAlertHandler.pulseAlert(pulseAlertModel, metaData);
        } catch (error) {
            Logger.instance().log(`Error in sending pulse alert notification : ${error}`);
        }
    }
    
    static async forBodyTemperature(model: BodyTemperatureDto,
        notificationChannel: NotificationChannel = NotificationChannel.MobilePush,
        metaData: BiometricAlertSettings | null = null) {
        try {
            const tempInFarenheit = bodyTemperatureUnits.includes(model.Unit?.toLowerCase()) ?
                (model.BodyTemperature * 1.8) + 32 : model.BodyTemperature;

            const notification = BiometricAlerts.getTemperatureNotification(tempInFarenheit);
            if (!notification || notification?.severity === Severity.NORMAL) {
                return;
            }

            const biometricAlertHandler = BiometricAlerts.getBiometricAlertHandler(notificationChannel);
            if (!biometricAlertHandler) {
                throw new ApiError(500, 'Biometric alert handler not found.');
            }
            const userLanguagePreference = await BiometricAlerts.getUserLanguagePreference(model.PatientUserId);
            const temperatureAlertModel: BodyTemperatureAlertCreateModel = {};
            temperatureAlertModel.PatientUserId = model.PatientUserId;
            temperatureAlertModel.BodyTemperature = model.BodyTemperature;
            temperatureAlertModel.TemperatureNotification = {
                severity : notification.severity,
                range    : notification.range,
                title    : notification.title[userLanguagePreference] ??
                notification.title[BiometricAlerts.DEFAULT_USER_LANGUAGE_PREFERENCE],
                message : notification.message[userLanguagePreference] ??
                notification.message[BiometricAlerts.DEFAULT_USER_LANGUAGE_PREFERENCE]
            };

            await biometricAlertHandler.bodyTemperatureAlert(temperatureAlertModel, metaData);
        } catch (error) {
            Logger.instance().log(`Error in sending body temperature alert notification : ${error}`);
        }
    }

    static async forBloodOxygenSaturation(model: BloodOxygenSaturationDto,
        notificationChannel: NotificationChannel = NotificationChannel.MobilePush,
        metaData: BiometricAlertSettings | null = null) {
        try {
            const notification = BiometricAlerts.getOxygenNotification(model.BloodOxygenSaturation);
            if (!notification || notification?.severity === Severity.NORMAL) {
                return;
            }
            const biometricAlertHandler = BiometricAlerts.getBiometricAlertHandler(notificationChannel);
            if (!biometricAlertHandler) {
                throw new ApiError(500, 'Biometric alert handler not found.');
            }
            const oxygenAlertModel: BloodOxygenAlertCreateModel = {};
            oxygenAlertModel.PatientUserId = model.PatientUserId;
            oxygenAlertModel.BloodOxygenSaturation = model.BloodOxygenSaturation;
            const userLanguagePreference = await BiometricAlerts.getUserLanguagePreference(model.PatientUserId);
            oxygenAlertModel.OxygenNotification = {
                severity : notification.severity,
                range    : notification.range,
                title    : notification.title[userLanguagePreference] ??
                notification.title[BiometricAlerts.DEFAULT_USER_LANGUAGE_PREFERENCE],
                message : notification.message[userLanguagePreference] ??
                notification.message[BiometricAlerts.DEFAULT_USER_LANGUAGE_PREFERENCE]
            };

            await biometricAlertHandler.bloodOxygenSaturationAlert(oxygenAlertModel, metaData);
        } catch (error) {
            Logger.instance().log(`Error in sending blood oxygen saturation alert notification : ${error}`);
        }
    }
    
    static async forBodyBMI(bodyWeightRecord: BodyWeightDto,
        bodyHeightRecord: BodyHeightDto,
        notificationChannel: NotificationChannel = NotificationChannel.MobilePush,
        metaData: BiometricAlertSettings | null = null) {
        try {
            const bmi = BiometricAlerts.calculateBMI(bodyWeightRecord.BodyWeight, bodyHeightRecord.BodyHeight);

            const notification = BiometricAlerts.getBmiNotification(bmi);
            if (!notification || notification?.severity === Severity.NORMAL) {
                return;
            }
            const biometricAlertHandler = BiometricAlerts.getBiometricAlertHandler(notificationChannel);
            if (!biometricAlertHandler) {
                throw new ApiError(500, 'Biometric alert handler not found.');
            }
            const bmiAlertModel: BodyBmiAlertCreateModel = {};
            bmiAlertModel.PatientUserId = bodyWeightRecord.PatientUserId;
            bmiAlertModel.Bmi = bmi;
            const userLanguagePreference = await BiometricAlerts.getUserLanguagePreference(bodyWeightRecord.PatientUserId);
            bmiAlertModel.BmiNotification = {
                severity : notification.severity,
                range    : notification.range,
                title    : notification.title[userLanguagePreference] ??
                notification.title[BiometricAlerts.DEFAULT_USER_LANGUAGE_PREFERENCE],
                message : notification.message[userLanguagePreference] ??
                notification.message[BiometricAlerts.DEFAULT_USER_LANGUAGE_PREFERENCE]
            };
            
            await biometricAlertHandler.bmiAlert(bmiAlertModel, metaData);
        } catch (error) {
            Logger.instance().log(`Error in sending body temperature alert notification : ${error}`);
        }
    }

    private static getBloodPressureNotification = (systolic: number, diastolic: number): AlertNotification | null => {
        let systolicCategory: BloodPressureCategory;
        let diastolicCategory: BloodPressureCategory;

        if (systolic > 180) {
            systolicCategory = BloodPressureCategory.HypertensiveCrisis;
        } else if (systolic >= 140) {
            systolicCategory = BloodPressureCategory.HypertensionStage2;
        } else if (systolic >= 130) {
            systolicCategory = BloodPressureCategory.HypertensionStage1;
        } else if (systolic >= 120) {
            systolicCategory = BloodPressureCategory.Elevated;
        } else {
            systolicCategory = BloodPressureCategory.Normal;
        }

        if (diastolic > 120) {
            diastolicCategory = BloodPressureCategory.HypertensiveCrisis;
        } else if (diastolic >= 90) {
            diastolicCategory = BloodPressureCategory.HypertensionStage2;
        } else if (diastolic >= 80) {
            diastolicCategory = BloodPressureCategory.HypertensionStage1;
        } else {
            diastolicCategory = BloodPressureCategory.Normal;
        }
        const category =  systolicCategory > diastolicCategory ? systolicCategory : diastolicCategory;
        const bloodPressureCategory : Severity|null = BiometricAlerts.getSeverity(category);
        return bloodPressureNotificationTemplate.find(template => template.severity === bloodPressureCategory) || null;
    };

    private static getSeverity = (category: BloodPressureCategory): Severity|null => {
        switch (category) {
            case BloodPressureCategory.HypertensiveCrisis:
                return Severity.HYPERTENSIVE_CRISIS;
            case BloodPressureCategory.HypertensionStage2:
                return Severity.HYPERTENSION_STAGE2;
            case BloodPressureCategory.HypertensionStage1:
                return Severity.HYPERTENSION_STAGE1;
            case BloodPressureCategory.Elevated:
                return Severity.ELEVATED;
            case BloodPressureCategory.Normal:
                return Severity.NORMAL;
            default:
                return null;
        }
    };

    private static async getUserLanguagePreference(patientUserId: string): Promise<string> {
        try {
            const _userService = BiometricAlerts.resolveUserServiceDependency();
            const user = await _userService.getById(patientUserId);
            return user?.PreferredLanguage || SupportedLanguage.English;
        }
        catch (error) {
            Logger.instance().log(`Error in getting user language preference : ${error}`);
            return SupportedLanguage.English;
        }
    }

    private static getBiometricAlertHandler(notificationChannel: NotificationChannel):
    BiometricAlerNotificationHandler | BiometricAlertMessagingHandler {
        try {
            switch (notificationChannel) {
                case NotificationChannel.WhatsappMeta:
                    return Injector.Container.resolve(BiometricAlertMessagingHandler);
                default:
                    return Injector.Container.resolve(BiometricAlerNotificationHandler);
            }
        } catch (error) {
            Logger.instance().log(`Error in getting biometric alert handler: ${error}`);
            return null;
        }
    }

    private static getGlucoseNotification = (glucoseValue: number): AlertNotification | null => {
        if (glucoseValue < GLUCOSE_LOW_THRESHOLD) {
            return glucoseNotificationTemplate.find(template => template.severity === Severity.LOW) || null;
        } else if (glucoseValue >= GLUCOSE_NORMAL_MIN && glucoseValue <= GLUCOSE_NORMAL_MAX) {
            return glucoseNotificationTemplate.find(template => template.severity === Severity.NORMAL) || null;
        } else if (glucoseValue >= GLUCOSE_HIGH_MIN && glucoseValue <= GLUCOSE_HIGH_MAX) {
            return glucoseNotificationTemplate.find(template => template.severity === Severity.HIGH) || null;
        } else if (glucoseValue >= GLUCOSE_VERY_HIGH_THRESHOLD) {
            return glucoseNotificationTemplate.find(template => template.severity === Severity.VERY_HIGH) || null;
        }
        return null;
    };

    private static getPulseNotification = (pulseValue: number): AlertNotification | null => {
        if (pulseValue < PULSE_LOW_THRESHOLD) {
            return pulseNotificationTemplate.find(template => template.severity === Severity.LOW) || null;
        } else if (pulseValue >= PULSE_NORMAL_MIN && pulseValue <= PULSE_NORMAL_MAX) {
            return pulseNotificationTemplate.find(template => template.severity === Severity.NORMAL) || null;
        } else if (pulseValue > PULSE_HIGH_THRESHOLD) {
            return pulseNotificationTemplate.find(template => template.severity === Severity.HIGH) || null;
        }
        return null;
    };

    private static getTemperatureNotification = (temperatureValue: number): AlertNotification | null => {
        if (temperatureValue < TEMP_LOW_THRESHOLD) {
            return bodyTemperatureNotificationTemplate.find(template => template.severity === Severity.LOW) || null;
        } else if (temperatureValue >= TEMP_NORMAL_MIN && temperatureValue <= TEMP_NORMAL_MAX) {
            return bodyTemperatureNotificationTemplate.find(template => template.severity === Severity.NORMAL) || null;
        } else if (temperatureValue >= TEMP_ELEVATED_MIN && temperatureValue <= TEMP_ELEVATED_MAX) {
            return bodyTemperatureNotificationTemplate.find(template => template.severity === Severity.ELEVATED) || null;
        } else if (temperatureValue >= TEMP_FEVER_MIN && temperatureValue <= TEMP_FEVER_MAX) {
            return bodyTemperatureNotificationTemplate.find(template => template.severity === Severity.HIGH) || null;
        } else if (temperatureValue >= TEMP_HIGH_THRESHOLD) {
            return bodyTemperatureNotificationTemplate.find(template => template.severity === Severity.VERY_HIGH) || null;
        }
        return null;
    };

    private static getBmiNotification = (bmi: number): AlertNotification | null => {
        if (bmi < BMI_UNDERWEIGHT_THRESHOLD) {
            return weightNotificationTemplate.find(template => template.severity === Severity.LOW) || null;
        } else if (bmi >= BMI_NORMAL_MIN && bmi <= BMI_NORMAL_MAX) {
            return weightNotificationTemplate.find(template => template.severity === Severity.NORMAL) || null;
        } else if (bmi >= BMI_OVERWEIGHT_MIN && bmi <= BMI_OVERWEIGHT_MAX) {
            return weightNotificationTemplate.find(template => template.severity === Severity.HIGH) || null;
        } else if (bmi >= BMI_OBESE_THRESHOLD) {
            return weightNotificationTemplate.find(template => template.severity === Severity.VERY_HIGH) || null;
        }
        return null;
    };

    private static getOxygenNotification = (oxygenValue: number): AlertNotification | null => {
        if (oxygenValue < OXYGEN_LOW_THRESHOLD) {
            return bloodOxygenNotificationTemplate.find(template => template.severity === Severity.LOW) || null;
        } else if (oxygenValue >= OXYGEN_LOW_RANGE_MIN && oxygenValue <= (OXYGEN_NORMAL_MIN - 1)) {
            return bloodOxygenNotificationTemplate.find(template => template.severity === Severity.HIGH) || null;
        } else if (oxygenValue >= OXYGEN_NORMAL_MIN && oxygenValue <= OXYGEN_NORMAL_MAX) {
            return bloodOxygenNotificationTemplate.find(template => template.severity === Severity.NORMAL) || null;
        }
        return null;
    };

    private static calculateBMI = (bodyWeightKg: number, bodyHeightCm: number): number =>{
        const heightInMeters = bodyHeightCm / 100;
        
        const bmi = bodyWeightKg / (heightInMeters * heightInMeters);
        
        return bmi;
    };

}
