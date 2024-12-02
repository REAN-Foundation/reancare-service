import { AlertNotification, AlertNotificationCreateModel, Severity } from "../../../../domain.types/clinical/biometrics/biometrics.types";

export interface BloodPressureAlertCreateModel {
    PatientUserId?: string;
    Systolic?: number;
    Diastolic?: number;
    BloodPressureNotification?: AlertNotificationCreateModel;
}

export const SYSTOLIC_BP_NORMAL_MIN = 90;
export const SYSTOLIC_BP_NORMAL_MAX = 119;
export const SYSTOLIC_BP_ELEVATED_MIN = 120;
export const SYSTOLIC_BP_ELEVATED_MAX = 129;
export const SYSTOLIC_BP_STAGE1_MIN = 130;
export const SYSTOLIC_BP_STAGE1_MAX = 139;
export const SYSTOLIC_BP_STAGE2_MIN = 140;
export const SYSTOLIC_BP_STAGE2_MAX = 179;
export const SYSTOLIC_BP_HYPERTENSIVE_CRISIS_THRESHOLD = 180;

export const DIASTOLIC_BP_NORMAL_MIN = 60;
export const DIASTOLIC_BP_NORMAL_MAX = 79;
export const DIASTOLIC_BP_NORMAL_THRESHOLD  = 80;
export const DIASTOLIC_BP_STAGE1_MIN = 81;
export const DIASTOLIC_BP_STAGE1_MAX = 89;
export const DIASTOLIC_BP_STAGE2_MIN = 90;
export const DIASTOLIC_BP_STAGE2_MAX = 119;
export const DIASTOLIC_BP_HYPERTENSIVE_CRISIS_THRESHOLD = 120;

export const bloodPressureNotificationTemplate: AlertNotification[] = [
    {
        severity : Severity.NORMAL,
        range    : `Systolic BP is in normal range (${SYSTOLIC_BP_NORMAL_MIN}-${SYSTOLIC_BP_NORMAL_MAX} mmHg) and Diastolic BP is in normal range (${DIASTOLIC_BP_NORMAL_MIN}-${DIASTOLIC_BP_NORMAL_MAX} mmHg)`,
        message  : {
            "en-US" : "Your recent blood pressure reading is {{Systolic}}/{{Diastolic}} mmHg, Congratulations! Your blood pressure is normal. Keep up the good work. Stick with these heart-healthy habits.",
            "es-ES" : "Su lectura reciente de presión arterial es {{Systolic}}/{{Diastolic}} mmHg. ¡Felicidades! Su presión arterial es normal. Continúe con el buen trabajo y mantenga estos hábitos saludables para el corazón."
        }
    },
    {
        severity : Severity.ELEVATED,
        range    : `Systolic BP is in slightly elevated range (${SYSTOLIC_BP_ELEVATED_MIN}-${SYSTOLIC_BP_ELEVATED_MAX} mmHg) and Diastolic equal to ${DIASTOLIC_BP_NORMAL_THRESHOLD} mmHg`,
        message  : {
            "en-US" : "Your recent blood pressure reading is {{Systolic}}/{{Diastolic}} mmHg, It is slightly elevated. Keep monitoring and consult your healthcare provider if needed.",
            "es-ES" : "Su lectura reciente de presión arterial es {{Systolic}}/{{Diastolic}} mmHg. Está ligeramente elevada. Continúe monitoreando y consulte a su proveedor de atención médica si es necesario."
        }
    },
    {
        severity : Severity.HYPERTENSION_STAGE1,
        range    : `Systolic BP is in high range (${SYSTOLIC_BP_STAGE1_MIN}-${SYSTOLIC_BP_STAGE1_MAX} mmHg) or Diastolic BP is in high range (${DIASTOLIC_BP_STAGE1_MIN}-${DIASTOLIC_BP_STAGE1_MAX} mmHg)`,
        message  : {
            "en-US" : "Your recent blood pressure reading is {{Systolic}}/{{Diastolic}} mmHg, It is in Hypertension stage 1. Your healthcare professional should prescribe lifestyle changes. They may add medication based on your risk of heart disease or stroke.",
            "es-ES" : "Su lectura reciente de presión arterial es {{Systolic}}/{{Diastolic}} mmHg. Está en la etapa 1 de hipertensión. Su profesional de salud debe recomendar cambios en el estilo de vida. Puede agregar medicamentos según su riesgo de enfermedad cardíaca o accidente cerebrovascular."
        }
    },
    {
        severity : Severity.HYPERTENSION_STAGE2,
        range    : `Systolic BP is in high range (${SYSTOLIC_BP_STAGE2_MIN}-${SYSTOLIC_BP_STAGE2_MAX} mmHg) or Diastolic BP is in high range (${DIASTOLIC_BP_STAGE2_MIN}-${DIASTOLIC_BP_STAGE2_MAX} mmHg)`,
        message  : {
            "en-US" : "Your recent blood pressure reading is {{Systolic}}/{{Diastolic}} mmHg, It is in Hypertension stage 2. Your healthcare professional should prescribe lifestyle changes and medication to lower your blood pressure.",
            "es-ES" : "Su lectura reciente de presión arterial es {{Systolic}}/{{Diastolic}} mmHg. Está en la etapa 2 de hipertensión. Su profesional de salud debe recomendar cambios en el estilo de vida y medicación para reducir su presión arterial."
        }
    },
    {
        severity : Severity.HYPERTENSIVE_CRISIS,
        range    : `Systolic BP is in very high range (${SYSTOLIC_BP_HYPERTENSIVE_CRISIS_THRESHOLD} mmHg or higher) or Diastolic BP is in very high range (${DIASTOLIC_BP_HYPERTENSIVE_CRISIS_THRESHOLD} mmHg or higher)`,
        message  : {
            "en-US" : "Your recent blood pressure reading is {{Systolic}}/{{Diastolic}} mmHg. You may be in a hypertensive crisis. If your readings remain high after five minutes, call your healthcare provider immediately.",
            "es-ES" : "Su lectura reciente de presión arterial es {{Systolic}}/{{Diastolic}} mmHg. Puede estar en una crisis hipertensiva. Si sus lecturas siguen siendo altas después de cinco minutos, llame a su proveedor de atención médica de inmediato."
        }
    }
];
