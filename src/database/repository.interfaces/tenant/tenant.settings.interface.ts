import {
    CommonSettings,
    ChatBotSettings,
    FormsSettings,
    TenantSettingsDomainModel,
    TenantSettingsDto,
    FollowupSettings,

} from "../../../domain.types/tenant/tenant.settings.types";

///////////////////////////////////////////////////////////////////////////////////////////

export interface ITenantSettingsRepo {
    createDefaultSettings(tenantId: string, model: TenantSettingsDomainModel): Promise<TenantSettingsDto>;
    getTenantSettings(tenantId: string): Promise<TenantSettingsDto>;
    updateCommonSettings(tenantId: string, settings: CommonSettings): Promise<TenantSettingsDto>;
    updateFollowupSettings(tenantId: string, settings: FollowupSettings): Promise<TenantSettingsDto>;
    updateChatBotSettings(tenantId: string, settings: ChatBotSettings): Promise<TenantSettingsDto>;
    updateFormsSettings(tenantId: string, settings: FormsSettings): Promise<TenantSettingsDto>;
    updateConsentSettings(tenantId: string, settings: any): Promise<TenantSettingsDto>;
}
