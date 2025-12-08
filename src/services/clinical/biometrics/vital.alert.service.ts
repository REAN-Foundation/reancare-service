import { injectable, inject } from 'tsyringe';
import { Logger } from '../../../common/logger';
import { IUserRepo } from '../../../database/repository.interfaces/users/user/user.repo.interface';
import { ITenantSettingsRepo } from '../../../database/repository.interfaces/tenant/tenant.settings.interface';
import {
    VitalAlertSettings,
    BloodPressureAlertRule,
    PulseAlertRule,
    BloodGlucoseAlertRule,
    BodyTemperatureAlertRule,
    BloodOxygenSaturationAlertRule,
    BodyBmiAlertRule,
    MatchedVitalAlert,
    VitalType,
    getDefaultVitalAlertSettings,
} from '../../../domain.types/tenant/tenant.settings.types';

///////////////////////////////////////////////////////////////////////////////

@injectable()
export class VitalAlertService {

    constructor(
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('ITenantSettingsRepo') private _tenantSettingsRepo: ITenantSettingsRepo,
    ) {}

    /**
     * Get vital alert settings for a specific tenant
     */
    public getVitalAlertSettingsForTenant = async (tenantId: string): Promise<VitalAlertSettings> => {
        try {
            const settings = await this._tenantSettingsRepo.getTenantSettings(tenantId);
            if (settings?.VitalAlertSettings) {
                return settings.VitalAlertSettings;
            }
            // Return default settings if tenant settings not found
            return getDefaultVitalAlertSettings();
        } catch (error) {
            Logger.instance().log(`Error getting vital alert settings for tenant ${tenantId}: ${error}`);
            return getDefaultVitalAlertSettings();
        }
    };

    /**
     * Get vital alert settings for a user based on their tenant
     */
    public getVitalAlertSettingsForUser = async (patientUserId: string): Promise<VitalAlertSettings> => {
        try {
            const user = await this._userRepo.getById(patientUserId);
            if (!user || !user.TenantId) {
                Logger.instance().log(`User or TenantId not found for user ${patientUserId}, using default settings`);
                return getDefaultVitalAlertSettings();
            }
            return await this.getVitalAlertSettingsForTenant(user.TenantId);
        } catch (error) {
            Logger.instance().log(`Error getting vital alert settings for user ${patientUserId}: ${error}`);
            return getDefaultVitalAlertSettings();
        }
    };

    /**
     * Match blood pressure values against tenant-specific rules
     * Returns the matched rule with highest priority (lowest number = highest priority)
     */
    public matchBloodPressure = (
        systolic: number,
        diastolic: number,
        rules: BloodPressureAlertRule[]
    ): MatchedVitalAlert | null => {
        if (!rules || rules.length === 0) {
            return null;
        }

        // Sort rules by priority (ascending - lower number = higher priority)
        const sortedRules = [...rules].sort((a, b) => a.priority - b.priority);

        for (const rule of sortedRules) {
            const systolicMatch = systolic >= rule.systolic.min && systolic <= rule.systolic.max;
            const diastolicMatch = diastolic >= rule.diastolic.min && diastolic <= rule.diastolic.max;

            // Match if either systolic OR diastolic falls in range (OR logic for alerts)
            if (systolicMatch || diastolicMatch) {
                return {
                    category     : rule.category,
                    alertMessage : rule.alertMessage,
                    sendAlert    : rule.sendAlert,
                    priority     : rule.priority,
                    vitalType    : VitalType.BloodPressure,
                };
            }
        }
        return null;
    };

    /**
     * Match pulse value against tenant-specific rules
     */
    public matchPulse = (pulse: number, rules: PulseAlertRule[]): MatchedVitalAlert | null => {
        if (!rules || rules.length === 0) {
            return null;
        }

        const sortedRules = [...rules].sort((a, b) => a.priority - b.priority);

        for (const rule of sortedRules) {
            if (pulse >= rule.pulse.min && pulse <= rule.pulse.max) {
                return {
                    category     : rule.category,
                    alertMessage : rule.alertMessage,
                    sendAlert    : rule.sendAlert,
                    priority     : rule.priority,
                    vitalType    : VitalType.Pulse,
                };
            }
        }
        return null;
    };

