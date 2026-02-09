import { AlertModel, AlertNotification, AlertNotificationCreateModel, Severity } from "../../../../domain.types/clinical/biometrics/biometrics.types";

export interface BodyWeightAlertModel extends AlertModel {
    BodyWeight?: number;
    WeightNotification?: AlertNotificationCreateModel;
}

// Weight thresholds in kg (can be configured per tenant)
export const WEIGHT_UNDERWEIGHT_THRESHOLD = 45;
export const WEIGHT_NORMAL_MIN = 45;
export const WEIGHT_NORMAL_MAX = 85;
export const WEIGHT_OVERWEIGHT_MIN = 85.1;
export const WEIGHT_OVERWEIGHT_MAX = 110;
export const WEIGHT_OBESE_THRESHOLD = 110.1;

export const weightUnitsInPounds = ['lb', 'lbs', 'pound', 'pounds'];

export const bodyWeightNotificationTemplate: AlertNotification[] = [
    {
        severity : Severity.LOW,
        title    : {
            "en-US" : `Weight less than ${WEIGHT_UNDERWEIGHT_THRESHOLD} kg`,
            "es-ES" : `Peso menor de ${WEIGHT_UNDERWEIGHT_THRESHOLD} kg`
        },
        range   : `Weight less than ${WEIGHT_UNDERWEIGHT_THRESHOLD} kg`,
        message : {
            "en-US" : "Your recent weight reading is {{BodyWeight}} kg. You may be underweight. Consider consulting with a healthcare provider to assess your nutritional needs.",
            "es-ES" : "Su lectura de peso reciente es {{BodyWeight}} kg. Puede estar bajo de peso. Considere consultar con un proveedor de atención médica para evaluar sus necesidades nutricionales."
        }
    },
    {
        severity : Severity.NORMAL,
        title    : {
            "en-US" : `Weight ${WEIGHT_NORMAL_MIN}-${WEIGHT_NORMAL_MAX} kg`,
            "es-ES" : `Peso ${WEIGHT_NORMAL_MIN}-${WEIGHT_NORMAL_MAX} kg`
        },
        range   : `Weight ${WEIGHT_NORMAL_MIN}-${WEIGHT_NORMAL_MAX} kg`,
        message : {
            "en-US" : "Your recent weight reading is {{BodyWeight}} kg. Your weight is within the normal range. Keep maintaining a healthy lifestyle!",
            "es-ES" : "Su lectura de peso reciente es {{BodyWeight}} kg. Su peso está dentro del rango normal. ¡Siga manteniendo un estilo de vida saludable!"
        }
    },
    {
        severity : Severity.HIGH,
        title    : {
            "en-US" : `Weight ${WEIGHT_OVERWEIGHT_MIN}-${WEIGHT_OVERWEIGHT_MAX} kg`,
            "es-ES" : `Peso ${WEIGHT_OVERWEIGHT_MIN}-${WEIGHT_OVERWEIGHT_MAX} kg`
        },
        range   : `Weight ${WEIGHT_OVERWEIGHT_MIN}-${WEIGHT_OVERWEIGHT_MAX} kg`,
        message : {
            "en-US" : "Your recent weight reading is {{BodyWeight}} kg. You may be overweight. Consider adopting healthy habits like regular exercise and a balanced diet.",
            "es-ES" : "Su lectura de peso reciente es {{BodyWeight}} kg. Puede tener sobrepeso. Considere adoptar hábitos saludables como ejercicio regular y una dieta equilibrada."
        }
    },
    {
        severity : Severity.VERY_HIGH,
        title    : {
            "en-US" : `Weight ${WEIGHT_OBESE_THRESHOLD} kg or higher`,
            "es-ES" : `Peso ${WEIGHT_OBESE_THRESHOLD} kg o superior`
        },
        range   : `Weight ${WEIGHT_OBESE_THRESHOLD} kg or higher`,
        message : {
            "en-US" : "Your recent weight reading is {{BodyWeight}} kg. Your weight is significantly high. It's recommended to consult a healthcare provider for personalized advice.",
            "es-ES" : "Su lectura de peso reciente es {{BodyWeight}} kg. Su peso es significativamente alto. Se recomienda consultar a un proveedor de atención médica para obtener asesoramiento personalizado."
        }
    }
];
