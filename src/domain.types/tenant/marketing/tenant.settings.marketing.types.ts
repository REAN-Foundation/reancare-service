export interface TenantSettingsMarketingDomainModel {
    Styling? : any;
    Content? : any;
    QRcode?  : any;
    Images?  : any;
    Logos?   : any;
    PDFResourceId?: string;
}

export interface TenantSettingsMarketingDto extends TenantSettingsMarketingDomainModel {
    TenantId?: string;
}

export enum TenantSettingsMarketingTypes {
    Styling = 'Styling',
    Content = 'Content',
    QRcode  = 'QRcode',
    Images  = 'Images',
    Logos   = 'Logos',
}

export const TenantSettingsMarketingTypesList = [
    TenantSettingsMarketingTypes.Styling,
    TenantSettingsMarketingTypes.Content,
    TenantSettingsMarketingTypes.QRcode,
    TenantSettingsMarketingTypes.Images,
    TenantSettingsMarketingTypes.Logos,
];

