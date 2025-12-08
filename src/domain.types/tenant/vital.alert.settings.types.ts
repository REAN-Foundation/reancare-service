///////////////////////////////////////////////////////////////////////////////
// Vital Alert Settings Types for Tenant-Specific Alert Thresholds
///////////////////////////////////////////////////////////////////////////////

/**
 * Range definition for vital thresholds
 */
export interface VitalRange {
    min: number;
    max: number;
}

/**
 * Base interface for vital alert rules
 */
export interface BaseVitalAlertRule {
    category: string;
    alertMessage: string;
    sendAlert: boolean;
    priority: number;
}

///////////////////////////////////////////////////////////////////////////////
// Blood Pressure Alert Rules
///////////////////////////////////////////////////////////////////////////////

export interface BloodPressureAlertRule extends BaseVitalAlertRule {
    systolic: VitalRange;
    diastolic: VitalRange;
}

///////////////////////////////////////////////////////////////////////////////
// Pulse Alert Rules
///////////////////////////////////////////////////////////////////////////////

export interface PulseAlertRule extends BaseVitalAlertRule {
    pulse: VitalRange;
}

///////////////////////////////////////////////////////////////////////////////
// Blood Glucose Alert Rules
///////////////////////////////////////////////////////////////////////////////

export interface BloodGlucoseAlertRule extends BaseVitalAlertRule {
    bloodGlucose: VitalRange;
}

///////////////////////////////////////////////////////////////////////////////
// Body Temperature Alert Rules
///////////////////////////////////////////////////////////////////////////////

export interface BodyTemperatureAlertRule extends BaseVitalAlertRule {
    temperature: VitalRange;
    unit?: 'fahrenheit' | 'celsius';
}

///////////////////////////////////////////////////////////////////////////////
// Blood Oxygen Saturation Alert Rules
///////////////////////////////////////////////////////////////////////////////

export interface BloodOxygenSaturationAlertRule extends BaseVitalAlertRule {
    oxygenSaturation: VitalRange;
}

///////////////////////////////////////////////////////////////////////////////
// Body BMI Alert Rules
///////////////////////////////////////////////////////////////////////////////

export interface BodyBmiAlertRule extends BaseVitalAlertRule {
    bmi: VitalRange;
}

///////////////////////////////////////////////////////////////////////////////
// Vital Alert Settings - Contains all vital types
///////////////////////////////////////////////////////////////////////////////

export interface VitalAlertSettings {
    BloodPressureRules?: BloodPressureAlertRule[];
    PulseRules?: PulseAlertRule[];
    BloodGlucoseRules?: BloodGlucoseAlertRule[];
    BodyTemperatureRules?: BodyTemperatureAlertRule[];
    BloodOxygenSaturationRules?: BloodOxygenSaturationAlertRule[];
    BodyBmiRules?: BodyBmiAlertRule[];
}

///////////////////////////////////////////////////////////////////////////////
// Matched Alert Result - Returned when a vital value matches a rule
///////////////////////////////////////////////////////////////////////////////

export interface MatchedVitalAlert {
    category: string;
    alertMessage: string;
    sendAlert: boolean;
    priority: number;
    vitalType: VitalType;
}

export enum VitalType {
    BloodPressure = 'BloodPressure',
    Pulse = 'Pulse',
    BloodGlucose = 'BloodGlucose',
    BodyTemperature = 'BodyTemperature',
    BloodOxygenSaturation = 'BloodOxygenSaturation',
    BodyBmi = 'BodyBmi'
}

///////////////////////////////////////////////////////////////////////////////
// Default Vital Alert Settings
///////////////////////////////////////////////////////////////////////////////

