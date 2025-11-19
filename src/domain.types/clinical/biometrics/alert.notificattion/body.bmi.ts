import { AlertModel, AlertNotification, AlertNotificationCreateModel, Severity } from "../../../../domain.types/clinical/biometrics/biometrics.types";

export interface BodyBmiAlertModel extends AlertModel {
    Bmi?: number;
    BmiNotification?: AlertNotificationCreateModel;
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
        title    : {
            "en-US" : `BMI less than ${BMI_UNDERWEIGHT_THRESHOLD}`,
            "es-ES" : `BMI menos de ${BMI_UNDERWEIGHT_THRESHOLD}`
        },
        range   : `BMI less than ${BMI_UNDERWEIGHT_THRESHOLD}`,
        message : {
            "en-US" : "Your recent BMI reading is {{BMI}}, You are underweight. Consider consulting with a healthcare provider to assess your nutritional needs.",
            "es-ES" : "Tu lectura de BMI es {{BMI}}, Estás bajo peso. Considera consultar con un proveedor de atención médica para evaluar tus necesidades nutricionales."
        }
    },
    {
        severity : Severity.NORMAL,
        title    : {
            "en-US" : `BMI ${BMI_NORMAL_MIN}-${BMI_NORMAL_MAX}`,
            "es-ES" : `BMI ${BMI_NORMAL_MIN}-${BMI_NORMAL_MAX}`
        },
        range   : `BMI ${BMI_NORMAL_MIN}-${BMI_NORMAL_MAX}`,
        message : {
            "en-US" : "Your recent BMI reading is {{BMI}}. Your weight is within the normal range. Keep maintaining a healthy lifestyle!",
            "es-ES" : "Tu lectura de BMI es {{BMI}}. Tu peso está dentro del rango normal. Manténgase en un estilo de vida saludable!"
        }
    },
    {
        severity : Severity.HIGH,
        title    : {
            "en-US" : `BMI ${BMI_OVERWEIGHT_MIN}-${BMI_OVERWEIGHT_MAX}`,
            "es-ES" : `BMI ${BMI_OVERWEIGHT_MIN}-${BMI_OVERWEIGHT_MAX}`
        },
        range   : `BMI ${BMI_OVERWEIGHT_MIN}-${BMI_OVERWEIGHT_MAX}`,
        message : {
            "en-US" : "Your recent BMI reading is {{BMI}}. You are overweight. Consider adopting healthy habits like regular exercise and a balanced diet.",
            "es-ES" : "Tu lectura de BMI es {{BMI}}. Estás sobrepeso. Considera adoptar hábitos saludables como ejercicio regular y una dieta equilibrada."
        }
    },
    {
        severity : Severity.VERY_HIGH,
        title    : {
            "en-US" : `BMI ${BMI_OBESE_THRESHOLD} or higher`,
            "es-ES" : `BMI ${BMI_OBESE_THRESHOLD} o superior`
        },
        range   : `BMI ${BMI_OBESE_THRESHOLD} or higher`,
        message : {
            "en-US" : "Your recent BMI reading is {{BMI}}. You are classified as obese. It’s recommended to consult a healthcare provider for personalized advice.",
            "es-ES" : "Tu lectura de BMI es {{BMI}}. Estás clasificado como obeso. Se recomienda consultar a un proveedor de atención médica para obtener asesoramiento personalizado."
        }
    }
];
