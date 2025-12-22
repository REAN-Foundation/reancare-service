import { VitalsThresholds } from './vitals.thresholds.types';
import { Severity } from '../clinical/biometrics/biometrics.types';

export const DEFAULT_VITALS_THRESHOLDS: VitalsThresholds = {

    Pulse : {
        Enabled    : true,
        Unit       : "bpm",
        Categories : [
            {
                Category     : "Low Pulse (Bradycardia)",
                Severity     : Severity.LOW,
                Ranges       : { "Pulse": { Min: undefined, Max: 59 } },
                AlertMessage : {
                    "en-US" : "Your recent pulse reading is {{Pulse}} bpm, it is too low (bradycardia). Please consult your healthcare provider.",
                    "es-ES" : "Su lectura reciente de pulso es {{Pulse}} bpm, es demasiado baja (bradicardia). Por favor, consulte a su proveedor de atención médica."
                },
                SendAlert : true,
                Priority  : 5
            },
            {
                Category     : "Normal Pulse",
                Severity     : Severity.NORMAL,
                Ranges       : { "Pulse": { Min: 60, Max: 100 } },
                AlertMessage : {
                    "en-US" : "Your recent pulse reading is {{Pulse}} bpm, it is within the normal range. Keep maintaining a healthy lifestyle!",
                    "es-ES" : "Su lectura reciente de pulso es {{Pulse}} bpm, está dentro del rango normal. Manténgase en un estilo de vida saludable!"
                },
                SendAlert : false,
                Priority  : 1
            },
            {
                Category     : "High Pulse (Tachycardia)",
                Severity     : Severity.HIGH,
                Ranges       : { "Pulse": { Min: 101, Max: undefined } },
                AlertMessage : {
                    "en-US" : "Your recent pulse reading is {{Pulse}} bpm, it is too high (tachycardia). Please consult your healthcare provider immediately.",
                    "es-ES" : "Su lectura reciente de pulso es {{Pulse}} bpm, es demasiado alta (tachicardia). Por favor, consulte a su proveedor de atención médica inmediatamente."
                },
                SendAlert : true,
                Priority  : 5
            }
        ]
    },

    BloodPressure : {
        Enabled    : true,
        Unit       : "mmHg",
        Categories : [
            {
                Category : "Normal Blood Pressure",
                Severity : Severity.NORMAL,
                Ranges   : {
                    "Systolic"  : { Min: 0, Max: 119 },
                    "Diastolic" : { Min: 0, Max: 79 }
                },
                AlertMessage : {
                    "en-US" : "Your recent blood pressure reading is {{Systolic}}/{{Diastolic}} mmHg, Congratulations! Your blood pressure is normal. Keep up the good work. Stick with these heart-healthy habits.",
                    "es-ES" : "Su lectura reciente de presión arterial es {{Systolic}}/{{Diastolic}} mmHg. ¡Felicidades! Su presión arterial es normal. Continúe con el buen trabajo y mantenga estos hábitos saludables para el corazón."
                },
                SendAlert : false,
                Priority  : 1
            },
            {
                Category : "Elevated Blood Pressure",
                Severity : Severity.ELEVATED,
                Ranges   : {
                    "Systolic" : { Min: 120, Max: 129 }
                },
                AlertMessage : {
                    "en-US" : "Your recent blood pressure reading is {{Systolic}}/{{Diastolic}} mmHg, It is slightly elevated. Keep monitoring and consult your healthcare provider if needed.",
                    "es-ES" : "Su lectura reciente de presión arterial es {{Systolic}}/{{Diastolic}} mmHg. Está ligeramente elevada. Continúe monitoreando y consulte a su proveedor de atención médica si es necesario."
                },
                SendAlert : true,
                Priority  : 2
            },
            {
                Category : "Hypertension Stage 1",
                Severity : Severity.HIGH,
                Ranges   : {
                    "Systolic"  : { Min: 130, Max: 139 },
                    "Diastolic" : { Min: 80, Max: 89 }
                },
                AlertMessage : {
                    "en-US" : "Your recent blood pressure reading is {{Systolic}}/{{Diastolic}} mmHg, It is in Hypertension stage 1. Your healthcare professional should prescribe lifestyle changes. They may add medication based on your risk of heart disease or stroke.",
                    "es-ES" : "Su lectura reciente de presión arterial es {{Systolic}}/{{Diastolic}} mmHg. Está en la etapa 1 de hipertensión. Su profesional de salud debe recomendar cambios en el estilo de vida. Puede agregar medicamentos según su riesgo de enfermedad cardíaca o accidente cerebrovascular."
                },
                SendAlert : true,
                Priority  : 3
            },
            {
                Category : "Hypertension Stage 2",
                Severity : Severity.VERY_HIGH,
                Ranges   : {
                    "Systolic"  : { Min: 140, Max: 180 },
                    "Diastolic" : { Min: 90, Max: 120 }
                },
                AlertMessage : {
                    "en-US" : "Your recent blood pressure reading is {{Systolic}}/{{Diastolic}} mmHg, It is in Hypertension stage 2. Your healthcare professional should prescribe lifestyle changes and medication to lower your blood pressure.",
                    "es-ES" : "Su lectura reciente de presión arterial es {{Systolic}}/{{Diastolic}} mmHg. Está en la etapa 2 de hipertensión. Su profesional de salud debe recomendar cambios en el estilo de vida y medicación para reducir su presión arterial."
                },
                SendAlert : true,
                Priority  : 4
            },
            {
                Category : "Hypertensive Crisis",
                Severity : Severity.HYPERTENSIVE_CRISIS,
                Ranges   : {
                    "Systolic"  : { Min: 181, Max: 999 },
                    "Diastolic" : { Min: 121, Max: 999 }
                },
                AlertMessage : {
                    "en-US" : "Your recent blood pressure reading is {{Systolic}}/{{Diastolic}} mmHg. You may be in a hypertensive crisis. If your readings remain high after five minutes, call your healthcare provider immediately.",
                    "es-ES" : "Su lectura reciente de presión arterial es {{Systolic}}/{{Diastolic}} mmHg. Puede estar en una crisis hipertensiva. Si sus lecturas siguen siendo altas después de cinco minutos, llame a su proveedor de atención médica de inmediato."
                },
                SendAlert : true,
                Priority  : 5
            }
        ]
    },

    BloodGlucose : {
        Enabled    : true,
        Unit       : "mg/dL",
        Categories : [
            {
                Category     : "Low Blood Glucose (Hypoglycemia)",
                Severity     : Severity.LOW,
                Ranges       : { "BloodGlucose": { Min: undefined, Max: 69 } },
                AlertMessage : {
                    "en-US" : "Your recent blood glucose reading is {{BloodGlucose}} mg/dL, it is too low. Please consume some sugar immediately and consult your healthcare provider.",
                    "es-ES" : "Su lectura reciente de glucosa es {{BloodGlucose}} mg/dL, es demasiado baja. Por favor, consuma azúcar inmediatamente y consulte a su proveedor de atención médica."
                },
                SendAlert : true,
                Priority  : 5
            },
            {
                Category     : "Normal Blood Glucose",
                Severity     : Severity.NORMAL,
                Ranges       : { "BloodGlucose": { Min: 70, Max: 139 } },
                AlertMessage : {
                    "en-US" : "Your recent blood glucose reading is {{BloodGlucose}} mg/dL, it is normal. Keep maintaining a healthy lifestyle!",
                    "es-ES" : "Su lectura reciente de glucosa es {{BloodGlucose}} mg/dL, es normal. Manténgase en un estilo de vida saludable!"
                },
                SendAlert : false,
                Priority  : 1
            },
            {
                Category     : "High Blood Glucose",
                Severity     : Severity.HIGH,
                Ranges       : { "BloodGlucose": { Min: 140, Max: 199 } },
                AlertMessage : {
                    "en-US" : "Your recent blood glucose reading is {{BloodGlucose}} mg/dL, it is high. Consider watching your diet and consult your healthcare provider if necessary.",
                    "es-ES" : "Su lectura reciente de glucosa es {{BloodGlucose}} mg/dL, es alta. Considere monitorear su dieta y consulte a su proveedor de atención médica si es necesario."
                },
                SendAlert : true,
                Priority  : 4
            },
            {
                Category     : "Very High Blood Glucose",
                Severity     : Severity.VERY_HIGH,
                Ranges       : { "BloodGlucose": { Min: 200, Max: undefined } },
                AlertMessage : {
                    "en-US" : "Your recent blood glucose reading is {{BloodGlucose}} mg/dL, it is very high. Please consult your healthcare provider immediately for further advice.",
                    "es-ES" : "Su lectura reciente de glucosa es {{BloodGlucose}} mg/dL, es muy alta. Por favor, consulte a su proveedor de atención médica inmediatamente para obtener más asesoría."
                },
                SendAlert : true,
                Priority  : 5
            }
        ]
    },

    BodyTemperature : {
        Enabled    : true,
        Unit       : "°F",
        Categories : [
            {
                Category     : "Low Body Temperature (Hypothermia)",
                Severity     : Severity.LOW,
                Ranges       : { "BodyTemperature": { Min: undefined, Max: 94.9 } },
                AlertMessage : {
                    "en-US" : "Your recent body temperature reading is {{BodyTemperature}}°F. It is too low (hypothermia). Seek medical attention immediately.",
                    "es-ES" : "Tu lectura de temperatura corporal es {{BodyTemperature}}°F. Es demasiado baja (hipotermia). Busca atención médica inmediatamente."
                },
                SendAlert : true,
                Priority  : 5
            },
            {
                Category     : "Normal Body Temperature",
                Severity     : Severity.NORMAL,
                Ranges       : { "BodyTemperature": { Min: 95.0, Max: 99.0 } },
                AlertMessage : {
                    "en-US" : "Your recent body temperature reading is {{BodyTemperature}}°F. It is within the normal range. Keep maintaining a healthy lifestyle!",
                    "es-ES" : "Tu lectura de temperatura corporal es {{BodyTemperature}}°F. Está dentro del rango normal. Manténgase en un estilo de vida saludable!"
                },
                SendAlert : false,
                Priority  : 1
            },
            {
                Category     : "Elevated Body Temperature",
                Severity     : Severity.ELEVATED,
                Ranges       : { "BodyTemperature": { Min: 99.1, Max: 100.3 } },
                AlertMessage : {
                    "en-US" : "Your recent body temperature reading is {{BodyTemperature}}°F. Your body temperature is slightly elevated. Stay hydrated and take rest.",
                    "es-ES" : "Tu lectura de temperatura corporal es {{BodyTemperature}}°F. La temperatura corporal está ligeramente elevada. Se recomienda mantenerse hidratado y tomar descanso."
                },
                SendAlert : true,
                Priority  : 2
            },
            {
                Category     : "Fever",
                Severity     : Severity.HIGH,
                Ranges       : { "BodyTemperature": { Min: 100.4, Max: 103.0 } },
                AlertMessage : {
                    "en-US" : "Your recent body temperature reading is {{BodyTemperature}}°F. It is high. This could be a sign of an infection. Monitor your symptoms and consult a healthcare provider.",
                    "es-ES" : "Tu lectura de temperatura corporal es {{BodyTemperature}}°F. Está alta. Esto podría ser un signo de infección. Monitoree sus síntomas y consulte a su proveedor de atención médica."
                },
                SendAlert : true,
                Priority  : 4
            },
            {
                Category     : "High Fever",
                Severity     : Severity.VERY_HIGH,
                Ranges       : { "BodyTemperature": { Min: 103.1, Max: undefined } },
                AlertMessage : {
                    "en-US" : "You have a high fever! Your recent body temperature reading is {{BodyTemperature}}°F. Seek medical attention immediately.",
                    "es-ES" : "Tiene fiebre alta! Tu lectura de temperatura corporal es {{BodyTemperature}}°F. Busque atención médica inmediatamente."
                },
                SendAlert : true,
                Priority  : 5
            }
        ]
    },

    BloodOxygenSaturation : {
        Enabled    : true,
        Unit       : "%",
        Categories : [
            {
                Category     : "Critical Low Oxygen (Severe Hypoxemia)",
                Severity     : Severity.LOW,
                Ranges       : { "BloodOxygenSaturation": { Min: undefined, Max: 89 } },
                AlertMessage : {
                    "en-US" : "Your recent blood oxygen saturation reading is {{BloodOxygenSaturation}}%, it is too low (hypoxemia). Seek medical attention immediately.",
                    "es-ES" : "Su lectura reciente de saturación de oxígeno es {{BloodOxygenSaturation}}%, es demasiado baja (hipoxemia). Busque atención médica inmediatamente."
                },
                SendAlert : true,
                Priority  : 5
            },
            {
                Category     : "Low Oxygen",
                Severity     : Severity.HIGH,
                Ranges       : { "BloodOxygenSaturation": { Min: 90, Max: 94 } },
                AlertMessage : {
                    "en-US" : "Your recent blood oxygen saturation reading is {{BloodOxygenSaturation}}%, it is slightly low. Monitor closely and consult your healthcare provider.",
                    "es-ES" : "Su lectura reciente de saturación de oxígeno es {{BloodOxygenSaturation}}%, es ligeramente baja. Continúe monitoreando y consulte a su proveedor de atención médica."
                },
                SendAlert : true,
                Priority  : 4
            },
            {
                Category     : "Normal Oxygen Saturation",
                Severity     : Severity.NORMAL,
                Ranges       : { "BloodOxygenSaturation": { Min: 95, Max: 100 } },
                AlertMessage : {
                    "en-US" : "Your recent blood oxygen saturation reading is {{BloodOxygenSaturation}}%, it is normal. Keep maintaining a healthy lifestyle!",
                    "es-ES" : "Su lectura reciente de saturación de oxígeno es {{BloodOxygenSaturation}}%, es normal. Manténgase en un estilo de vida saludable!"
                },
                SendAlert : false,
                Priority  : 1
            }
        ]
    },

    BodyBmi : {
        Enabled    : true,
        Unit       : "kg/m²",
        Categories : [
            {
                Category     : "Underweight",
                Severity     : Severity.LOW,
                Ranges       : { "BMI": { Min: undefined, Max: 18.4 } },
                AlertMessage : {
                    "en-US" : "Your recent BMI reading is {{BMI}}. You are underweight. Consider consulting with a healthcare provider to assess your nutritional needs.",
                    "es-ES" : "Tu lectura de BMI es {{BMI}}. Estás bajo peso. Considera consultar con un proveedor de atención médica para evaluar tus necesidades nutricionales."
                },
                SendAlert : true,
                Priority  : 4
            },
            {
                Category     : "Normal Weight",
                Severity     : Severity.NORMAL,
                Ranges       : { "BMI": { Min: 18.5, Max: 24.9 } },
                AlertMessage : {
                    "en-US" : "Your recent BMI reading is {{BMI}}. Your weight is within the normal range. Keep maintaining a healthy lifestyle!",
                    "es-ES" : "Tu lectura de BMI es {{BMI}}. Tu peso está dentro del rango normal. Manténgase en un estilo de vida saludable!"
                },
                SendAlert : false,
                Priority  : 1
            },
            {
                Category     : "Overweight",
                Severity     : Severity.HIGH,
                Ranges       : { "BMI": { Min: 25, Max: 29.9 } },
                AlertMessage : {
                    "en-US" : "Your recent BMI reading is {{BMI}}. You are overweight. Consider adopting healthy habits like regular exercise and a balanced diet.",
                    "es-ES" : "Tu lectura de BMI es {{BMI}}. Estás sobrepeso. Considera adoptar hábitos saludables como ejercicio regular y una dieta equilibrada."
                },
                SendAlert : true,
                Priority  : 3
            },
            {
                Category     : "Obese",
                Severity     : Severity.VERY_HIGH,
                Ranges       : { "BMI": { Min: 30, Max: undefined } },
                AlertMessage : {
                    "en-US" : "Your recent BMI reading is {{BMI}}. You are classified as obese. It's recommended to consult a healthcare provider for personalized advice.",
                    "es-ES" : "Tu lectura de BMI es {{BMI}}. Estás clasificado como obeso. Se recomienda consultar a un proveedor de atención médica para obtener asesoramiento personalizado."
                },
                SendAlert : true,
                Priority  : 5
            }
        ]
    }
};
