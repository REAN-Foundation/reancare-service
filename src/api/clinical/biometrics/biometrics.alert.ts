import { BloodGlucoseDto } from "../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.dto";
import { Logger } from "../../../common/logger";
import { BiometricAlertHandler } from "./biometrics.alert.handler";
import { AlertNotification, Severity } from "../../../domain.types/clinical/biometrics/biometrics.types";
import {
    BloodGlucoseAlertCreateModel,
    GLUCOSE_HIGH_MAX,
    GLUCOSE_HIGH_MIN,
    GLUCOSE_LOW_THRESHOLD,
    GLUCOSE_NORMAL_MAX,
    GLUCOSE_NORMAL_MIN,
    GLUCOSE_VERY_HIGH_THRESHOLD,
    glucoseNotificationTemplate } from "../../../domain.types/clinical/biometrics/alert.notificattion/blood.glucose";
import { BloodPressureDto } from "../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.dto";
import { BloodPressureAlertCreateModel, bloodPressureNotificationTemplate } from "../../../domain.types/clinical/biometrics/alert.notificattion/blood.pressure";
import {
    PulseAlertCreateModel,
    PULSE_LOW_THRESHOLD,
    pulseNotificationTemplate,
    PULSE_NORMAL_MIN,
    PULSE_NORMAL_MAX,
    PULSE_HIGH_THRESHOLD
} from "../../../domain.types/clinical/biometrics/alert.notificattion/pulse";
import { PulseDto } from "../../../domain.types/clinical/biometrics/pulse/pulse.dto";
import { BodyTemperatureDto } from "../../../domain.types/clinical/biometrics/body.temperature/body.temperature.dto";
import { BodyTemperatureAlertCreateModel, bodyTemperatureNotificationTemplate, bodyTemperatureUnits, TEMP_ELEVATED_MAX, TEMP_ELEVATED_MIN, TEMP_FEVER_MAX, TEMP_FEVER_MIN, TEMP_HIGH_THRESHOLD, TEMP_LOW_THRESHOLD, TEMP_NORMAL_MAX, TEMP_NORMAL_MIN } from "../../../domain.types/clinical/biometrics/alert.notificattion/body.temperature";
import { BloodOxygenSaturationDto } from "../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.dto";
import { BloodOxygenAlertCreateModel, bloodOxygenNotificationTemplate, OXYGEN_LOW_RANGE_MIN, OXYGEN_LOW_THRESHOLD, OXYGEN_NORMAL_MAX, OXYGEN_NORMAL_MIN } from "../../../domain.types/clinical/biometrics/alert.notificattion/blood.oxygen.saturation";
import { BodyWeightDto } from "../../../domain.types/clinical/biometrics/body.weight/body.weight.dto";
import { BodyHeightDto } from "../../../domain.types/clinical/biometrics/body.height/body.height.dto";
import { BMI_NORMAL_MAX, BMI_NORMAL_MIN, BMI_OBESE_THRESHOLD, BMI_OVERWEIGHT_MAX, BMI_OVERWEIGHT_MIN, BMI_UNDERWEIGHT_THRESHOLD, BodyBmiAlertCreateModel, weightNotificationTemplate } from "../../../domain.types/clinical/biometrics/alert.notificattion/body.bmi";

///////////////////////////////////////////////////////////////////////////////

enum BloodPressureCategory {
    Normal = 1,
    Elevated = 2,
    HypertensionStage1 = 3,
    HypertensionStage2 = 4,
    HypertensiveCrisis = 5
}

///////////////////////////////////////////////////////////////////////////////

export class BiometricAlerts {

    static async forBloodGlucose(model: BloodGlucoseDto) {
        try {
            const notification = BiometricAlerts.getGlucoseNotification(model.BloodGlucose);
            if (!notification) {
                return;
            }
            const glucoseAlertmodel: BloodGlucoseAlertCreateModel = {};
            glucoseAlertmodel.PatientUserId = model.PatientUserId;
            glucoseAlertmodel.BloodGlucose = model.BloodGlucose;
            glucoseAlertmodel.GlucoseNotification = notification;

            BiometricAlertHandler.BloodGlucoseAlert(glucoseAlertmodel);
        } catch (error) {
            Logger.instance().log(`Error in sending blood glucose alert notification : ${error}`);
        }
    }

    static async forBloodPressure(model: BloodPressureDto) {
        try {
            const notification = BiometricAlerts.getBloodPressureNotification(model.Systolic, model.Diastolic);
            if (!notification) {
                return;
            }
            const bloodPressureAlertmodel: BloodPressureAlertCreateModel = {};
            bloodPressureAlertmodel.PatientUserId = model.PatientUserId;
            bloodPressureAlertmodel.Systolic = model.Systolic;
            bloodPressureAlertmodel.Diastolic = model.Diastolic;
            bloodPressureAlertmodel.BloodPressureNotification = notification;

            BiometricAlertHandler.BloodPressureAlert(bloodPressureAlertmodel);
        } catch (error) {
            Logger.instance().log(`Error in sending blood glucose alert notification : ${error}`);
        }
    }