    /**
     * Match blood glucose value against tenant-specific rules
     */
    public matchBloodGlucose = (
        bloodGlucose: number,
        rules: BloodGlucoseAlertRule[]
    ): MatchedVitalAlert | null => {
        if (!rules || rules.length === 0) {
            return null;
        }

        const sortedRules = [...rules].sort((a, b) => a.priority - b.priority);

        for (const rule of sortedRules) {
            if (bloodGlucose >= rule.bloodGlucose.min && bloodGlucose <= rule.bloodGlucose.max) {
                return {
                    category     : rule.category,
                    alertMessage : rule.alertMessage,
                    sendAlert    : rule.sendAlert,
                    priority     : rule.priority,
                    vitalType    : VitalType.BloodGlucose,
                };
            }
        }
        return null;
    };

    /**
     * Match body temperature value against tenant-specific rules
     * Converts to Fahrenheit if needed based on rule unit
     */
    public matchBodyTemperature = (
        temperature: number,
        temperatureUnit: string,
        rules: BodyTemperatureAlertRule[]
    ): MatchedVitalAlert | null => {
        if (!rules || rules.length === 0) {
            return null;
        }

        // Convert temperature to Fahrenheit for comparison (rules are stored in Fahrenheit)
        const celsiusUnits = ['celsius', '°c', 'c'];
        let tempInFahrenheit = temperature;
        if (celsiusUnits.includes(temperatureUnit?.toLowerCase())) {
            tempInFahrenheit = (temperature * 1.8) + 32;
        }

        const sortedRules = [...rules].sort((a, b) => a.priority - b.priority);

        for (const rule of sortedRules) {
            if (tempInFahrenheit >= rule.temperature.min && tempInFahrenheit <= rule.temperature.max) {
                return {
                    category     : rule.category,
                    alertMessage : rule.alertMessage,
                    sendAlert    : rule.sendAlert,
                    priority     : rule.priority,
                    vitalType    : VitalType.BodyTemperature,
                };
            }
        }
        return null;
    };

    /**
     * Match blood oxygen saturation value against tenant-specific rules
     */
    public matchBloodOxygenSaturation = (
        oxygenSaturation: number,
        rules: BloodOxygenSaturationAlertRule[]
    ): MatchedVitalAlert | null => {
        if (!rules || rules.length === 0) {
            return null;
        }

        const sortedRules = [...rules].sort((a, b) => a.priority - b.priority);

        for (const rule of sortedRules) {
            if (oxygenSaturation >= rule.oxygenSaturation.min && oxygenSaturation <= rule.oxygenSaturation.max) {
                return {
                    category     : rule.category,
                    alertMessage : rule.alertMessage,
                    sendAlert    : rule.sendAlert,
                    priority     : rule.priority,
                    vitalType    : VitalType.BloodOxygenSaturation,
                };
            }
        }
        return null;
    };

    /**
     * Match BMI value against tenant-specific rules
     */
    public matchBodyBmi = (bmi: number, rules: BodyBmiAlertRule[]): MatchedVitalAlert | null => {
        if (!rules || rules.length === 0) {
            return null;
        }

        const sortedRules = [...rules].sort((a, b) => a.priority - b.priority);

        for (const rule of sortedRules) {
            if (bmi >= rule.bmi.min && bmi <= rule.bmi.max) {
                return {
                    category     : rule.category,
                    alertMessage : rule.alertMessage,
                    sendAlert    : rule.sendAlert,
                    priority     : rule.priority,
                    vitalType    : VitalType.BodyBmi,
                };
            }
        }
        return null;
    };

    /**
     * Format alert message by replacing placeholders with actual values
     */
    public formatAlertMessage = (
        message: string,
        values: { [key: string]: string | number }
    ): string => {
        let formattedMessage = message;
        for (const [key, value] of Object.entries(values)) {
            formattedMessage = formattedMessage.replace(
                new RegExp(`{{${key}}}`, 'g'),
                String(value)
            );
        }
        return formattedMessage;
    };

}
