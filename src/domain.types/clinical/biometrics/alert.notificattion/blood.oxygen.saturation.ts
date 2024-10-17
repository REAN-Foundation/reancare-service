import { AlertNotification, Severity } from "../../../../domain.types/clinical/biometrics/biometrics.types";

export interface BloodOxygenAlertCreateModel {
    PatientUserId?: string;
    BloodOxygenSaturation?: number;
    OxygenNotification?: AlertNotification;
}

// Oxygen saturation thresholds (Chat GPT sourced)
export const OXYGEN_LOW_THRESHOLD: number = 90;   // Less than 90% (Hypoxemia)
export const OXYGEN_NORMAL_MIN: number = 95;      // Normal oxygen saturation ≥ 95%
export const OXYGEN_NORMAL_MAX: number = 100;     // Normal oxygen saturation ≤ 100%
export const OXYGEN_LOW_RANGE_MIN: number = 90;   // Low oxygen saturation range (90-94%)

export const bloodOxygenNotificationTemplate: AlertNotification[] = [
    {
        severity : Severity.LOW,
        range    : `Blood Oxygen saturation is less than ${OXYGEN_LOW_THRESHOLD}%`,
        message  : `Your recent blood oxygen saturation reading is {{BloodOxygenSaturation}}%, it is too low (hypoxemia). Seek medical attention immediately.`
    },
    {
        severity : Severity.HIGH,
        range    : `Blood Oxygen saturation is between ${OXYGEN_LOW_RANGE_MIN}-${OXYGEN_NORMAL_MIN - 1}%`,
        message  : `Your recent blood oxygen saturation reading is {{BloodOxygenSaturation}}%, it is slightly low. Monitor closely and consult your healthcare provider.`
    },
    {
        severity : Severity.NORMAL,
        range    : `Blood Oxygen saturation is between ${OXYGEN_NORMAL_MIN}-${OXYGEN_NORMAL_MAX}%`,
        message  : `Your recent blood oxygen saturation reading is {{BloodOxygenSaturation}}%, it is normal. Keep maintaining a healthy lifestyle!`
    }
];
