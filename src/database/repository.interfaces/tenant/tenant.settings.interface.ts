import {
    UserInterfaces,
    CommonSettings,
    PatientAppSettings,
    ChatBotSettings,
    FormsSettings,
    TenantSettingsDomainModel,
    TenantSettingsDto
} from "../../../domain.types/tenant/tenant.settings.types";

///////////////////////////////////////////////////////////////////////////////////////////

export interface ITenantSettingsRepo {

    createDefaultSettings(tenantId: string, model: TenantSettingsDomainModel): Promise<TenantSettingsDto>;
    getTenantSettings(tenantId: string): Promise<TenantSettingsDto>;
    updateHealthcareInterfaces(tenantId: string, settings: UserInterfaces): Promise<TenantSettingsDto>;
    updateCommonSettings(tenantId: string, settings: CommonSettings): Promise<TenantSettingsDto>;
    updatePatientAppSettings(tenantId: string, settings: PatientAppSettings): Promise<TenantSettingsDto>;
    updateChatBotSettings(tenantId: string, settings: ChatBotSettings): Promise<TenantSettingsDto>;
    updateFormsSettings(tenantId: string, settings: FormsSettings): Promise<TenantSettingsDto>;

}
