import { Logger } from "../../../common/logger";
import { BiometricAlertHandler } from "./biometrics.alert.handler";
import { AlertNotification, Severity } from "../../../domain.types/clinical/biometrics/biometrics.types";
import { BloodPressureDto } from "../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.dto";
import { BloodPressureAlertCreateModel, bloodPressureNotificationTemplate } from "../../../domain.types/clinical/biometrics/alert.notificattion/blood.pressure";
import { Injector } from "../../../startup/injector";
import { UserService } from "../../../services/users/user/user.service";
import { SupportedLanguage } from "../../../domain.types/users/user/user.types";

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

    private static DEFAULT_USER_LANGUAGE_PREFERENCE = SupportedLanguage.English;

    private static resolveUserServiceDependency(): UserService {
        return Injector.Container.resolve(UserService);
    }

    static async forBloodPressure(model: BloodPressureDto) {
        try {
            const notification = BiometricAlerts.getBloodPressureNotification(model.Systolic, model.Diastolic);
            if (!notification || notification?.severity === Severity.NORMAL) {
                return;
            }
            const bloodPressureAlertmodel: BloodPressureAlertCreateModel = {};
            bloodPressureAlertmodel.PatientUserId = model.PatientUserId;
            bloodPressureAlertmodel.Systolic = model.Systolic;
            bloodPressureAlertmodel.Diastolic = model.Diastolic;

            const userLanguagePreference = await BiometricAlerts.getUserLanguagePreference(model.PatientUserId);
            bloodPressureAlertmodel.BloodPressureNotification = {
                severity : notification.severity,
                range    : notification.range,
                title    : notification.title[userLanguagePreference] ??
                notification.title[BiometricAlerts.DEFAULT_USER_LANGUAGE_PREFERENCE],
                message : notification.message[userLanguagePreference] ??
                notification.message[BiometricAlerts.DEFAULT_USER_LANGUAGE_PREFERENCE]
            };

            BiometricAlertHandler.BloodPressureAlert(bloodPressureAlertmodel);
        } catch (error) {
            Logger.instance().log(`Error in sending blood glucose alert notification : ${error}`);
        }
    }

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

    private static async getUserLanguagePreference(patientUserId: string): Promise<string> {
        try {
            const _userService = BiometricAlerts.resolveUserServiceDependency();
            const user = await _userService.getById(patientUserId);
            return user?.PreferredLanguage || SupportedLanguage.English;
        }
        catch (error) {
            Logger.instance().log(`Error in getting user language preference : ${error}`);
            return SupportedLanguage.English;
        }
    }

}
