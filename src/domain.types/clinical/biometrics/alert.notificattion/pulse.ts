import { AlertNotification, Severity } from "../../../../domain.types/clinical/biometrics/biometrics.types";

export interface PulseAlertCreateModel {
    PatientUserId?: string;
    Pulse?: number;
    PulseNotification?: AlertNotification;
}

export const PULSE_LOW_THRESHOLD: number = 60;      // Bradycardia: less than 60 bpm
export const PULSE_NORMAL_MIN: number = 60;         // Normal pulse starts from 60 bpm
export const PULSE_NORMAL_MAX: number = 100;        // Normal pulse up to 100 bpm
export const PULSE_HIGH_THRESHOLD: number = 100;    // Tachycardia: more than 100 bpm

export const pulseNotificationTemplate: AlertNotification[] = [
    {
        severity : Severity.LOW,
        range    : `Pulse is less than ${PULSE_LOW_THRESHOLD} bpm`,
        message  : "Your recent pulse reading is {{Pulse}}, it is too low (bradycardia). Please consult your healthcare provider."
    },
    {
        severity : Severity.NORMAL,
        range    : `Pulse is in the normal range (${PULSE_NORMAL_MIN}-${PULSE_NORMAL_MAX} bpm)`,
        message  : "Your recent pulse reading is {{Pulse}}, it is within the normal range. Keep maintaining a healthy lifestyle!"
    },
    {
        severity : Severity.HIGH,
        range    : `Pulse is ${PULSE_HIGH_THRESHOLD} bpm or higher`,
        message  : "Your recent pulse reading is {{Pulse}}, it is too high (tachycardia). Please consult your healthcare provider immediately."
    }
];
