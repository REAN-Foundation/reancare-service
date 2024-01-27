import { ITenantSettingsRepo } from '../../database/repository.interfaces/tenant/tenant.settings.interface';
import { injectable, inject } from 'tsyringe';
import { ChatBotSettings, CommonSettings, FormsSettings, HealthcareInterfaces, PatientAppSettings, TenantSettingsDomainModel, TenantSettingsTypes } from '../../domain.types/tenant/tenant.settings.types';
import { TenantSettingsDto } from '../../domain.types/tenant/tenant.settings.types';
import { uuid } from '../../domain.types/miscellaneous/system.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class TenantSettingsService {

    constructor(
        @inject('ITenantSettingsRepo') private _tenantSettingsRepo: ITenantSettingsRepo,
    ) {}

    //#region Publics

    createDefaultSettings = async (tenantId: uuid, model: TenantSettingsDomainModel): Promise<TenantSettingsDto> => {
        return await this._tenantSettingsRepo.createDefaultSettings(tenantId, model);
    };

    public getTenantSettings = async (tenantId: uuid): Promise<TenantSettingsDto> => {
        return await this._tenantSettingsRepo.getTenantSettings(tenantId);
    };

    public getTenantSettingsByType = async (tenantId: uuid, settingsType: TenantSettingsTypes)
        : Promise<any> => {
            const settings = await this._tenantSettingsRepo.getTenantSettings(tenantId);
        if (settingsType === TenantSettingsTypes.HealthcareInterfaces) {
            return settings.HealthcareInterfaces;
        }
        if (settingsType === TenantSettingsTypes.Common) {
            return settings.Common;
        }
        if (settingsType === TenantSettingsTypes.PatientApp) {
            return settings.PatientApp;
        }
        if (settingsType === TenantSettingsTypes.ChatBot) {
            return settings.ChatBot;
        }
        if (settingsType === TenantSettingsTypes.Forms) {
            return settings.Forms;
        }
        return settings;
    };

    public updateTenantSettingsByType = async (
        tenantId: uuid,
        settingsType: TenantSettingsTypes,
        settings: HealthcareInterfaces|CommonSettings|PatientAppSettings|ChatBotSettings|FormsSettings)
            : Promise<TenantSettingsDto> => {
        if (settingsType === TenantSettingsTypes.HealthcareInterfaces) {
            return await this._tenantSettingsRepo.updateHealthcareInterfaces(tenantId, settings as HealthcareInterfaces);
        }
        if (settingsType === TenantSettingsTypes.Common) {
            return await this._tenantSettingsRepo.updateCommonSettings(tenantId, settings as CommonSettings);
        }
        if (settingsType === TenantSettingsTypes.PatientApp) {
            return await this._tenantSettingsRepo.updatePatientAppSettings(tenantId, settings as PatientAppSettings);
        }
        if (settingsType === TenantSettingsTypes.ChatBot) {
            return await this._tenantSettingsRepo.updateChatBotSettings(tenantId, settings as ChatBotSettings);
        }
        if (settingsType === TenantSettingsTypes.Forms) {
            return await this._tenantSettingsRepo.updateFormsSettings(tenantId, settings as FormsSettings);
        }
        return await this._tenantSettingsRepo.getTenantSettings(tenantId);
    };

    public updateTenantSettings = async (tenantId: uuid, model: TenantSettingsDomainModel): Promise<TenantSettingsDto> => {
        await this._tenantSettingsRepo.updateHealthcareInterfaces(tenantId, model.HealthcareInterfaces);
        await this._tenantSettingsRepo.updateCommonSettings(tenantId, model.Common);
        await this._tenantSettingsRepo.updatePatientAppSettings(tenantId, model.PatientApp);
        await this._tenantSettingsRepo.updateChatBotSettings(tenantId, model.ChatBot);
        await this._tenantSettingsRepo.updateFormsSettings(tenantId, model.Forms);
        return await this._tenantSettingsRepo.getTenantSettings(tenantId);
    };

    //#endregion

}
