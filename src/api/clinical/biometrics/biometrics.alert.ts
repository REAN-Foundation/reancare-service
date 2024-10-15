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

}
