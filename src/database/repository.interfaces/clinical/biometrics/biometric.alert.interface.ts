import { PulseAlertCreateModel } from "../../../../domain.types/clinical/biometrics/alert.notificattion/pulse";
import { BloodGlucoseAlertCreateModel } from "../../../../domain.types/clinical/biometrics/alert.notificattion/blood.glucose";
import { BloodPressureAlertCreateModel } from "../../../../domain.types/clinical/biometrics/alert.notificattion/blood.pressure";
import { BiometricAlertSettings } from "../../../../domain.types/clinical/biometrics/biometrics.types";
import { BodyTemperatureAlertCreateModel } from "../../../../domain.types/clinical/biometrics/alert.notificattion/body.temperature";
import { BodyBmiAlertCreateModel } from "../../../../domain.types/clinical/biometrics/alert.notificattion/body.bmi";
import { BloodOxygenAlertCreateModel } from "../../../../domain.types/clinical/biometrics/alert.notificattion/blood.oxygen.saturation";

///////////////////////////////////////////////////////////////////////////////

export interface IBiometricAlert {
    
    bloodPressureAlert(model: BloodPressureAlertCreateModel, metaData?: BiometricAlertSettings | null): Promise<void>;
    
    bloodGlucoseAlert(model: BloodGlucoseAlertCreateModel, metaData?: BiometricAlertSettings | null): Promise<void>;
    
    pulseAlert(model: PulseAlertCreateModel, metaData?: BiometricAlertSettings | null): Promise<void>;
    
    bodyTemperatureAlert(model: BodyTemperatureAlertCreateModel, metaData?: BiometricAlertSettings | null): Promise<void>;

    bloodOxygenSaturationAlert(model: BloodOxygenAlertCreateModel, metaData?: BiometricAlertSettings | null): Promise<void>;

    bmiAlert(model: BodyBmiAlertCreateModel, metaData?: BiometricAlertSettings | null): Promise<void>;
}
