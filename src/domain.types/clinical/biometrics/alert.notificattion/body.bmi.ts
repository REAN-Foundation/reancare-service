import { AlertNotification, Severity } from "../../../../domain.types/clinical/biometrics/biometrics.types";

export interface BodyBmiAlertCreateModel {
    PatientUserId?: string;
    Bmi?: number;
    BmiNotification?: AlertNotification;
}

export const BMI_UNDERWEIGHT_THRESHOLD = 18.5;
export const BMI_NORMAL_MIN = 18.5;
export const BMI_NORMAL_MAX = 24.9;
export const BMI_OVERWEIGHT_MIN = 25;
export const BMI_OVERWEIGHT_MAX = 29.9;
export const BMI_OBESE_THRESHOLD = 30;

export const weightNotificationTemplate: AlertNotification[] = [
    {
        severity : Severity.LOW,
        range    : `BMI less than ${BMI_UNDERWEIGHT_THRESHOLD}`,
        message  : "Your recent BMI reading is {{BMI}}, You are underweight. Consider consulting with a healthcare provider to assess your nutritional needs."
    },
    {
        severity : Severity.NORMAL,
        range    : `BMI ${BMI_NORMAL_MIN}-${BMI_NORMAL_MAX}`,
        message  : "Your recent BMI reading is {{BMI}}. Your weight is within the normal range. Keep maintaining a healthy lifestyle!"
    },
    {
        severity : Severity.HIGH,
        range    : `BMI ${BMI_OVERWEIGHT_MIN}-${BMI_OVERWEIGHT_MAX}`,
        message  : "Your recent BMI reading is {{BMI}}. You are overweight. Consider adopting healthy habits like regular exercise and a balanced diet."
    },
    {
        severity : Severity.VERY_HIGH,
        range    : `BMI ${BMI_OBESE_THRESHOLD} or higher`,
        message  : "Your recent BMI reading is {{BMI}}. You are classified as obese. It’s recommended to consult a healthcare provider for personalized advice."
    }
];
