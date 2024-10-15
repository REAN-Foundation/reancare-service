import { AlertNotification, Severity } from "../../../../domain.types/clinical/biometrics/biometrics.types";
export interface BloodGlucoseAlertCreateModel {
    PatientUserId?: string;
    BloodGlucose?: number;
    GlucoseNotification?: AlertNotification;
}

export const GLUCOSE_LOW_THRESHOLD: number = 70;
export const GLUCOSE_NORMAL_MIN: number = 70;
export const GLUCOSE_NORMAL_MAX: number = 139;
export const GLUCOSE_HIGH_MIN: number = 140;
export const GLUCOSE_HIGH_MAX: number = 199;
export const GLUCOSE_VERY_HIGH_THRESHOLD: number = 200;  //Chat GPT

export const glucoseNotificationTemplate: AlertNotification[] = [
    {
        severity : Severity.LOW,
        range    : `Glucose is less than ${GLUCOSE_LOW_THRESHOLD} mg/dL`,
        message  : "Your recent blood glucose reading is {{BloodGlucose}},it is too low. Please consume some sugar immediately and consult your healthcare provider."
    },
    {
        severity : Severity.NORMAL,
        range    : `Glucose is in normal range (${GLUCOSE_NORMAL_MIN}-${GLUCOSE_NORMAL_MAX} mg/dL)`,
        message  : "Your recent blood glucose reading is {{BloodGlucose}},it is normal. Keep maintaining a healthy lifestyle!"
    },
    {
        severity : Severity.HIGH,
        range    : `Glucose is in elevated range(${GLUCOSE_HIGH_MIN}-${GLUCOSE_HIGH_MAX} mg/dL)`,
        message  : "Your recent blood glucose reading is {{BloodGlucose}},it is high. Consider watching your diet and consult your healthcare provider if necessary."
    },
    {
        severity : Severity.VERY_HIGH,
        range    : `Glucose is in very high range (${GLUCOSE_VERY_HIGH_THRESHOLD} or higher mg/dL)`,
        message  : "Your recent blood glucose reading is {{BloodGlucose}},it is very high. Please consult your healthcare provider immediately for further advice."
    }
];
