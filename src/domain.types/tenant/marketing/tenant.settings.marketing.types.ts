export interface TenantSettingsMarketingDomainModel {
    Styling? : any;  // JSON string stored in DB
    Content? : any;  // JSON string stored in DB
    QRcode?  : any;  // JSON string stored in DB
    Images?  : any;  // JSON string stored in DB
    Logos?   : any;  // JSON string stored in DB
    PDFResourceId?: string; // File resource id for generated PDF
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


