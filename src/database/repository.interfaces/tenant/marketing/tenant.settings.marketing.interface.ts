import { TenantSettingsMarketingDomainModel, TenantSettingsMarketingDto } from "../../../../domain.types/tenant/marketing/tenant.settings.marketing.types";

///////////////////////////////////////////////////////////////////////////////////////////

export interface ITenantSettingsMarketingRepo {
    createDefaultSettings(tenantId: string, model: TenantSettingsMarketingDomainModel): Promise<TenantSettingsMarketingDto>;
    getSettings(tenantId: string): Promise<TenantSettingsMarketingDto>;
    updateStyling(tenantId: string, settings: any): Promise<TenantSettingsMarketingDto>;
    updateContent(tenantId: string, settings: any): Promise<TenantSettingsMarketingDto>;
    updateQRCode(tenantId: string, settings: any): Promise<TenantSettingsMarketingDto>;
    updateImages(tenantId: string, settings: any): Promise<TenantSettingsMarketingDto>;
    updateLogos(tenantId: string, settings: any): Promise<TenantSettingsMarketingDto>;
    updatePDFResourceId(tenantId: string, resourceId: string): Promise<TenantSettingsMarketingDto>;
    delete(tenantId: string): Promise<boolean>;
}
