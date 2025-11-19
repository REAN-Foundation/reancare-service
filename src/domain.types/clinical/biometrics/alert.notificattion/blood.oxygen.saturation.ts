import { AlertModel, AlertNotification, AlertNotificationCreateModel, Severity } from "../../../../domain.types/clinical/biometrics/biometrics.types";

export interface BloodOxygenAlertModel extends AlertModel {
    BloodOxygenSaturation?: number;
    OxygenNotification?: AlertNotificationCreateModel;
}

export const OXYGEN_LOW_THRESHOLD: number = 90;
export const OXYGEN_NORMAL_MIN: number = 95;
export const OXYGEN_NORMAL_MAX: number = 100;
export const OXYGEN_LOW_RANGE_MIN: number = 90;

export const bloodOxygenNotificationTemplate: AlertNotification[] = [
    {
        severity : Severity.LOW,
        title    : {
            "en-US" : "Dear {{PatientName}},",
            "es-ES" : "Estimado {{PatientName}},",
        },
        range   : `Blood Oxygen saturation is less than ${OXYGEN_LOW_THRESHOLD}%`,
        message : {
            "en-US" : "Your recent blood oxygen saturation reading is {{BloodOxygenSaturation}}%, it is too low (hypoxemia). Seek medical attention immediately.",
            "es-ES" : "Su lectura reciente de saturación de oxígeno es {{BloodOxygenSaturation}}%, es demasiado baja (hipoxemia). Busque atención médica inmediatamente."
        }
    },
    {
        severity : Severity.HIGH,
        title    : {
            "en-US" : "Dear {{PatientName}},",
            "es-ES" : "Estimado {{PatientName}},",
        },
        range   : `Blood Oxygen saturation is between ${OXYGEN_LOW_RANGE_MIN}-${OXYGEN_NORMAL_MIN - 1}%`,
        message : {
            "en-US" : "Your recent blood oxygen saturation reading is {{BloodOxygenSaturation}}%, it is slightly low. Monitor closely and consult your healthcare provider.",
            "es-ES" : "Su lectura reciente de saturación de oxígeno es {{BloodOxygenSaturation}}%, es ligeramente baja. Continúe monitoreando y consulte a su proveedor de atención médica."
        }
    },
    {
        severity : Severity.NORMAL,
        title    : {
            "en-US" : "Dear {{PatientName}},",
            "es-ES" : "Estimado {{PatientName}},",
        },
        range   : `Blood Oxygen saturation is between ${OXYGEN_NORMAL_MIN}-${OXYGEN_NORMAL_MAX}%`,
        message : {
            "en-US" : "Your recent blood oxygen saturation reading is {{BloodOxygenSaturation}}%, it is normal. Keep maintaining a healthy lifestyle!",
            "es-ES" : "Su lectura reciente de saturación de oxígeno es {{BloodOxygenSaturation}}%, es normal. Manténgase en un estilo de vida saludable!"
        }
    }
];