    static async forPulse(model: PulseDto) {
        try {
            const notification = BiometricAlerts.getPulseNotification(model.Pulse!);
            if (!notification) {
                return;
            }
            const pulseAlertModel: PulseAlertCreateModel = {};
            pulseAlertModel.PatientUserId = model.PatientUserId;
            pulseAlertModel.Pulse = model.Pulse;
            pulseAlertModel.PulseNotification = notification;

            BiometricAlertHandler.PulseAlert(pulseAlertModel);
        } catch (error) {
            Logger.instance().log(`Error in sending pulse alert notification : ${error}`);
        }
    }

    static async forBodyTemperature(model: BodyTemperatureDto) {
        try {
            const tempInFarenheit = bodyTemperatureUnits.includes(model.Unit?.toLowerCase()) ?
                (model.BodyTemperature * 1.8) + 32 : model.BodyTemperature;

            const notification = BiometricAlerts.getTemperatureNotification(tempInFarenheit);
            if (!notification) {
                return;
            }
            const temperatureAlertModel: BodyTemperatureAlertCreateModel = {};
            temperatureAlertModel.PatientUserId = model.PatientUserId;
            temperatureAlertModel.BodyTemperature = model.BodyTemperature;
            temperatureAlertModel.TemperatureNotification = notification;

            BiometricAlertHandler.BodyTemperatureAlert(temperatureAlertModel);
        } catch (error) {
            Logger.instance().log(`Error in sending body temperature alert notification : ${error}`);
        }
    }

    static async forBloodOxygenSaturation(model: BloodOxygenSaturationDto) {
        try {
            const notification = BiometricAlerts.getOxygenNotification(model.BloodOxygenSaturation);
            if (!notification) {
                return;
            }
            const oxygenAlertModel: BloodOxygenAlertCreateModel = {};
            oxygenAlertModel.PatientUserId = model.PatientUserId;
            oxygenAlertModel.BloodOxygenSaturation = model.BloodOxygenSaturation;
            oxygenAlertModel.OxygenNotification = notification;

            BiometricAlertHandler.BloodOxygenSaturationAlert(oxygenAlertModel);
        } catch (error) {
            Logger.instance().log(`Error in sending blood oxygen saturation alert notification : ${error}`);
        }
    }
    
    static async forBodyBMI(bodyWeightRecord: BodyWeightDto, bodyHeightRecord: BodyHeightDto) {
        try {
            const bmi = BiometricAlerts.calculateBMI(bodyWeightRecord.BodyWeight, bodyHeightRecord.BodyHeight);

            const notification = BiometricAlerts.getBmiNotification(bmi);
            if (!notification) {
                return;
            }
            const bmiAlertModel: BodyBmiAlertCreateModel = {};
            bmiAlertModel.PatientUserId = bodyWeightRecord.PatientUserId;
            bmiAlertModel.Bmi = bmi;
            bmiAlertModel.BmiNotification = notification;
            
            BiometricAlertHandler.BmiAlert(bmiAlertModel);
        } catch (error) {
            Logger.instance().log(`Error in sending body temperature alert notification : ${error}`);
        }
    }

    private static getBmiNotification = (bmi: number): AlertNotification | null => {
        if (bmi < BMI_UNDERWEIGHT_THRESHOLD) {
            return weightNotificationTemplate.find(template => template.severity === Severity.LOW) || null;
        } else if (bmi >= BMI_NORMAL_MIN && bmi <= BMI_NORMAL_MAX) {
            return weightNotificationTemplate.find(template => template.severity === Severity.NORMAL) || null;
        } else if (bmi >= BMI_OVERWEIGHT_MIN && bmi <= BMI_OVERWEIGHT_MAX) {
            return weightNotificationTemplate.find(template => template.severity === Severity.HIGH) || null;
        } else if (bmi >= BMI_OBESE_THRESHOLD) {
            return weightNotificationTemplate.find(template => template.severity === Severity.VERY_HIGH) || null;
        }
        return null;
    };

    private static getOxygenNotification = (oxygenValue: number): AlertNotification | null => {
        if (oxygenValue < OXYGEN_LOW_THRESHOLD) {
            return bloodOxygenNotificationTemplate.find(template => template.severity === Severity.LOW) || null;
        } else if (oxygenValue >= OXYGEN_LOW_RANGE_MIN && oxygenValue <= (OXYGEN_NORMAL_MIN - 1)) {
            return bloodOxygenNotificationTemplate.find(template => template.severity === Severity.HIGH) || null;
        } else if (oxygenValue >= OXYGEN_NORMAL_MIN && oxygenValue <= OXYGEN_NORMAL_MAX) {
            return bloodOxygenNotificationTemplate.find(template => template.severity === Severity.NORMAL) || null;
        }
        return null;
    };

