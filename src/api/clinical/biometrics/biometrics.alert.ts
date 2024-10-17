import { BloodGlucoseDto } from "../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.dto";
import { Logger } from "../../../common/logger";
import { BiometricAlertHandler } from "./biometrics.alert.handler";
import { AlertNotification, Severity } from "../../../domain.types/clinical/biometrics/biometrics.types";
import {
    BloodGlucoseAlertCreateModel,
    GLUCOSE_HIGH_MAX,
    GLUCOSE_HIGH_MIN,
    GLUCOSE_LOW_THRESHOLD,
    GLUCOSE_NORMAL_MAX,
    GLUCOSE_NORMAL_MIN,
    GLUCOSE_VERY_HIGH_THRESHOLD,
    glucoseNotificationTemplate } from "../../../domain.types/clinical/biometrics/alert.notificattion/blood.glucose";
import {
        BloodOxygenAlertCreateModel,
        OXYGEN_LOW_THRESHOLD,
        OXYGEN_NORMAL_MIN,
        OXYGEN_NORMAL_MAX,
        OXYGEN_LOW_RANGE_MIN,
        bloodOxygenNotificationTemplate
    } from "../../../domain.types/clinical/biometrics/alert.notificattion/blood.oxygen.saturation";
import { 
    BodyTemperatureAlertCreateModel,
    bodyTemperatureNotificationTemplate, 
    TEMP_LOW_THRESHOLD, 
    TEMP_NORMAL_MIN, 
    TEMP_NORMAL_MAX, 
    TEMP_ELEVATED_MIN, 
    TEMP_FEVER_MIN, TEMP_HIGH_THRESHOLD 
} from "../../../domain.types/clinical/biometrics/alert.notificattion/body.temperature";
import {
    PulseAlertCreateModel,
    PULSE_LOW_THRESHOLD,
    PULSE_NORMAL_MIN,
    PULSE_NORMAL_MAX,
    PULSE_HIGH_THRESHOLD,
    pulseNotificationTemplate
} from "../../../domain.types/clinical/biometrics/alert.notificattion/pulse";

export class BiometricAlerts {

    static async forBloodGlucose(model: BloodGlucoseDto) {
        try {
            const notification = BiometricAlerts.getGlucoseNotification(model.BloodGlucose);
            if (!notification) {
                return;
            }
            const glucoseAlertmodel: BloodGlucoseAlertCreateModel = {};
            glucoseAlertmodel.PatientUserId = model.PatientUserId;
            glucoseAlertmodel.BloodGlucose = model.BloodGlucose;
            glucoseAlertmodel.GlucoseNotification = notification;

            BiometricAlertHandler.BloodGlucoseAlert(glucoseAlertmodel);
        } catch (error) {
            Logger.instance().log(`Error in sending blood glucose alert notification : ${error}`);
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

    //for blood oxygen saturation
    static async forBloodOxygenSaturation(model: BloodOxygenAlertCreateModel) {
        try {
            const notification = BiometricAlerts.getOxygenNotification(model.BloodOxygenSaturation!);
            if (!notification) {
                return;
            }
            const oxygenAlertModel: BloodOxygenAlertCreateModel = {};
            oxygenAlertModel.PatientUserId = model.PatientUserId;
            oxygenAlertModel.BloodOxygenSaturation = model.BloodOxygenSaturation;
            oxygenAlertModel.OxygenNotification = notification;

            BiometricAlertHandler.BloodOxygenSaturationAlert(oxygenAlertModel);
        } catch (error) {
            Logger.instance().log(`Error in sending blood oxygen saturation alert notification : ${error}`);
        }
    }

    private static getOxygenNotification = (oxygenValue: number): AlertNotification | null => {
        if (oxygenValue < OXYGEN_LOW_THRESHOLD) {
            return bloodOxygenNotificationTemplate.find(template => template.severity === Severity.LOW) || null;
        } else if (oxygenValue >= OXYGEN_LOW_RANGE_MIN && oxygenValue < OXYGEN_NORMAL_MIN) {
            return bloodOxygenNotificationTemplate.find(template => template.severity === Severity.HIGH) || null;
        } else if (oxygenValue >= OXYGEN_NORMAL_MIN && oxygenValue <= OXYGEN_NORMAL_MAX) {
            return bloodOxygenNotificationTemplate.find(template => template.severity === Severity.NORMAL) || null;
        }
        return null;
    };

    //for body temperature
    static async forBodyTemperature(model: BodyTemperatureAlertCreateModel) {
        try {
            const notification = BiometricAlerts.getTemperatureNotification(model.BodyTemperature!);
            if (!notification) {
                return;
            }
            const temperatureAlertModel: BodyTemperatureAlertCreateModel = {};
            temperatureAlertModel.PatientUserId = model.PatientUserId;
            temperatureAlertModel.BodyTemperature = model.BodyTemperature;
            temperatureAlertModel.TemperatureNotification = notification;

            BiometricAlertHandler.BodyTemperatureAlert(temperatureAlertModel);
        } catch (error) {
            Logger.instance().log(`Error in sending body temperature alert notification : ${error}`);
        }
    }

    private static getTemperatureNotification = (temperatureValue: number): AlertNotification | null => {
        if (temperatureValue < TEMP_LOW_THRESHOLD) {
            return bodyTemperatureNotificationTemplate.find(template => template.severity === Severity.LOW) || null;
        } else if (temperatureValue >= TEMP_NORMAL_MIN && temperatureValue <= TEMP_NORMAL_MAX) {
            return bodyTemperatureNotificationTemplate.find(template => template.severity === Severity.NORMAL) || null;
        } else if (temperatureValue >= TEMP_ELEVATED_MIN && temperatureValue < TEMP_FEVER_MIN) {
            return bodyTemperatureNotificationTemplate.find(template => template.severity === Severity.HIGH) || null;
        } else if (temperatureValue >= TEMP_FEVER_MIN) {
            return bodyTemperatureNotificationTemplate.find(template => template.severity === Severity.VERY_HIGH) || null;
        }
        return null;
    };

    // for pulse
    static async forPulse(model: PulseAlertCreateModel) {
        try {
            const notification = BiometricAlerts.getPulseNotification(model.Pulse!);
            if (!notification) {
                return;
            }
            const pulseAlertModel: PulseAlertCreateModel = {};
            pulseAlertModel.PatientUserId = model.PatientUserId;
            pulseAlertModel.Pulse = model.Pulse;
            pulseAlertModel.PulseNotification = notification;

            BiometricAlertHandler.PulseAlert(pulseAlertModel);
        } catch (error) {
            Logger.instance().log(`Error in sending pulse alert notification : ${error}`);
        }
    }

    private static getPulseNotification = (pulseValue: number): AlertNotification | null => {
        if (pulseValue < PULSE_LOW_THRESHOLD) {
            return pulseNotificationTemplate.find(template => template.severity === Severity.LOW) || null;
        } else if (pulseValue >= PULSE_NORMAL_MIN && pulseValue <= PULSE_NORMAL_MAX) {
            return pulseNotificationTemplate.find(template => template.severity === Severity.NORMAL) || null;
        } else if (pulseValue >= PULSE_HIGH_THRESHOLD) {
            return pulseNotificationTemplate.find(template => template.severity === Severity.HIGH) || null;
        }
        return null;
    };

}
