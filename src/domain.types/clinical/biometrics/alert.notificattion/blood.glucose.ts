import { AlertModel, AlertNotification, AlertNotificationCreateModel, Severity } from "../../../../domain.types/clinical/biometrics/biometrics.types";

export interface BloodGlucoseAlertModel extends AlertModel {
    BloodGlucose?: number;
    GlucoseNotification?: AlertNotificationCreateModel;
}

export const GLUCOSE_LOW_THRESHOLD: number = 70;
export const GLUCOSE_NORMAL_MIN: number = 70;
export const GLUCOSE_NORMAL_MAX: number = 139;
export const GLUCOSE_HIGH_MIN: number = 140;
export const GLUCOSE_HIGH_MAX: number = 199;
export const GLUCOSE_VERY_HIGH_THRESHOLD: number = 200;

export const glucoseNotificationTemplate: AlertNotification[] = [
    {
        severity : Severity.LOW,
        title    : {
            "en-US" : "Dear {{PatientName}},",
            "es-ES" : "Estimado {{PatientName}},",
        },
        range   : `Glucose is less than ${GLUCOSE_LOW_THRESHOLD} mg/dL`,
        message : {
            "en-US" : "Your recent blood glucose reading is {{BloodGlucose}},it is too low. Please consume some sugar immediately and consult your healthcare provider.",
            "es-ES" : "Su lectura reciente de glucosa es {{BloodGlucose}}, es demasiado baja. Por favor, consuma azúcar inmediatamente y consulte a su proveedor de atención médica."
        }
    },
    {
        severity : Severity.NORMAL,
        title    : {
            "en-US" : "Dear {{PatientName}},",
            "es-ES" : "Estimado {{PatientName}},",
        },
        range   : `Glucose is in normal range (${GLUCOSE_NORMAL_MIN}-${GLUCOSE_NORMAL_MAX} mg/dL)`,
        message : {
            "en-US" : "Your recent blood glucose reading is {{BloodGlucose}},it is normal. Keep maintaining a healthy lifestyle!",
            "es-ES" : "Su lectura reciente de glucosa es {{BloodGlucose}}, es normal. Manténgase en un estilo de vida saludable!"
        }
    },
    {
        severity : Severity.HIGH,
        title    : {
            "en-US" : "Dear {{PatientName}},",
            "es-ES" : "Estimado {{PatientName}},",
        },
        range   : `Glucose is in elevated range(${GLUCOSE_HIGH_MIN}-${GLUCOSE_HIGH_MAX} mg/dL)`,
        message : {
            "en-US" : "Your recent blood glucose reading is {{BloodGlucose}},it is high. Consider watching your diet and consult your healthcare provider if necessary.",
            "es-ES" : "Su lectura reciente de glucosa es {{BloodGlucose}}, es alta. Considere monitorear su dieta y consulte a su proveedor de atención médica si es necesario."
        }
    },
    {
        severity : Severity.VERY_HIGH,
        title    : {
            "en-US" : "Dear {{PatientName}},",
            "es-ES" : "Estimado {{PatientName}},",
        },
        range   : `Glucose is in very high range (${GLUCOSE_VERY_HIGH_THRESHOLD} or higher mg/dL)`,
        message : {
            "en-US" : "Your recent blood glucose reading is {{BloodGlucose}},it is very high. Please consult your healthcare provider immediately for further advice.",
            "es-ES" : "Su lectura reciente de glucosa es {{BloodGlucose}}, es muy alta. Por favor, consulte a su proveedor de atención médica inmediatamente para obtener más asesoría."
        }
    }
];
