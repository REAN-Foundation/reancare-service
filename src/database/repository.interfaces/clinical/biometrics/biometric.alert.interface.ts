import { PulseAlertModel } from "../../../../domain.types/clinical/biometrics/alert.notificattion/pulse";
import { BloodGlucoseAlertModel } from "../../../../domain.types/clinical/biometrics/alert.notificattion/blood.glucose";
import { BloodPressureAlertModel } from "../../../../domain.types/clinical/biometrics/alert.notificattion/blood.pressure";
import { BiometricAlertSettings } from "../../../../domain.types/clinical/biometrics/biometrics.types";
import { BodyTemperatureAlertModel } from "../../../../domain.types/clinical/biometrics/alert.notificattion/body.temperature";
import { BodyBmiAlertModel } from "../../../../domain.types/clinical/biometrics/alert.notificattion/body.bmi";
import { BloodOxygenAlertModel } from "../../../../domain.types/clinical/biometrics/alert.notificattion/blood.oxygen.saturation";

///////////////////////////////////////////////////////////////////////////////

export interface IBiometricAlertHandler {
    
    bloodPressureAlert(model: BloodPressureAlertModel, metaData?: BiometricAlertSettings | null): Promise<void>;
    
    bloodGlucoseAlert(model: BloodGlucoseAlertModel, metaData?: BiometricAlertSettings | null): Promise<void>;
    
    pulseAlert(model: PulseAlertModel, metaData?: BiometricAlertSettings | null): Promise<void>;
    
    bodyTemperatureAlert(model: BodyTemperatureAlertModel, metaData?: BiometricAlertSettings | null): Promise<void>;

    bloodOxygenSaturationAlert(model: BloodOxygenAlertModel, metaData?: BiometricAlertSettings | null): Promise<void>;

    bmiAlert(model: BodyBmiAlertModel, metaData?: BiometricAlertSettings | null): Promise<void>;
}