    private static getTemperatureNotification = (temperatureValue: number): AlertNotification | null => {
        if (temperatureValue < TEMP_LOW_THRESHOLD) {
            return bodyTemperatureNotificationTemplate.find(template => template.severity === Severity.LOW) || null;
        } else if (temperatureValue >= TEMP_NORMAL_MIN && temperatureValue <= TEMP_NORMAL_MAX) {
            return bodyTemperatureNotificationTemplate.find(template => template.severity === Severity.NORMAL) || null;
        } else if (temperatureValue >= TEMP_ELEVATED_MIN && temperatureValue <= TEMP_ELEVATED_MAX) {
            return bodyTemperatureNotificationTemplate.find(template => template.severity === Severity.ELEVATED) || null;
        } else if (temperatureValue >= TEMP_FEVER_MIN && temperatureValue <= TEMP_FEVER_MAX) {
            return bodyTemperatureNotificationTemplate.find(template => template.severity === Severity.HIGH) || null;
        } else if (temperatureValue >= TEMP_HIGH_THRESHOLD) {
            return bodyTemperatureNotificationTemplate.find(template => template.severity === Severity.VERY_HIGH) || null;
        }
        return null;
    };

    private static getPulseNotification = (pulseValue: number): AlertNotification | null => {
        if (pulseValue < PULSE_LOW_THRESHOLD) {
            return pulseNotificationTemplate.find(template => template.severity === Severity.LOW) || null;
        } else if (pulseValue >= PULSE_NORMAL_MIN && pulseValue <= PULSE_NORMAL_MAX) {
            return pulseNotificationTemplate.find(template => template.severity === Severity.NORMAL) || null;
        } else if (pulseValue > PULSE_HIGH_THRESHOLD) {
            return pulseNotificationTemplate.find(template => template.severity === Severity.HIGH) || null;
        }
        return null;
    };
    
    private static getGlucoseNotification = (glucoseValue: number): AlertNotification | null => {
        if (glucoseValue < GLUCOSE_LOW_THRESHOLD) {
            return glucoseNotificationTemplate.find(template => template.severity === Severity.LOW) || null;
        } else if (glucoseValue >= GLUCOSE_NORMAL_MIN && glucoseValue <= GLUCOSE_NORMAL_MAX) {
            return glucoseNotificationTemplate.find(template => template.severity === Severity.NORMAL) || null;
        } else if (glucoseValue >= GLUCOSE_HIGH_MIN && glucoseValue <= GLUCOSE_HIGH_MAX) {
            return glucoseNotificationTemplate.find(template => template.severity === Severity.HIGH) || null;
        } else if (glucoseValue >= GLUCOSE_VERY_HIGH_THRESHOLD) {
            return glucoseNotificationTemplate.find(template => template.severity === Severity.VERY_HIGH) || null;
        }
        return null;
    };

    private static getBloodPressureNotification = (systolic: number, diastolic: number): AlertNotification | null => {
        let systolicCategory: BloodPressureCategory;
        let diastolicCategory: BloodPressureCategory;

        if (systolic > 180) {
            systolicCategory = BloodPressureCategory.HypertensiveCrisis;
        } else if (systolic >= 140) {
            systolicCategory = BloodPressureCategory.HypertensionStage2;
        } else if (systolic >= 130) {
            systolicCategory = BloodPressureCategory.HypertensionStage1;
        } else if (systolic >= 120) {
            systolicCategory = BloodPressureCategory.Elevated;
        } else {
            systolicCategory = BloodPressureCategory.Normal;
        }

        if (diastolic > 120) {
            diastolicCategory = BloodPressureCategory.HypertensiveCrisis;
        } else if (diastolic >= 90) {
            diastolicCategory = BloodPressureCategory.HypertensionStage2;
        } else if (diastolic >= 80) {
            diastolicCategory = BloodPressureCategory.HypertensionStage1;
        } else {
            diastolicCategory = BloodPressureCategory.Normal;
        }
        const category =  systolicCategory > diastolicCategory ? systolicCategory : diastolicCategory;
        const bloodPressureCategory : Severity|null = BiometricAlerts.getSeverity(category);
        return bloodPressureNotificationTemplate.find(template => template.severity === bloodPressureCategory) || null;
    };

    private static getSeverity = (category: BloodPressureCategory): Severity|null => {
        switch (category) {
            case BloodPressureCategory.HypertensiveCrisis:
                return Severity.HYPERTENSIVE_CRISIS;
            case BloodPressureCategory.HypertensionStage2:
                return Severity.HYPERTENSION_STAGE2;
            case BloodPressureCategory.HypertensionStage1:
                return Severity.HYPERTENSION_STAGE1;
            case BloodPressureCategory.Elevated:
                return Severity.ELEVATED;
            case BloodPressureCategory.Normal:
                return Severity.NORMAL;
            default:
                return null;
        }
    };

    private static calculateBMI = (bodyWeightKg: number, bodyHeightCm: number): number =>{
        const heightInMeters = bodyHeightCm / 100;
        
        const bmi = bodyWeightKg / (heightInMeters * heightInMeters);
        
        return bmi;
    };

}
