import { AlertNotification, Severity } from "../../../../domain.types/clinical/biometrics/biometrics.types";

export interface BloodPressureAlertCreateModel {
    PatientUserId?: string;
    Systolic?: number;
    Diastolic?: number;
    BloodPressureNotification?: AlertNotification;
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
        message  : "Your recent  blood pressure reading is {{Systolic}}/{{Diastolic}} mmHg, Congratulations! Your blood pressure is normal. Keep up the good work. Stick with these heart-healthy habits. "
    },
    {
        severity : Severity.ELEVATED,
        range    : `Systolic BP is in slightly elevated range (${SYSTOLIC_BP_ELEVATED_MIN}-${SYSTOLIC_BP_ELEVATED_MAX} mmHg) and Diastolic equal to ${DIASTOLIC_BP_NORMAL_THRESHOLD} mmHg`,
        message  : "Your recent blood pressure reading is {{Systolic}}/{{Diastolic}} mmHg, It is slightly elevated. Keep monitoring and consult your healthcare provider if needed."
    },
    {
        severity : Severity.HYPERTENSION_STAGE1,
        range    : `Systolic  BP is in high range (${SYSTOLIC_BP_STAGE1_MIN}-${SYSTOLIC_BP_STAGE1_MAX} mmHg) or Diastolic  BP is in high range (${DIASTOLIC_BP_STAGE1_MIN}-${DIASTOLIC_BP_STAGE1_MAX} mmHg)`,
        message  : "Your recent blood pressure reading is {{Systolic}}/{{Diastolic}} mmHg, It is in Hypertension stage1. Your health care professional should prescribe lifestyle changes. They may add medication based on your risk of heart disease or stroke. Medication should also be added if you have conditions such as diabetes,failure and kidney disease."
    },
    {
        severity : Severity.HYPERTENSION_STAGE2,
        range    : `Systolic  BP is in high range (${SYSTOLIC_BP_STAGE2_MIN}-${SYSTOLIC_BP_STAGE2_MAX} mmHg) or Diastolic  BP is in high range (${DIASTOLIC_BP_STAGE2_MIN}-${DIASTOLIC_BP_STAGE2_MAX} mmHg) `,
        message  : "Your recent blood pressure reading is {{Systolic}}/{{Diastolic}} mmHg, It is in Hypertension stage2. Your health care professional should prescribe lifestyle changes and medication to lower your blood pressure. You may need one or more medications to keep your blood pressure in a healthy range."
    },
    {
        severity : Severity.HYPERTENSIVE_CRISIS,
        range    : `Systolic  BP is in very high range (${SYSTOLIC_BP_HYPERTENSIVE_CRISIS_THRESHOLD} mmHg or higher) or/and Diastolic  BP is in very high range (${DIASTOLIC_BP_HYPERTENSIVE_CRISIS_THRESHOLD} mmHg or higher) `,
        message  : "Your recent blood pressure reading is {{Systolic}}/{{Diastolic}} mmHg, You may be in hypertensive crisis. 1.Wait five minutes. 2.Take your blood pressure reading again. If your readings are still high, call your health care professional right away. Call 911 if your blood pressure is higher than 180/120 and you are having chest pain, numbness, weakness, change in vision or difficulty speaking."
    }
];
