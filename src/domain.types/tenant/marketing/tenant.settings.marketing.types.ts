export interface TenantMarketingStyling {
    primary?: string;
    secondary?: string;
    accent?: string;
    lightBg?: string;
    panel?: string;
    muted?: string;
    text?: string;
    headingFont?: string;
    bodyFont?: string;
    pageWidth?: string;
    pageHeight?: string;
    userInterfaceWidth?: string;
    userInteractionWidth?: string;
    qrSize?: string;
}

export interface TenantMarketingContentSection {
    heading?: string;
    paragraph?: string;
}

export interface TenantMarketingContentIntroduction {
    introParagraph?: string;
    problemStatement?: string;
}

export interface TenantMarketingContentBenefits {
    title?: string;
    items?: string[];
}

export interface TenantMarketingContentFooter {
    ctaHeading?: string;
    ctaDescription?: string;
    qrInstruction?: string;
}

export interface TenantMarketingContentHeader {
    mainTitle?: string;
    subtitle?: string;
}

export interface TenantMarketingContent {
    header?: TenantMarketingContentHeader | null;
    introduction?: TenantMarketingContentIntroduction | null;
    benefits?: TenantMarketingContentBenefits | null;
    userInterface?: TenantMarketingContentSection | null;
    footer?: TenantMarketingContentFooter | null;
}

export type TenantMarketingQrCode = string | {
    resourceId?: string;
    [key: string]: unknown;
} | null;

export interface TenantMarketingImages {
    titleImage?: string;
    userInterfaceImage?: string;
    [key: string]: string | undefined;
}

export type TenantMarketingLogos = string[] | {
    [key: string]: string;
} | null;

export interface TenantSettingsMarketingDomainModel {
    Styling?: TenantMarketingStyling | null;
    Content?: TenantMarketingContent | null;
    QRcode?: TenantMarketingQrCode;
    Images?: TenantMarketingImages | null;
    Logos?: TenantMarketingLogos;
    PDFResourceId?: string | null;
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

