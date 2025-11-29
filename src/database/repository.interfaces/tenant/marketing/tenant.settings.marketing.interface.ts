import {
    TenantSettingsMarketingDomainModel,
    TenantSettingsMarketingDto,
    TenantMarketingStyling,
    TenantMarketingContent,
    TenantMarketingQRCode,
    TenantMarketingImages,
    TenantMarketingLogos,
} from "../../../../domain.types/tenant/marketing/tenant.settings.marketing.types";

///////////////////////////////////////////////////////////////////////////////////////////

export interface ITenantSettingsMarketingRepo {
    createDefaultSettings(tenantId: string, model: TenantSettingsMarketingDomainModel): Promise<TenantSettingsMarketingDto>;
    getSettings(tenantId: string): Promise<TenantSettingsMarketingDto>;
    updateStyling(tenantId: string, settings: TenantMarketingStyling): Promise<TenantSettingsMarketingDto>;
    updateContent(tenantId: string, settings: TenantMarketingContent): Promise<TenantSettingsMarketingDto>;
    updateQRCode(tenantId: string, settings: TenantMarketingQRCode): Promise<TenantSettingsMarketingDto>;
    updateImages(tenantId: string, settings: TenantMarketingImages): Promise<TenantSettingsMarketingDto>;
    updateLogos(tenantId: string, settings: TenantMarketingLogos): Promise<TenantSettingsMarketingDto>;
    updatePDFResourceId(tenantId: string, resourceId: string): Promise<TenantSettingsMarketingDto>;
    delete(tenantId: string): Promise<boolean>;
}