export const getDefaultVitalAlertSettings = (): VitalAlertSettings => {
    return {
        BloodPressureRules: [
            {
                category    : "Low Invalid",
                systolic    : { min: 0, max: 49 },
                diastolic   : { min: 0, max: 29 },
                alertMessage: "Your recent blood pressure reading is {{Systolic}}/{{Diastolic}} mmHg. This reading appears to be unusually low and may not be accurate.",
                sendAlert   : true,
                priority    : 8
            },
            {
                category    : "High Invalid",
                systolic    : { min: 301, max: 500 },
                diastolic   : { min: 200, max: 300 },
                alertMessage: "Your recent blood pressure reading is {{Systolic}}/{{Diastolic}} mmHg. This reading appears to be unusually high and may not be accurate.",
                sendAlert   : true,
                priority    : 7
            },
            {
                category    : "Grade 3 Hypertension",
                systolic    : { min: 180, max: 300 },
                diastolic   : { min: 110, max: 200 },
                alertMessage: "Your recent blood pressure reading is {{Systolic}}/{{Diastolic}} mmHg. This falls into Grade 3 Hypertension (Hypertensive Crisis), which requires urgent medical attention.",
                sendAlert   : true,
                priority    : 6
            },
            {
                category    : "Grade 2 Hypertension",
                systolic    : { min: 160, max: 179 },
                diastolic   : { min: 100, max: 109 },
                alertMessage: "Your recent blood pressure reading is {{Systolic}}/{{Diastolic}} mmHg. This falls into Grade 2 Hypertension.",
                sendAlert   : true,
                priority    : 5
            },
            {
                category    : "Grade 1 Hypertension",
                systolic    : { min: 140, max: 159 },
                diastolic   : { min: 90, max: 99 },
                alertMessage: "Your recent blood pressure reading is {{Systolic}}/{{Diastolic}} mmHg. This falls into Grade 1 Hypertension.",
                sendAlert   : true,
                priority    : 4
            },
            {
                category    : "Elevated",
                systolic    : { min: 130, max: 139 },
                diastolic   : { min: 85, max: 89 },
                alertMessage: "Your recent blood pressure reading is {{Systolic}}/{{Diastolic}} mmHg. This is slightly elevated. Keep monitoring and consult your healthcare provider if needed.",
                sendAlert   : true,
                priority    : 3
            },
            {
                category    : "Low Blood Pressure (Hypotension)",
                systolic    : { min: 50, max: 89 },
                diastolic   : { min: 30, max: 59 },
                alertMessage: "Your recent blood pressure reading is {{Systolic}}/{{Diastolic}} mmHg. This indicates low blood pressure (Hypotension). Please consult your healthcare provider.",
                sendAlert   : true,
                priority    : 2
            },
            {
                category    : "Normal",
                systolic    : { min: 90, max: 129 },
                diastolic   : { min: 60, max: 84 },
                alertMessage: "Your blood pressure is within normal range.",
                sendAlert   : false,
                priority    : 1
            }
        ],
        PulseRules: [
            {
                category    : "Invalid (Low)",
                pulse       : { min: 0, max: 29 },
                alertMessage: "Your recent pulse reading is {{Pulse}} bpm, which appears extremely low and likely inaccurate. Please recheck your device or seek immediate medical attention if the reading is accurate.",
                sendAlert   : true,
                priority    : 5
            },
            {
                category    : "Low Pulse (Bradycardia)",
                pulse       : { min: 30, max: 59 },
                alertMessage: "Your recent pulse reading is {{Pulse}} bpm, it is too low (bradycardia). Please consult your healthcare provider.",
                sendAlert   : true,
                priority    : 4
            },
            {
                category    : "Normal Pulse",
                pulse       : { min: 60, max: 100 },
                alertMessage: "Your recent pulse reading is {{Pulse}} bpm, it is within the normal range. Keep maintaining a healthy lifestyle!",
                sendAlert   : false,
                priority    : 3
            },
            {
                category    : "High Pulse (Tachycardia)",
                pulse       : { min: 101, max: 220 },
                alertMessage: "Your recent pulse reading is {{Pulse}} bpm, it is too high (tachycardia). Please consult your healthcare provider immediately.",
                sendAlert   : true,
                priority    : 2
            },
            {
                category    : "Invalid (High)",
                pulse       : { min: 221, max: 300 },
                alertMessage: "Your recent pulse reading is {{Pulse}} bpm, which appears extremely high and likely inaccurate. Please recheck your device or seek immediate medical attention if the reading is accurate.",
                sendAlert   : true,
                priority    : 1
            }
        ],
        BloodGlucoseRules: [
            {
                category     : "Invalid (Low)",
                bloodGlucose : { min: 0, max: 19 },
                alertMessage : "Your recent blood glucose reading is {{BloodGlucose}} mg/dL, which appears extremely low and may not be accurate. Please recheck your device.",
                sendAlert    : true,
                priority     : 6
            },
            {
                category     : "Very Low (Hypoglycemia)",
                bloodGlucose : { min: 20, max: 54 },
                alertMessage : "Your recent blood glucose reading is {{BloodGlucose}} mg/dL, it is dangerously low (severe hypoglycemia). Please consume some sugar immediately and seek medical attention.",
                sendAlert    : true,
                priority     : 5
            },
            {
                category     : "Low (Hypoglycemia)",
                bloodGlucose : { min: 55, max: 69 },
                alertMessage : "Your recent blood glucose reading is {{BloodGlucose}} mg/dL, it is too low (hypoglycemia). Please consume some sugar and consult your healthcare provider.",
                sendAlert    : true,
                priority     : 4
            },
            {
                category     : "Normal",
                bloodGlucose : { min: 70, max: 139 },
                alertMessage : "Your recent blood glucose reading is {{BloodGlucose}} mg/dL, it is normal. Keep maintaining a healthy lifestyle!",
                sendAlert    : false,
                priority     : 3
            },
            {
                category     : "High (Pre-diabetes/Diabetes)",
                bloodGlucose : { min: 140, max: 199 },
                alertMessage : "Your recent blood glucose reading is {{BloodGlucose}} mg/dL, it is high. Consider watching your diet and consult your healthcare provider if necessary.",
                sendAlert    : true,
                priority     : 2
            },
            {
                category     : "Very High",
                bloodGlucose : { min: 200, max: 600 },
                alertMessage : "Your recent blood glucose reading is {{BloodGlucose}} mg/dL, it is very high. Please consult your healthcare provider immediately for further advice.",
                sendAlert    : true,
                priority     : 1
            }
        ],
        BodyTemperatureRules: [
            {
                category    : "Invalid (Low)",
                temperature : { min: 0, max: 89.9 },
                unit        : 'fahrenheit',
                alertMessage: "Your recent body temperature reading is {{BodyTemperature}}°F, which appears extremely low and may not be accurate. Please recheck your device.",
                sendAlert   : true,
                priority    : 7
            },
            {
                category    : "Low (Hypothermia)",
                temperature : { min: 90, max: 94.9 },
                unit        : 'fahrenheit',
                alertMessage: "Your recent body temperature reading is {{BodyTemperature}}°F. It is too low (hypothermia). Seek medical attention immediately.",
                sendAlert   : true,
                priority    : 6
            },
            {
                category    : "Normal",
                temperature : { min: 95, max: 99 },
                unit        : 'fahrenheit',
                alertMessage: "Your recent body temperature reading is {{BodyTemperature}}°F. It is within the normal range. Keep maintaining a healthy lifestyle!",
                sendAlert   : false,
                priority    : 5
            },
            {
                category    : "Elevated",
                temperature : { min: 99.1, max: 100.3 },
                unit        : 'fahrenheit',
                alertMessage: "Your recent body temperature reading is {{BodyTemperature}}°F. Your body temperature is slightly elevated. Stay hydrated, take rest and consult your healthcare provider if necessary.",
                sendAlert   : true,
                priority    : 4
            },
            {
                category    : "Fever",
                temperature : { min: 100.4, max: 103 },
                unit        : 'fahrenheit',
                alertMessage: "Your recent body temperature reading is {{BodyTemperature}}°F. It is high (fever). Stay hydrated, take rest, and monitor your symptoms. If your temperature continues to rise, consult a healthcare provider.",
                sendAlert   : true,
                priority    : 3
            },
            {
                category    : "High Fever",
                temperature : { min: 103.1, max: 106 },
                unit        : 'fahrenheit',
                alertMessage: "You have a high fever! Your recent body temperature reading is {{BodyTemperature}}°F. Seek medical attention immediately.",
                sendAlert   : true,
                priority    : 2
            },
            {
                category    : "Invalid (High)",
                temperature : { min: 106.1, max: 120 },
                unit        : 'fahrenheit',
                alertMessage: "Your recent body temperature reading is {{BodyTemperature}}°F, which appears extremely high and may not be accurate. Please recheck your device.",
                sendAlert   : true,
                priority    : 1
            }
        ],
        BloodOxygenSaturationRules: [
            {
                category        : "Critical (Severe Hypoxemia)",
                oxygenSaturation: { min: 0, max: 84 },
                alertMessage    : "Your recent blood oxygen saturation reading is {{BloodOxygenSaturation}}%, it is critically low (severe hypoxemia). Seek emergency medical attention immediately.",
                sendAlert       : true,
                priority        : 5
            },
            {
                category        : "Low (Hypoxemia)",
                oxygenSaturation: { min: 85, max: 89 },
                alertMessage    : "Your recent blood oxygen saturation reading is {{BloodOxygenSaturation}}%, it is too low (hypoxemia). Seek medical attention immediately.",
                sendAlert       : true,
                priority        : 4
            },
            {
                category        : "Low-Normal Range",
                oxygenSaturation: { min: 90, max: 94 },
                alertMessage    : "Your recent blood oxygen saturation reading is {{BloodOxygenSaturation}}%, it is slightly low. Monitor closely and consult your healthcare provider.",
                sendAlert       : true,
                priority        : 3
            },
            {
                category        : "Normal",
                oxygenSaturation: { min: 95, max: 100 },
                alertMessage    : "Your recent blood oxygen saturation reading is {{BloodOxygenSaturation}}%, it is normal. Keep maintaining a healthy lifestyle!",
                sendAlert       : false,
                priority        : 2
            }
        ],
        BodyBmiRules: [
            {
                category    : "Severely Underweight",
                bmi         : { min: 0, max: 15.9 },
                alertMessage: "Your recent BMI reading is {{BMI}}. You are severely underweight. Please consult with a healthcare provider to assess your nutritional needs.",
                sendAlert   : true,
                priority    : 6
            },
            {
                category    : "Underweight",
                bmi         : { min: 16, max: 18.4 },
                alertMessage: "Your recent BMI reading is {{BMI}}. You are underweight. Consider consulting with a healthcare provider to assess your nutritional needs.",
                sendAlert   : true,
                priority    : 5
            },
            {
                category    : "Normal",
                bmi         : { min: 18.5, max: 24.9 },
                alertMessage: "Your recent BMI reading is {{BMI}}. Your weight is within the normal range. Keep maintaining a healthy lifestyle!",
                sendAlert   : false,
                priority    : 4
            },
            {
                category    : "Overweight",
                bmi         : { min: 25, max: 29.9 },
                alertMessage: "Your recent BMI reading is {{BMI}}. You are overweight. Consider adopting healthy habits like regular exercise and a balanced diet.",
                sendAlert   : true,
                priority    : 3
            },
            {
                category    : "Obese (Class I)",
                bmi         : { min: 30, max: 34.9 },
                alertMessage: "Your recent BMI reading is {{BMI}}. You are classified as obese (Class I). It's recommended to consult a healthcare provider for personalized advice.",
                sendAlert   : true,
                priority    : 2
            },
            {
                category    : "Obese (Class II & III)",
                bmi         : { min: 35, max: 100 },
                alertMessage: "Your recent BMI reading is {{BMI}}. You are classified as severely obese. Please consult a healthcare provider immediately for personalized advice.",
                sendAlert   : true,
                priority    : 1
            }
        ]
    };
};
