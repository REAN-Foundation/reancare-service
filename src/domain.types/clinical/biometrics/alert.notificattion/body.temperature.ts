import { AlertNotification, Severity } from "../../../../domain.types/clinical/biometrics/biometrics.types";

export const bodyTemperatureUnits = ['celsius','°c'];

export interface BodyTemperatureAlertCreateModel {
    PatientUserId?: string;
    BodyTemperature?: number;
    TemperatureNotification?: AlertNotification;
}

export const TEMP_LOW_THRESHOLD: number = 95.0;
export const TEMP_NORMAL_MIN: number = 95.0;
export const TEMP_NORMAL_MAX: number = 99.0;
export const TEMP_ELEVATED_MIN: number = 99.1;
export const TEMP_ELEVATED_MAX: number = 100.3;
export const TEMP_FEVER_MIN: number = 100.4;
export const TEMP_FEVER_MAX: number = 103.0;
export const TEMP_HIGH_THRESHOLD: number = 103.1;

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
        severity : Severity.ELEVATED,
        range    : `Body temperature is between ${TEMP_ELEVATED_MIN}-${TEMP_ELEVATED_MAX}°F`,
        message  : "Your recent body temperature reading is {{BodyTemperature}}°F.Your body temperature is slightly elevated. It's recommended to stay hydrated, take rest and consult your healthcare provider if necessary."
    },

    {
        severity : Severity.HIGH,
        range    : `Body temperature is between ${TEMP_FEVER_MIN}-${TEMP_FEVER_MAX}°F`,
        message  : "Your recent body temperature reading is {{BodyTemperature}}°F. It is high. This could be a sign of an infection or other condition. It's recommended to stay hydrated, take rest, and monitor your symptoms. If your temperature continues to rise or if you develop additional symptoms, consult a healthcare provider."
    },
    {
        severity : Severity.VERY_HIGH,
        range    : `Body temperature is ${TEMP_HIGH_THRESHOLD}°F or higher`,
        message  : `You have a fever! Your recent body temperature reading is {{BodyTemperature}}°F. If your temperature reaches ${TEMP_HIGH_THRESHOLD}°F or higher, seek medical attention immediately.`
    }
];
