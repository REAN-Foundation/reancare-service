import { AlertNotification, AlertNotificationCreateModel, Severity } from "../../../../domain.types/clinical/biometrics/biometrics.types";

export interface PulseAlertCreateModel {
    PatientUserId?: string;
    Pulse?: number;
    PulseNotification?: AlertNotificationCreateModel;
}

export const PULSE_LOW_THRESHOLD: number = 60;
export const PULSE_NORMAL_MIN: number = 60;
export const PULSE_NORMAL_MAX: number = 100;
export const PULSE_HIGH_THRESHOLD: number = 100;

export const pulseNotificationTemplate: AlertNotification[] = [
    {
        severity : Severity.LOW,
        range    : `Pulse is less than ${PULSE_LOW_THRESHOLD} bpm`,
        title    : {
            "en-US" : "Dear {{PatientName}},",
            "es-ES" : "Estimado {{PatientName}},",
        },
        message : {
            "en-US" : "Your recent pulse reading is {{Pulse}} bpm, it is too low (bradycardia). Please consult your healthcare provider.",
            "es-ES" : "Su lectura reciente de pulso es {{Pulse}} bpm, es demasiado baja (bradicardia). Por favor, consulte a su proveedor de atención médica.",
        }
    },
    {
        severity : Severity.NORMAL,
        range    : `Pulse is in the normal range (${PULSE_NORMAL_MIN}-${PULSE_NORMAL_MAX} bpm)`,
        title    : {
            "en-US" : "Dear {{PatientName}},",
            "es-ES" : "Estimado {{PatientName}},",
        },
        message : {
            "en-US" : "Your recent pulse reading is {{Pulse}} bpm, it is within the normal range. Keep maintaining a healthy lifestyle!",
            "es-ES" : "Su lectura reciente de pulso es {{Pulse}} bpm, está dentro del rango normal. Manténgase en un estilo de vida saludable!",
        }
    },
    {
        severity : Severity.HIGH,
        range    : `Pulse is greater than${PULSE_HIGH_THRESHOLD} bpm`,
        title    : {
            "en-US" : "Dear {{PatientName}},",
            "es-ES" : "Estimado {{PatientName}},",
        },
        message : {
            "en-US" : "Your recent pulse reading is {{Pulse}} bpm, it is too high (tachycardia). Please consult your healthcare provider immediately.",
            "es-ES" : "Su lectura reciente de pulso es {{Pulse}} bpm, es demasiado alta (tachicardia). Por favor, consulte a su proveedor de atención médica inmediatamente.",
        }
    }
];
