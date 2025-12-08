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
import { BodyWeightDto } from "../../../domain.types/clinical/biometrics/body.weight/body.weight.dto";
import { BodyHeightDto } from "../../../domain.types/clinical/biometrics/body.height/body.height.dto";
import { BiometricAlertEmailHandler } from "./biometrics.alert.email.handler";
import { BiometricAlertSmsHandler } from "./biometrics.alert.sms.handler";
import { VitalAlertService } from "../../../services/clinical/biometrics/vital.alert.service";
import { MatchedVitalAlert, VitalAlertSettings } from "../../../domain.types/tenant/vital.alert.settings.types";

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

    private static resolveVitalAlertServiceDependency(): VitalAlertService {
        return Injector.Container.resolve(VitalAlertService);
    }

    /**
     * Get tenant-specific vital alert settings for a patient
     */
    private static async getTenantVitalAlertSettings(patientUserId: string): Promise<VitalAlertSettings | null> {
        try {
            const vitalAlertService = BiometricAlerts.resolveVitalAlertServiceDependency();
            return await vitalAlertService.getVitalAlertSettingsForUser(patientUserId);
        } catch (error) {
            Logger.instance().log(`Error getting tenant vital alert settings: ${error}`);
            return null;
        }
    }

    /**
     * Process alert using tenant-specific rules if available
     * Returns true if tenant rules were used and alert was processed
     */
    private static async processWithTenantRules(
        patientUserId: string,
        vitalType: 'BloodPressure' | 'Pulse' | 'BloodGlucose' | 'BodyTemperature' | 'BloodOxygenSaturation' | 'BodyBmi',
        values: { [key: string]: number | string },
        notificationChannel: NotificationChannel,
        metaData: BiometricAlertSettings | null
    ): Promise<{ processed: boolean; matchedAlert: MatchedVitalAlert | null }> {
        try {
            const tenantSettings = await BiometricAlerts.getTenantVitalAlertSettings(patientUserId);
            if (!tenantSettings) {
                return { processed: false, matchedAlert: null };
            }

            const vitalAlertService = BiometricAlerts.resolveVitalAlertServiceDependency();
            let matchedAlert: MatchedVitalAlert | null = null;

            switch (vitalType) {
                case 'BloodPressure':
                    if (tenantSettings.BloodPressureRules?.length > 0) {
                        matchedAlert = vitalAlertService.matchBloodPressure(
                            values.systolic as number,
                            values.diastolic as number,
                            tenantSettings.BloodPressureRules
                        );
                    }
                    break;
                case 'Pulse':
                    if (tenantSettings.PulseRules?.length > 0) {
                        matchedAlert = vitalAlertService.matchPulse(
                            values.pulse as number,
                            tenantSettings.PulseRules
                        );
                    }
                    break;
                case 'BloodGlucose':
                    if (tenantSettings.BloodGlucoseRules?.length > 0) {
                        matchedAlert = vitalAlertService.matchBloodGlucose(
                            values.bloodGlucose as number,
                            tenantSettings.BloodGlucoseRules
                        );
                    }
                    break;
                case 'BodyTemperature':
                    if (tenantSettings.BodyTemperatureRules?.length > 0) {
                        matchedAlert = vitalAlertService.matchBodyTemperature(
                            values.temperature as number,
                            values.unit as string,
                            tenantSettings.BodyTemperatureRules
                        );
                    }
                    break;
                case 'BloodOxygenSaturation':
                    if (tenantSettings.BloodOxygenSaturationRules?.length > 0) {
                        matchedAlert = vitalAlertService.matchBloodOxygenSaturation(
                            values.oxygenSaturation as number,
                            tenantSettings.BloodOxygenSaturationRules
                        );
                    }
                    break;
                case 'BodyBmi':
                    if (tenantSettings.BodyBmiRules?.length > 0) {
                        matchedAlert = vitalAlertService.matchBodyBmi(
                            values.bmi as number,
                            tenantSettings.BodyBmiRules
                        );
                    }
                    break;
            }

            if (matchedAlert) {
                // Format the alert message with actual values
                const formattedMessage = vitalAlertService.formatAlertMessage(
                    matchedAlert.alertMessage,
                    values as { [key: string]: string | number }
                );
                matchedAlert.alertMessage = formattedMessage;
            }

            return { processed: true, matchedAlert };
        } catch (error) {
            Logger.instance().log(`Error processing tenant rules: ${error}`);
            return { processed: false, matchedAlert: null };
        }
    }

    static async forBloodGlucose(model: BloodGlucoseDto,
        notificationChannel: NotificationChannel = NotificationChannel.MobilePush,
        metaData: BiometricAlertSettings | null = null) {
        try {
            const biometricAlertHandler = BiometricAlerts.getBiometricAlertHandler(notificationChannel);
            if (!biometricAlertHandler) {
                throw new ApiError(500, 'Biometric alert handler not found.');
            }

            // Try tenant-specific rules first
            const tenantResult = await BiometricAlerts.processWithTenantRules(
                model.PatientUserId,
                'BloodGlucose',
                { BloodGlucose: model.BloodGlucose, bloodGlucose: model.BloodGlucose },
                notificationChannel,
                metaData
            );

            if (tenantResult.processed && tenantResult.matchedAlert) {
                // Use tenant-specific alert
                if (!tenantResult.matchedAlert.sendAlert) {
                    return; // sendAlert is false, skip notification
                }
                const glucoseAlertmodel: BloodGlucoseAlertModel = {};
                glucoseAlertmodel.PatientUserId = model.PatientUserId;
                glucoseAlertmodel.BloodGlucose = model.BloodGlucose;
                glucoseAlertmodel.BiometricAlertSettings = metaData;
                glucoseAlertmodel.GlucoseNotification = {
                    severity : Severity.HIGH, // Use severity based on tenant category
                    range    : tenantResult.matchedAlert.category,
                    title    : tenantResult.matchedAlert.category,
                    message  : tenantResult.matchedAlert.alertMessage
                };
                await biometricAlertHandler.bloodGlucoseAlert(glucoseAlertmodel);
                return;
            }

            // Fallback to default logic if no tenant rules
            const notification = BiometricAlerts.getGlucoseNotification(model.BloodGlucose);
            if (!notification) {
                return;
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
    
    static async forBloodPressure(model: BloodPressureDto,
        notificationChannel: NotificationChannel = NotificationChannel.MobilePush,
        metaData: BiometricAlertSettings | null = null) {
        try {
            const biometricAlertHandler = BiometricAlerts.getBiometricAlertHandler(notificationChannel);
            if (!biometricAlertHandler) {
                throw new ApiError(500, 'Biometric alert handler not found.');
            }

            // Try tenant-specific rules first
            const tenantResult = await BiometricAlerts.processWithTenantRules(
                model.PatientUserId,
                'BloodPressure',
                { Systolic: model.Systolic, Diastolic: model.Diastolic, systolic: model.Systolic, diastolic: model.Diastolic },
                notificationChannel,
                metaData
            );

            if (tenantResult.processed && tenantResult.matchedAlert) {
                // Use tenant-specific alert
                if (!tenantResult.matchedAlert.sendAlert) {
                    return; // sendAlert is false, skip notification
                }
                const bloodPressureAlertmodel: BloodPressureAlertModel = {};
                bloodPressureAlertmodel.PatientUserId = model.PatientUserId;
                bloodPressureAlertmodel.Systolic = model.Systolic;
                bloodPressureAlertmodel.Diastolic = model.Diastolic;
                bloodPressureAlertmodel.BiometricAlertSettings = metaData;
                bloodPressureAlertmodel.BloodPressureNotification = {
                    severity : Severity.HIGH,
                    range    : tenantResult.matchedAlert.category,
                    title    : tenantResult.matchedAlert.category,
                    message  : tenantResult.matchedAlert.alertMessage
                };
                await biometricAlertHandler.bloodPressureAlert(bloodPressureAlertmodel);
                return;
            }

            // Fallback to default logic if no tenant rules
            const notification = BiometricAlerts.getBloodPressureNotification(model.Systolic, model.Diastolic);
            if (!notification || notification?.severity === Severity.NORMAL) {
                return;
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

    static async forPulse(model: PulseDto,
        notificationChannel: NotificationChannel = NotificationChannel.MobilePush,
        metaData: BiometricAlertSettings | null = null) {
        try {
            Logger.instance().log(`Processing pulse alert for model: ${JSON.stringify(model)} and notification channel: ${notificationChannel}`);
            const biometricAlertHandler = BiometricAlerts.getBiometricAlertHandler(notificationChannel);
            if (!biometricAlertHandler) {
                throw new ApiError(500, 'Biometric alert handler not found.');
            }

            // Try tenant-specific rules first
            const tenantResult = await BiometricAlerts.processWithTenantRules(
                model.PatientUserId,
                'Pulse',
                { Pulse: model.Pulse, pulse: model.Pulse },
                notificationChannel,
                metaData
            );

            if (tenantResult.processed && tenantResult.matchedAlert) {
                // Use tenant-specific alert
                if (!tenantResult.matchedAlert.sendAlert) {
                    return; // sendAlert is false, skip notification
                }
                const pulseAlertModel: PulseAlertModel = {};
                pulseAlertModel.PatientUserId = model.PatientUserId;
                pulseAlertModel.Pulse = model.Pulse;
                pulseAlertModel.BiometricAlertSettings = metaData;
                pulseAlertModel.PulseNotification = {
                    severity : Severity.HIGH,
                    range    : tenantResult.matchedAlert.category,
                    title    : tenantResult.matchedAlert.category,
                    message  : tenantResult.matchedAlert.alertMessage
                };
                Logger.instance().log(`Sending tenant-specific pulse alert notification: ${JSON.stringify(pulseAlertModel)}`);
                await biometricAlertHandler.pulseAlert(pulseAlertModel);
                return;
            }

            // Fallback to default logic if no tenant rules
            const notification = BiometricAlerts.getPulseNotification(model.Pulse!);
            if (!notification || notification?.severity === Severity.NORMAL) {
                return;
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

            Logger.instance().log(`Sending pulse alert notification to biometric alert handler: ${JSON.stringify(pulseAlertModel)}`);
            await biometricAlertHandler.pulseAlert(pulseAlertModel);
        } catch (error) {
            Logger.instance().log(`Error in sending pulse alert notification : ${error}`);
        }
    }
    
    static async forBodyTemperature(model: BodyTemperatureDto,
        notificationChannel: NotificationChannel = NotificationChannel.MobilePush,
        metaData: BiometricAlertSettings | null = null) {
        try {
            const biometricAlertHandler = BiometricAlerts.getBiometricAlertHandler(notificationChannel);
            if (!biometricAlertHandler) {
                throw new ApiError(500, 'Biometric alert handler not found.');
            }

            // Try tenant-specific rules first
            const tenantResult = await BiometricAlerts.processWithTenantRules(
                model.PatientUserId,
                'BodyTemperature',
                { BodyTemperature: model.BodyTemperature, temperature: model.BodyTemperature, unit: model.Unit || 'fahrenheit' },
                notificationChannel,
                metaData
            );

            if (tenantResult.processed && tenantResult.matchedAlert) {
                // Use tenant-specific alert
                if (!tenantResult.matchedAlert.sendAlert) {
                    return; // sendAlert is false, skip notification
                }
                const temperatureAlertModel: BodyTemperatureAlertModel = {};
                temperatureAlertModel.PatientUserId = model.PatientUserId;
                temperatureAlertModel.BodyTemperature = model.BodyTemperature;
                temperatureAlertModel.BiometricAlertSettings = metaData;
                temperatureAlertModel.TemperatureNotification = {
                    severity : Severity.HIGH,
                    range    : tenantResult.matchedAlert.category,
                    title    : tenantResult.matchedAlert.category,
                    message  : tenantResult.matchedAlert.alertMessage
                };
                await biometricAlertHandler.bodyTemperatureAlert(temperatureAlertModel);
                return;
            }

            // Fallback to default logic if no tenant rules
            const tempInFarenheit = bodyTemperatureUnits.includes(model.Unit?.toLowerCase()) ?
                (model.BodyTemperature * 1.8) + 32 : model.BodyTemperature;

            const notification = BiometricAlerts.getTemperatureNotification(tempInFarenheit);
            if (!notification || notification?.severity === Severity.NORMAL) {
                return;
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

    static async forBloodOxygenSaturation(model: BloodOxygenSaturationDto,
        notificationChannel: NotificationChannel = NotificationChannel.MobilePush,
        metaData: BiometricAlertSettings | null = null) {
        try {
            const biometricAlertHandler = BiometricAlerts.getBiometricAlertHandler(notificationChannel);
            if (!biometricAlertHandler) {
                throw new ApiError(500, 'Biometric alert handler not found.');
            }

            // Try tenant-specific rules first
            const tenantResult = await BiometricAlerts.processWithTenantRules(
                model.PatientUserId,
                'BloodOxygenSaturation',
                { BloodOxygenSaturation: model.BloodOxygenSaturation, oxygenSaturation: model.BloodOxygenSaturation },
                notificationChannel,
                metaData
            );

            if (tenantResult.processed && tenantResult.matchedAlert) {
                // Use tenant-specific alert
                if (!tenantResult.matchedAlert.sendAlert) {
                    return; // sendAlert is false, skip notification
                }
                const oxygenAlertModel: BloodOxygenAlertModel = {};
                oxygenAlertModel.PatientUserId = model.PatientUserId;
                oxygenAlertModel.BloodOxygenSaturation = model.BloodOxygenSaturation;
                oxygenAlertModel.BiometricAlertSettings = metaData;
                oxygenAlertModel.OxygenNotification = {
                    severity : Severity.HIGH,
                    range    : tenantResult.matchedAlert.category,
                    title    : tenantResult.matchedAlert.category,
                    message  : tenantResult.matchedAlert.alertMessage
                };
                await biometricAlertHandler.bloodOxygenSaturationAlert(oxygenAlertModel);
                return;
            }

            // Fallback to default logic if no tenant rules
            const notification = BiometricAlerts.getOxygenNotification(model.BloodOxygenSaturation);
            if (!notification || notification?.severity === Severity.NORMAL) {
                return;
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
    
    static async forBodyBMI(bodyWeightRecord: BodyWeightDto,
        bodyHeightRecord: BodyHeightDto,
        notificationChannel: NotificationChannel = NotificationChannel.MobilePush,
        metaData: BiometricAlertSettings | null = null) {
        try {
            const bmi = BiometricAlerts.calculateBMI(bodyWeightRecord.BodyWeight, bodyHeightRecord.BodyHeight);
            const biometricAlertHandler = BiometricAlerts.getBiometricAlertHandler(notificationChannel);
            if (!biometricAlertHandler) {
                throw new ApiError(500, 'Biometric alert handler not found.');
            }

            // Try tenant-specific rules first
            const tenantResult = await BiometricAlerts.processWithTenantRules(
                bodyWeightRecord.PatientUserId,
                'BodyBmi',
                { BMI: bmi.toFixed(1), bmi: bmi },
                notificationChannel,
                metaData
            );

            if (tenantResult.processed && tenantResult.matchedAlert) {
                // Use tenant-specific alert
                if (!tenantResult.matchedAlert.sendAlert) {
                    return; // sendAlert is false, skip notification
                }
                const bmiAlertModel: BodyBmiAlertModel = {};
                bmiAlertModel.PatientUserId = bodyWeightRecord.PatientUserId;
                bmiAlertModel.Bmi = bmi;
                bmiAlertModel.BiometricAlertSettings = metaData;
                bmiAlertModel.BmiNotification = {
                    severity : Severity.HIGH,
                    range    : tenantResult.matchedAlert.category,
                    title    : tenantResult.matchedAlert.category,
                    message  : tenantResult.matchedAlert.alertMessage
                };
                await biometricAlertHandler.bmiAlert(bmiAlertModel);
                return;
            }

            // Fallback to default logic if no tenant rules
            const notification = BiometricAlerts.getBmiNotification(bmi);
            if (!notification || notification?.severity === Severity.NORMAL) {
                return;
            }
            const bmiAlertModel: BodyBmiAlertModel = {};
            bmiAlertModel.PatientUserId = bodyWeightRecord.PatientUserId;
            bmiAlertModel.Bmi = bmi;
            bmiAlertModel.BiometricAlertSettings = metaData;

            const userLanguagePreference = await BiometricAlerts.getUserLanguagePreference(bodyWeightRecord.PatientUserId);
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
