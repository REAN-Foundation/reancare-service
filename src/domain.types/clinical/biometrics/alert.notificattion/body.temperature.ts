import { AlertModel, AlertNotification, AlertNotificationCreateModel, Severity } from "../../../../domain.types/clinical/biometrics/biometrics.types";

export const bodyTemperatureUnits = ['celsius','°c'];

export interface BodyTemperatureAlertModel extends AlertModel {
    BodyTemperature?: number;
    TemperatureNotification?: AlertNotificationCreateModel;
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
        title    : {
            "en-US" : `Body temperature is less than ${TEMP_LOW_THRESHOLD}°F`,
            "es-ES" : `La temperatura corporal es menor a ${TEMP_LOW_THRESHOLD}°F`
        },
        range   : `Body temperature is less than ${TEMP_LOW_THRESHOLD}°F`,
        message : {
            "en-US" : "Your recent body temperature reading is {{BodyTemperature}}°F. It is too low (hypothermia). Seek medical attention immediately.",
            "es-ES" : "Tu lectura de temperatura corporal es {{BodyTemperature}}°F. Es demasiado baja (hipotermia). Busca atención médica inmediatamente."
        }
    },
    {
        severity : Severity.NORMAL,
        title    : {
            "en-US" : `Body temperature is between ${TEMP_NORMAL_MIN}-${TEMP_NORMAL_MAX}°F`,
            "es-ES" : `La temperatura corporal está entre ${TEMP_NORMAL_MIN}-${TEMP_NORMAL_MAX}°F`
        },
        range   : `Body temperature is between ${TEMP_NORMAL_MIN}-${TEMP_NORMAL_MAX}°F`,
        message : {
            "en-US" : "Your recent body temperature reading is {{BodyTemperature}}°F. It is within the normal range. Keep maintaining a healthy lifestyle!",
            "es-ES" : "Tu lectura de temperatura corporal es {{BodyTemperature}}°F. Está dentro del rango normal. Manténgase en un estilo de vida saludable!"
        }
    },
    {
        severity : Severity.ELEVATED,
        title    : {
            "en-US" : `Body temperature is between ${TEMP_ELEVATED_MIN}-${TEMP_ELEVATED_MAX}°F`,
            "es-ES" : `La temperatura corporal está entre ${TEMP_ELEVATED_MIN}-${TEMP_ELEVATED_MAX}°F`
        },
        range   : `Body temperature is between ${TEMP_ELEVATED_MIN}-${TEMP_ELEVATED_MAX}°F`,
        message : {
            "en-US" : "Your recent body temperature reading is {{BodyTemperature}}°F.Your body temperature is slightly elevated. It's recommended to stay hydrated, take rest and consult your healthcare provider if necessary.",
            "es-ES" : "Tu lectura de temperatura corporal es {{BodyTemperature}}°F. La temperatura corporal está ligeramente elevada. Se recomienda mantenerse hidratado, tomar descanso y consultar a su proveedor de atención médica si es necesario."
        }
    },

    {
        severity : Severity.HIGH,
        title    : {
            "en-US" : `Body temperature is between ${TEMP_FEVER_MIN}-${TEMP_FEVER_MAX}°F`,
            "es-ES" : `La temperatura corporal está entre ${TEMP_FEVER_MIN}-${TEMP_FEVER_MAX}°F`
        },
        range   : `Body temperature is between ${TEMP_FEVER_MIN}-${TEMP_FEVER_MAX}°F`,
        message : {
            "en-US" : "Your recent body temperature reading is {{BodyTemperature}}°F. It is high. This could be a sign of an infection or other condition. It's recommended to stay hydrated, take rest, and monitor your symptoms. If your temperature continues to rise or if you develop additional symptoms, consult a healthcare provider.",
            "es-ES" : "Tu lectura de temperatura corporal es {{BodyTemperature}}°F. Está alta. Esto podría ser un signo de infección o otra condición. Se recomienda mantenerse hidratado, tomar descanso y monitorear sus síntomas. Si su temperatura sigue aumentando o si desarrolla síntomas adicionales, consulte a su proveedor de atención médica."
        }
    },
    {
        severity : Severity.VERY_HIGH,
        title    : {
            "en-US" : `Body temperature is ${TEMP_HIGH_THRESHOLD}°F or higher`,
            "es-ES" : `La temperatura corporal es ${TEMP_HIGH_THRESHOLD}°F o superior`
        },
        range   : `Body temperature is ${TEMP_HIGH_THRESHOLD}°F or higher`,
        message : {
            "en-US" : "You have a fever! Your recent body temperature reading is {{BodyTemperature}}°F. Seek medical attention immediately.",
            "es-ES" : "Tiene fiebre! Tu lectura de temperatura corporal es {{BodyTemperature}}°F. Busque atención médica inmediatamente."
        }
    }
];
