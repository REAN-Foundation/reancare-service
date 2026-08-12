export interface TenantMarketingStyling {
    Primary?: string;
    Secondary?: string;
    Accent?: string;
    LightBg?: string;
    Panel?: string;
    Muted?: string;
    Text?: string;
    HeadingFont?: string;
    BodyFont?: string;
    PageWidth?: string;
    PageHeight?: string;
    UserInterfaceWidth?: string;
    UserInteractionWidth?: string;
    QrSize?: string;
}

export interface TenantMarketingContentSection {
    Heading?: string;
    Paragraph?: string;
}

export interface TenantMarketingContentIntroduction {
    IntroParagraph?: string;
    ProblemStatement?: string;
}

export interface TenantMarketingContentBenefits {
    Title?: string;
    Items?: string[];
}

export interface TenantMarketingContentFooter {
    CtaHeading?: string;
    CtaDescription?: string;
    QrInstruction?: string;
}

export interface TenantMarketingContentHeader {
    MainTitle?: string;
    Subtitle?: string;
}

export interface TenantMarketingContent {
    Header?: TenantMarketingContentHeader | null;
    Introduction?: TenantMarketingContentIntroduction | null;
    Benefits?: TenantMarketingContentBenefits | null;
    UserInterface?: TenantMarketingContentSection | null;
    Footer?: TenantMarketingContentFooter | null;
}

export type TenantMarketingQRCode = string | {
    ResourceId?: string;
    [key: string]: unknown;
} | null;

export interface TenantMarketingImages {
    TitleImage?: string;
    UserInterfaceImage?: string;
    [key: string]: string | undefined;
}

export type TenantMarketingLogos = string[] | {
    [key: string]: string;
} | null;

export interface TenantSettingsMarketingDomainModel {
    Styling?: TenantMarketingStyling | null;
    Content?: TenantMarketingContent | null;
    QRCode?: TenantMarketingQRCode;
    Images?: TenantMarketingImages | null;
    Logos?: TenantMarketingLogos;
    PDFResourceId?: string | null;
    PageView?: number | null;
}

export interface TenantSettingsMarketingDto extends TenantSettingsMarketingDomainModel {
    TenantId?: string;
}

export enum TenantSettingsMarketingTypes {
    Styling  = 'Styling',
    Content  = 'Content',
    QRCode   = 'QRCode',
    Images   = 'Images',
    Logos    = 'Logos',
    PageView = 'PageView',
}

export const TenantSettingsMarketingTypesList = [
    TenantSettingsMarketingTypes.Styling,
    TenantSettingsMarketingTypes.Content,
    TenantSettingsMarketingTypes.QRCode,
    TenantSettingsMarketingTypes.Images,
    TenantSettingsMarketingTypes.Logos,
    TenantSettingsMarketingTypes.PageView,
];
