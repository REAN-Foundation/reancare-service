import { AlertNotification, Severity } from "../../../../domain.types/clinical/biometrics/biometrics.types";

export interface BodyTemperatureAlertCreateModel {
    PatientUserId?: string;
    BodyTemperature?: number;
    TemperatureNotification?: AlertNotification;
}

// Temperature thresholds (based on your provided ranges)
export const TEMP_LOW_THRESHOLD: number = 95.0;       // Less than 95°F (Hypothermia)
export const TEMP_NORMAL_MIN: number = 97.0;          // Normal body temperature ≥ 97°F
export const TEMP_NORMAL_MAX: number = 99.0;          // Normal body temperature ≤ 99°F
export const TEMP_ELEVATED_MIN: number = 99.1;        // Elevated body temperature ≥ 99.1°F
export const TEMP_FEVER_MIN: number = 100.4;          // Fever ≥ 100.4°F
export const TEMP_HIGH_THRESHOLD: number = 103.0;     // High fever ≥ 103°F

export const bodyTemperatureNotificationTemplate: AlertNotification[] = [
    {
        severity : Severity.LOW,
        range    : `Body temperature is less than ${TEMP_LOW_THRESHOLD}°F`,
        message  : "Your recent body temperature reading is {{BodyTemperature}}°F. It is too low (hypothermia). Seek medical attention immediately."
    },
    {
        severity : Severity.NORMAL,
        range    : `Body temperature is between ${TEMP_NORMAL_MIN}-${TEMP_NORMAL_MAX}°F`,
        message  : "Your recent body temperature reading is {{BodyTemperature}}°F. It is within the normal range. Keep maintaining a healthy lifestyle!"
    },
    {
        severity : Severity.HIGH,
        range    : `Body temperature is between ${TEMP_ELEVATED_MIN}-${TEMP_FEVER_MIN - 0.1}°F`,
        message  : "Your recent body temperature reading is {{BodyTemperature}}°F. It is elevated. Monitor for symptoms and consult your healthcare provider if necessary."
    },
    {
        severity : Severity.VERY_HIGH,
        range    : `Body temperature is ${TEMP_FEVER_MIN}°F or higher`,
        message  : `You have a fever! Your recent body temperature reading is {{BodyTemperature}}°F. If your temperature reaches ${TEMP_HIGH_THRESHOLD}°F or higher, seek medical attention immediately.`
    }
];
