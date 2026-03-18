import { Logger } from "../../../common/logger";
import { BiometricAlertNotificationHandler } from "./biometrics.alert.notification.handler";
import { AlertNotification, BiometricAlertSettings, Severity } from "../../../domain.types/clinical/biometrics/biometrics.types";
import { BloodPressureDto } from "../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.dto";
import { BloodPressureAlertModel, bloodPressureNotificationTemplate } from "../../../domain.types/clinical/biometrics/alert.notificattion/blood.pressure";
import { Injector } from "../../../startup/injector";
import { UserService } from "../../../services/users/user/user.service";
import { SupportedLanguage } from "../../../domain.types/users/user/user.types";
import { NotificationChannel } from "../../../domain.types/general/notification/notification.types";
import { BiometricAlertBotHandler } from "./biometrics.alert.bot.handler";
import { ApiError } from "../../../common/api.error";
import { BloodGlucoseDto } from "../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.dto";
import { BloodGlucoseAlertModel } from "../../../domain.types/clinical/biometrics/alert.notificattion/blood.glucose";
import { GLUCOSE_LOW_THRESHOLD } from "../../../domain.types/clinical/biometrics/alert.notificattion/blood.glucose";
import { glucoseNotificationTemplate } from "../../../domain.types/clinical/biometrics/alert.notificattion/blood.glucose";
import { GLUCOSE_NORMAL_MIN } from "../../../domain.types/clinical/biometrics/alert.notificattion/blood.glucose";
import { GLUCOSE_NORMAL_MAX } from "../../../domain.types/clinical/biometrics/alert.notificattion/blood.glucose";
import { GLUCOSE_HIGH_MIN } from "../../../domain.types/clinical/biometrics/alert.notificattion/blood.glucose";
import { GLUCOSE_HIGH_MAX } from "../../../domain.types/clinical/biometrics/alert.notificattion/blood.glucose";
import { GLUCOSE_VERY_HIGH_THRESHOLD } from "../../../domain.types/clinical/biometrics/alert.notificattion/blood.glucose";
import { PULSE_HIGH_THRESHOLD, PULSE_LOW_THRESHOLD, PULSE_NORMAL_MAX, PULSE_NORMAL_MIN, PulseAlertModel, pulseNotificationTemplate } from "../../../domain.types/clinical/biometrics/alert.notificattion/pulse";
import { PulseDto } from "../../../domain.types/clinical/biometrics/pulse/pulse.dto";
import { BodyTemperatureDto } from "../../../domain.types/clinical/biometrics/body.temperature/body.temperature.dto";
import { BodyTemperatureAlertModel, bodyTemperatureNotificationTemplate, bodyTemperatureUnits, TEMP_ELEVATED_MAX, TEMP_ELEVATED_MIN, TEMP_FEVER_MAX, TEMP_FEVER_MIN, TEMP_HIGH_THRESHOLD, TEMP_LOW_THRESHOLD, TEMP_NORMAL_MAX, TEMP_NORMAL_MIN } from "../../../domain.types/clinical/biometrics/alert.notificattion/body.temperature";
import { BloodOxygenSaturationDto } from "../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.dto";
import { BloodOxygenAlertModel, OXYGEN_NORMAL_MAX, OXYGEN_NORMAL_MIN, bloodOxygenNotificationTemplate, OXYGEN_LOW_RANGE_MIN, OXYGEN_LOW_THRESHOLD } from "../../../domain.types/clinical/biometrics/alert.notificattion/blood.oxygen.saturation";
import { BMI_OBESE_THRESHOLD, BMI_OVERWEIGHT_MAX, BMI_NORMAL_MAX, BMI_NORMAL_MIN, BMI_UNDERWEIGHT_THRESHOLD, BodyBmiAlertModel, weightNotificationTemplate, BMI_OVERWEIGHT_MIN } from "../../../domain.types/clinical/biometrics/alert.notificattion/body.bmi";
import { BodyWeightAlertModel, bodyWeightNotificationTemplate, WEIGHT_NORMAL_MAX, WEIGHT_NORMAL_MIN, WEIGHT_OBESE_THRESHOLD, WEIGHT_OVERWEIGHT_MAX, WEIGHT_OVERWEIGHT_MIN, WEIGHT_UNDERWEIGHT_THRESHOLD, weightUnitsInPounds } from "../../../domain.types/clinical/biometrics/alert.notificattion/body.weight";
import { BodyWeightDto } from "../../../domain.types/clinical/biometrics/body.weight/body.weight.dto";
import { BodyHeightDto } from "../../../domain.types/clinical/biometrics/body.height/body.height.dto";
import { BiometricAlertEmailHandler } from "./biometrics.alert.email.handler";
import { BiometricAlertSmsHandler } from "./biometrics.alert.sms.handler";
import { TenantSettingsService } from "../../../services/tenant/tenant.settings.service";
import { ThresholdCategory, VitalThresholdConfig, VitalsThresholds } from "../../../domain.types/tenant/vitals.thresholds.types";

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

    private static resolveTenantSettingsService(): TenantSettingsService {
        return Injector.Container.resolve(TenantSettingsService);
    }

    private static async getThresholdsForTenant(tenantId?: string): Promise<VitalsThresholds | null> {
        if (!tenantId) {
            return null;
        }
        try {
            const tenantSettingsService = BiometricAlerts.resolveTenantSettingsService();
            return await tenantSettingsService.getVitalsThresholds(tenantId);
        } catch (error) {
            Logger.instance().log(`Error fetching tenant thresholds: ${error}`);
            return null;
        }
    }

    private static evaluateSingleValueThreshold(
        value: number,
        config: VitalThresholdConfig,
        measurementName: string
    ): ThresholdCategory | null {
        if (!config || !config.Enabled || !config.Categories) {
            return null;
        }

        const sortedCategories = [...config.Categories].sort((a, b) => a.Priority - b.Priority);

        for (const category of sortedCategories) {
            const range = category.Ranges[measurementName];
            if (!range) {
                continue;
            }

            const minOk = range.Min === undefined || range.Min === null || value >= range.Min;
            const maxOk = range.Max === undefined || range.Max === null || value <= range.Max;

            if (minOk && maxOk) {
                return category;
            }
        }

        return null;
    }

    private static evaluateBloodPressureThreshold(
        systolic: number,
        diastolic: number,
        config: VitalThresholdConfig
    ): ThresholdCategory | null {
        if (!config || !config.Enabled || !config.Categories) {
            return null;
        }

        const mode = config.EvaluationMode ?? 'independent';

        if (mode === 'combined') {
            return BiometricAlerts.evaluateBPCombined(systolic, diastolic, config);
        }

        return BiometricAlerts.evaluateBPIndependent(systolic, diastolic, config);
    }

    private static evaluateBPCombined(
        systolic: number,
        diastolic: number,
        config: VitalThresholdConfig
    ): ThresholdCategory | null {
        const sorted = [...config.Categories].sort((a, b) => a.Priority - b.Priority);

        for (const category of sorted) {
            const sysRange = category.Ranges["Systolic"];
            const diaRange = category.Ranges["Diastolic"];
            if (!sysRange || !diaRange) {
                continue;
            }

            const sysOk = (sysRange.Min == null || systolic >= sysRange.Min) &&
                          (sysRange.Max == null || systolic <= sysRange.Max);
            const diaOk = (diaRange.Min == null || diastolic >= diaRange.Min) &&
                          (diaRange.Max == null || diastolic <= diaRange.Max);

            if (sysOk && diaOk) {
                return category;
            }
        }

        return null;
    }

    private static evaluateBPIndependent(
        systolic: number,
        diastolic: number,
        config: VitalThresholdConfig
    ): ThresholdCategory | null {
        let systolicCategory: ThresholdCategory | null = null;
        for (const category of config.Categories) {
            const systolicRange = category.Ranges["Systolic"];
            if (!systolicRange) {
                continue;
            }
            const minOk = systolicRange.Min == null || systolic >= systolicRange.Min;
            const maxOk = systolicRange.Max == null || systolic <= systolicRange.Max;
            if (minOk && maxOk) {
                systolicCategory = category;
                break;
            }
        }

        let diastolicCategory: ThresholdCategory | null = null;
        for (const category of config.Categories) {
            const diastolicRange = category.Ranges["Diastolic"];
            if (!diastolicRange) {
                continue;
            }
            const minOk = diastolicRange.Min == null || diastolic >= diastolicRange.Min;
            const maxOk = diastolicRange.Max == null || diastolic <= diastolicRange.Max;
            if (minOk && maxOk) {
                diastolicCategory = category;
                break;
            }
        }

        if (!systolicCategory && !diastolicCategory) {
            return null;
        }
        if (!systolicCategory) {
            return diastolicCategory;
        }
        if (!diastolicCategory) {
            return systolicCategory;
        }

        return systolicCategory.Priority >= diastolicCategory.Priority
            ? systolicCategory
            : diastolicCategory;
    }

    private static buildAlertFromCategory(category: ThresholdCategory): AlertNotification {
        return {
            severity : category.Severity,
            range    : category.Category,
            title    : category.AlertMessage,
            message  : category.AlertMessage
        };
    }

    static async forBloodGlucose(
        model: BloodGlucoseDto,
        notificationChannel: NotificationChannel = NotificationChannel.MobilePush,
        metaData: BiometricAlertSettings | null = null,
        tenantId?: string
    ) {
        try {
            const thresholds = await BiometricAlerts.getThresholdsForTenant(tenantId);
            const glucoseConfig = thresholds?.BloodGlucose;

            let notification: AlertNotification | null = null;
            let shouldSendAlert = true;

            if (glucoseConfig && glucoseConfig.Enabled) {
                const category = BiometricAlerts.evaluateSingleValueThreshold(
                    model.BloodGlucose,
                    glucoseConfig,
                    "BloodGlucose"
                );
                if (category) {
                    shouldSendAlert = category.SendAlert;
                    if (shouldSendAlert) {
                        notification = BiometricAlerts.buildAlertFromCategory(category);
                    }
                }
            } else {
                notification = BiometricAlerts.getGlucoseNotification(model.BloodGlucose);
            }

            if (!notification || !shouldSendAlert) {
                throw new Error('No alert to send for the given blood glucose value.');
            }

            const biometricAlertHandler = BiometricAlerts.getBiometricAlertHandler(notificationChannel);
            if (!biometricAlertHandler) {
                throw new ApiError(500, 'Biometric alert handler not found.');
            }
            const glucoseAlertmodel: BloodGlucoseAlertModel = {};
            glucoseAlertmodel.PatientUserId = model.PatientUserId;
            glucoseAlertmodel.BloodGlucose = model.BloodGlucose;
            glucoseAlertmodel.BiometricAlertSettings = metaData;
            const userLanguagePreference = await BiometricAlerts.getUserLanguagePreference(model.PatientUserId);
            glucoseAlertmodel.GlucoseNotification = {
                severity : notification.severity,
                range    : notification.range,
                title    : notification.title[userLanguagePreference] ??
                notification.title[BiometricAlerts.DEFAULT_USER_LANGUAGE_PREFERENCE],
                message : notification.message[userLanguagePreference] ??
                notification.message[BiometricAlerts.DEFAULT_USER_LANGUAGE_PREFERENCE]
            };
            await biometricAlertHandler.bloodGlucoseAlert(glucoseAlertmodel);
        } catch (error) {
            Logger.instance().log(`Error in sending blood glucose alert notification : ${error}`);
        }
    }
    
    static async forBloodPressure(
        model: BloodPressureDto,
        notificationChannel: NotificationChannel = NotificationChannel.MobilePush,
        metaData: BiometricAlertSettings | null = null,
        tenantId?: string
    ) {
        try {
            const biometricAlertHandler = BiometricAlerts.getBiometricAlertHandler(notificationChannel);
            if (!biometricAlertHandler) {
                throw new ApiError(500, 'Biometric alert handler not found.');
            }

            const thresholds = await BiometricAlerts.getThresholdsForTenant(tenantId);
            const bpConfig = thresholds?.BloodPressure;

            let notification: AlertNotification | null = null;
            let shouldSendAlert = true;

            if (bpConfig && bpConfig.Enabled) {
                const category = BiometricAlerts.evaluateBloodPressureThreshold(
                    model.Systolic,
                    model.Diastolic,
                    bpConfig
                );
                if (category) {
                    shouldSendAlert = category.SendAlert;
                    if (shouldSendAlert) {
                        notification = BiometricAlerts.buildAlertFromCategory(category);
                    }
                }
            } else {
                notification = BiometricAlerts.getBloodPressureNotification(model.Systolic, model.Diastolic);
            }

            if (!notification || !shouldSendAlert) {
                throw new Error('No alert to send for the given blood pressure values.');
            }

            const bloodPressureAlertmodel: BloodPressureAlertModel = {};
            bloodPressureAlertmodel.PatientUserId = model.PatientUserId;
            bloodPressureAlertmodel.Systolic = model.Systolic;
            bloodPressureAlertmodel.Diastolic = model.Diastolic;
            bloodPressureAlertmodel.BiometricAlertSettings = metaData;

            const userLanguagePreference = await BiometricAlerts.getUserLanguagePreference(model.PatientUserId);
            bloodPressureAlertmodel.BloodPressureNotification = {
                severity : notification.severity,
                range    : notification.range,
                title    : notification.title[userLanguagePreference] ??
                notification.title[BiometricAlerts.DEFAULT_USER_LANGUAGE_PREFERENCE],
                message : notification.message[userLanguagePreference] ??
                notification.message[BiometricAlerts.DEFAULT_USER_LANGUAGE_PREFERENCE]
            };

            await biometricAlertHandler.bloodPressureAlert(bloodPressureAlertmodel);
        } catch (error) {
            Logger.instance().log(`Error in sending blood pressure alert notification : ${error}`);
        }
    }

    static async forPulse(
        model: PulseDto,
        notificationChannel: NotificationChannel = NotificationChannel.MobilePush,
        metaData: BiometricAlertSettings | null = null,
        tenantId?: string
    ) {
        try {
            Logger.instance().log(`Processing pulse alert for model: ${JSON.stringify(model)}`);

            const thresholds = await BiometricAlerts.getThresholdsForTenant(tenantId);
            const pulseConfig = thresholds?.Pulse;

            let notification: AlertNotification | null = null;
            let shouldSendAlert = true;

            if (pulseConfig && pulseConfig.Enabled) {
                const category = BiometricAlerts.evaluateSingleValueThreshold(
                    model.Pulse!,
                    pulseConfig,
                    "Pulse"
                );
                if (category) {
                    shouldSendAlert = category.SendAlert;
                    if (shouldSendAlert) {
                        notification = BiometricAlerts.buildAlertFromCategory(category);
                    }
                }
            } else {
                notification = BiometricAlerts.getPulseNotification(model.Pulse!);
            }

            if (!notification || !shouldSendAlert) {
                throw new Error('No alert to send for the given pulse value.');
            }

            const biometricAlertHandler = BiometricAlerts.getBiometricAlertHandler(notificationChannel);
            if (!biometricAlertHandler) {
                throw new ApiError(500, 'Biometric alert handler not found.');
            }
            const pulseAlertModel: PulseAlertModel = {};
            pulseAlertModel.PatientUserId = model.PatientUserId;
            pulseAlertModel.Pulse = model.Pulse;
            pulseAlertModel.BiometricAlertSettings = metaData;

            const userLanguagePreference = await BiometricAlerts.getUserLanguagePreference(model.PatientUserId);
            pulseAlertModel.PulseNotification = {
                severity : notification.severity,
                range    : notification.range,
                title    : notification.title[userLanguagePreference] ??
                notification.title[BiometricAlerts.DEFAULT_USER_LANGUAGE_PREFERENCE],
                message : notification.message[userLanguagePreference] ??
                notification.message[BiometricAlerts.DEFAULT_USER_LANGUAGE_PREFERENCE]
            };

            Logger.instance().log(`Sending pulse alert notification`);
            await biometricAlertHandler.pulseAlert(pulseAlertModel);
        } catch (error) {
            Logger.instance().log(`Error in sending pulse alert notification : ${error}`);
        }
    }
    
    static async forBodyTemperature(
        model: BodyTemperatureDto,
        notificationChannel: NotificationChannel = NotificationChannel.MobilePush,
        metaData: BiometricAlertSettings | null = null,
        tenantId?: string
    ) {
        try {
            const tempInFarenheit = bodyTemperatureUnits.includes(model.Unit?.toLowerCase()) ?
                (model.BodyTemperature * 1.8) + 32 : model.BodyTemperature;

            const thresholds = await BiometricAlerts.getThresholdsForTenant(tenantId);
            const tempConfig = thresholds?.BodyTemperature;

            let notification: AlertNotification | null = null;
            let shouldSendAlert = true;

            if (tempConfig && tempConfig.Enabled) {
                const category = BiometricAlerts.evaluateSingleValueThreshold(
                    tempInFarenheit,
                    tempConfig,
                    "BodyTemperature"
                );
                if (category) {
                    shouldSendAlert = category.SendAlert;
                    if (shouldSendAlert) {
                        notification = BiometricAlerts.buildAlertFromCategory(category);
                    }
                }
            } else {
                notification = BiometricAlerts.getTemperatureNotification(tempInFarenheit);
            }

            if (!notification || !shouldSendAlert) {
                throw new Error('No alert to send for the given body temperature value.');
            }

            const biometricAlertHandler = BiometricAlerts.getBiometricAlertHandler(notificationChannel);
            if (!biometricAlertHandler) {
                throw new ApiError(500, 'Biometric alert handler not found.');
            }
            const userLanguagePreference = await BiometricAlerts.getUserLanguagePreference(model.PatientUserId);
            const temperatureAlertModel: BodyTemperatureAlertModel = {};
            temperatureAlertModel.PatientUserId = model.PatientUserId;
            temperatureAlertModel.BodyTemperature = model.BodyTemperature;
            temperatureAlertModel.BiometricAlertSettings = metaData;

            temperatureAlertModel.TemperatureNotification = {
                severity : notification.severity,
                range    : notification.range,
                title    : notification.title[userLanguagePreference] ??
                notification.title[BiometricAlerts.DEFAULT_USER_LANGUAGE_PREFERENCE],
                message : notification.message[userLanguagePreference] ??
                notification.message[BiometricAlerts.DEFAULT_USER_LANGUAGE_PREFERENCE]
            };

            await biometricAlertHandler.bodyTemperatureAlert(temperatureAlertModel);
        } catch (error) {
            Logger.instance().log(`Error in sending body temperature alert notification : ${error}`);
        }
    }

    static async forBloodOxygenSaturation(
        model: BloodOxygenSaturationDto,
        notificationChannel: NotificationChannel = NotificationChannel.MobilePush,
        metaData: BiometricAlertSettings | null = null,
        tenantId?: string
    ) {
        try {
            const thresholds = await BiometricAlerts.getThresholdsForTenant(tenantId);
            const oxygenConfig = thresholds?.BloodOxygenSaturation;

            let notification: AlertNotification | null = null;
            let shouldSendAlert = true;

            if (oxygenConfig && oxygenConfig.Enabled) {
                const category = BiometricAlerts.evaluateSingleValueThreshold(
                    model.BloodOxygenSaturation,
                    oxygenConfig,
                    "BloodOxygenSaturation"
                );
                if (category) {
                    shouldSendAlert = category.SendAlert;
                    if (shouldSendAlert) {
                        notification = BiometricAlerts.buildAlertFromCategory(category);
                    }
                }
            } else {
                notification = BiometricAlerts.getOxygenNotification(model.BloodOxygenSaturation);
            }

            if (!notification || !shouldSendAlert) {
                throw new Error('No alert to send for the given blood oxygen saturation value.');
            }

            const biometricAlertHandler = BiometricAlerts.getBiometricAlertHandler(notificationChannel);
            if (!biometricAlertHandler) {
                throw new ApiError(500, 'Biometric alert handler not found.');
            }
            const oxygenAlertModel: BloodOxygenAlertModel = {};
            oxygenAlertModel.PatientUserId = model.PatientUserId;
            oxygenAlertModel.BloodOxygenSaturation = model.BloodOxygenSaturation;
            oxygenAlertModel.BiometricAlertSettings = metaData;

            const userLanguagePreference = await BiometricAlerts.getUserLanguagePreference(model.PatientUserId);
            oxygenAlertModel.OxygenNotification = {
                severity : notification.severity,
                range    : notification.range,
                title    : notification.title[userLanguagePreference] ??
                notification.title[BiometricAlerts.DEFAULT_USER_LANGUAGE_PREFERENCE],
                message : notification.message[userLanguagePreference] ??
                notification.message[BiometricAlerts.DEFAULT_USER_LANGUAGE_PREFERENCE]
            };

            await biometricAlertHandler.bloodOxygenSaturationAlert(oxygenAlertModel);
        } catch (error) {
            Logger.instance().log(`Error in sending blood oxygen saturation alert notification : ${error}`);
        }
    }
    
    static async forBodyBMI(
        bodyWeightRecord: BodyWeightDto,
        bodyHeightRecord: BodyHeightDto,
        notificationChannel: NotificationChannel = NotificationChannel.MobilePush,
        metaData: BiometricAlertSettings | null = null,
        tenantId?: string
    ) {
        try {
            const bmi = BiometricAlerts.calculateBMI(bodyWeightRecord.BodyWeight, bodyHeightRecord.BodyHeight);

            const thresholds = await BiometricAlerts.getThresholdsForTenant(tenantId);
            const bmiConfig = thresholds?.BodyBmi;

            let notification: AlertNotification | null = null;
            let shouldSendAlert = true;

            if (bmiConfig && bmiConfig.Enabled) {
                const category = BiometricAlerts.evaluateSingleValueThreshold(
                    bmi,
                    bmiConfig,
                    "BMI"
                );
                if (category) {
                    shouldSendAlert = category.SendAlert;
                    if (shouldSendAlert) {
                        notification = BiometricAlerts.buildAlertFromCategory(category);
                    }
                }
            } else {
                notification = BiometricAlerts.getBmiNotification(bmi);
            }

            if (!notification || !shouldSendAlert) {
                throw new Error('No alert to send for the given BMI value.');
            }

            const biometricAlertHandler = BiometricAlerts.getBiometricAlertHandler(notificationChannel);
            if (!biometricAlertHandler) {
                throw new ApiError(500, 'Biometric alert handler not found.');
            }
            const bmiAlertModel: BodyBmiAlertModel = {};
            bmiAlertModel.PatientUserId = bodyWeightRecord.PatientUserId;
            bmiAlertModel.Bmi = bmi;
            bmiAlertModel.BiometricAlertSettings = metaData;

            const userLanguagePreference = await BiometricAlerts
                .getUserLanguagePreference(bodyWeightRecord.PatientUserId);
            bmiAlertModel.BmiNotification = {
                severity : notification.severity,
                range    : notification.range,
                title    : notification.title[userLanguagePreference] ??
                notification.title[BiometricAlerts.DEFAULT_USER_LANGUAGE_PREFERENCE],
                message : notification.message[userLanguagePreference] ??
                notification.message[BiometricAlerts.DEFAULT_USER_LANGUAGE_PREFERENCE]
            };

            await biometricAlertHandler.bmiAlert(bmiAlertModel);
        } catch (error) {
            Logger.instance().log(`Error in sending BMI alert notification : ${error}`);
        }
    }

    static async forBodyWeight(
        model: BodyWeightDto,
        notificationChannel: NotificationChannel = NotificationChannel.MobilePush,
        metaData: BiometricAlertSettings | null = null,
        tenantId?: string
    ) {
        try {
            const weightInKg = weightUnitsInPounds.includes(model.Unit?.toLowerCase())
                ? model.BodyWeight * 0.453592
                : model.BodyWeight;

            const thresholds = await BiometricAlerts.getThresholdsForTenant(tenantId);
            const weightConfig = thresholds?.BodyWeight;

            let notification: AlertNotification | null = null;
            let shouldSendAlert = true;

            if (weightConfig && weightConfig.Enabled) {
                const category = BiometricAlerts.evaluateSingleValueThreshold(
                    weightInKg,
                    weightConfig,
                    "BodyWeight"
                );
                if (category) {
                    shouldSendAlert = category.SendAlert;
                    if (shouldSendAlert) {
                        notification = BiometricAlerts.buildAlertFromCategory(category);
                    }
                }
            } else {
                notification = BiometricAlerts.getWeightNotification(weightInKg);
            }

            if (!notification || !shouldSendAlert) {
                throw new Error('No alert to send for the given body weight value.');
            }

            const biometricAlertHandler = BiometricAlerts.getBiometricAlertHandler(notificationChannel);
            if (!biometricAlertHandler) {
                throw new ApiError(500, 'Biometric alert handler not found.');
            }

            const weightAlertModel: BodyWeightAlertModel = {};
            weightAlertModel.PatientUserId = model.PatientUserId;
            weightAlertModel.BodyWeight = model.BodyWeight;
            weightAlertModel.BiometricAlertSettings = metaData;

            const userLanguagePreference = await BiometricAlerts.getUserLanguagePreference(model.PatientUserId);
            weightAlertModel.WeightNotification = {
                severity : notification.severity,
                range    : notification.range,
                title    : notification.title[userLanguagePreference] ??
                    notification.title[BiometricAlerts.DEFAULT_USER_LANGUAGE_PREFERENCE],
                message : notification.message[userLanguagePreference] ??
                    notification.message[BiometricAlerts.DEFAULT_USER_LANGUAGE_PREFERENCE]
            };

            await biometricAlertHandler.bodyWeightAlert(weightAlertModel);
        } catch (error) {
            Logger.instance().log(`Error in sending body weight alert notification : ${error}`);
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
    BiometricAlertNotificationHandler | BiometricAlertBotHandler | BiometricAlertEmailHandler | BiometricAlertSmsHandler {
        try {
            switch (notificationChannel) {
                case NotificationChannel.WhatsappMeta:
                    return Injector.Container.resolve(BiometricAlertBotHandler);

                case NotificationChannel.SMS:
                    return Injector.Container.resolve(BiometricAlertSmsHandler);

                case NotificationChannel.Email:
                    return Injector.Container.resolve(BiometricAlertEmailHandler);

                case NotificationChannel.Telegram:
                    return Injector.Container.resolve(BiometricAlertBotHandler);

                case NotificationChannel.MobilePush:
                    return Injector.Container.resolve(BiometricAlertNotificationHandler);
                
                default:
                    return Injector.Container.resolve(BiometricAlertNotificationHandler);
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

    private static getWeightNotification = (weightInKg: number): AlertNotification | null => {
        if (weightInKg < WEIGHT_UNDERWEIGHT_THRESHOLD) {
            return bodyWeightNotificationTemplate.find(template => template.severity === Severity.LOW) || null;
        } else if (weightInKg >= WEIGHT_NORMAL_MIN && weightInKg <= WEIGHT_NORMAL_MAX) {
            return bodyWeightNotificationTemplate.find(template => template.severity === Severity.NORMAL) || null;
        } else if (weightInKg >= WEIGHT_OVERWEIGHT_MIN && weightInKg <= WEIGHT_OVERWEIGHT_MAX) {
            return bodyWeightNotificationTemplate.find(template => template.severity === Severity.HIGH) || null;
        } else if (weightInKg >= WEIGHT_OBESE_THRESHOLD) {
            return bodyWeightNotificationTemplate.find(template => template.severity === Severity.VERY_HIGH) || null;
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
