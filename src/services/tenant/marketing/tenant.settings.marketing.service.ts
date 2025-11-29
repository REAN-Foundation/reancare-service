import { injectable, inject } from 'tsyringe';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { ITenantSettingsMarketingRepo } from '../../../database/repository.interfaces/tenant/marketing/tenant.settings.marketing.interface';
import {
    TenantSettingsMarketingDto,
    TenantSettingsMarketingDomainModel,
    TenantSettingsMarketingTypes,
    TenantMarketingStyling,
    TenantMarketingContent,
    TenantMarketingQRCode,
    TenantMarketingImages,
    TenantMarketingLogos,
} from '../../../domain.types/tenant/marketing/tenant.settings.marketing.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class TenantSettingsMarketingService {

    constructor(
        @inject('ITenantSettingsMarketingRepo') private _repo: ITenantSettingsMarketingRepo,
    ) {}

    createDefaultSettings = async (
        tenantId: uuid,
        model: TenantSettingsMarketingDomainModel
    ): Promise<TenantSettingsMarketingDto> => {
        const defaults = this.getDefaultSettings();
        const mergedModel: TenantSettingsMarketingDomainModel = {
            Styling       : model.Styling ?? defaults.Styling,
            Content       : model.Content ?? defaults.Content,
            QRCode        : model.QRCode ?? null,
            Images        : model.Images ?? null,
            Logos         : model.Logos ?? null,
            PDFResourceId : model.PDFResourceId ?? null,
        };
        return await this._repo.createDefaultSettings(tenantId, mergedModel);
    };

    getSettings = async (tenantId: uuid): Promise<TenantSettingsMarketingDto> => {
        return await this._repo.getSettings(tenantId);
    };

    getSettingsByType = async (
        tenantId: uuid,
        type: TenantSettingsMarketingTypes
    ): Promise<
        TenantMarketingStyling |
        TenantMarketingContent |
        TenantMarketingQRCode |
        TenantMarketingImages |
        TenantMarketingLogos |
        TenantSettingsMarketingDto |
        null
    > => {
        const settings = await this._repo.getSettings(tenantId);
        if (!settings) {
            return null;
        }

        switch (type) {
            case TenantSettingsMarketingTypes.Styling:
                return settings.Styling;
            case TenantSettingsMarketingTypes.Content:
                return settings.Content;
            case TenantSettingsMarketingTypes.QRCode:
                return settings.QRCode;
            case TenantSettingsMarketingTypes.Images:
                return settings.Images;
            case TenantSettingsMarketingTypes.Logos:
                return settings.Logos;
            default:
                return settings;
        }
    };

    updateSettingsByType = async (
        tenantId: uuid,
        type: TenantSettingsMarketingTypes,
        payload: TenantMarketingStyling |
            TenantMarketingContent |
            TenantMarketingQRCode |
            TenantMarketingImages |
            TenantMarketingLogos
    ): Promise<TenantSettingsMarketingDto> => {
        switch (type) {
            case TenantSettingsMarketingTypes.Styling:
                return await this._repo.updateStyling(tenantId, payload as TenantMarketingStyling);
            case TenantSettingsMarketingTypes.Content:
                return await this._repo.updateContent(tenantId, payload as TenantMarketingContent);
            case TenantSettingsMarketingTypes.QRCode:
                return await this._repo.updateQRCode(tenantId, payload as TenantMarketingQRCode);
            case TenantSettingsMarketingTypes.Images:
                return await this._repo.updateImages(tenantId, payload as TenantMarketingImages);
            case TenantSettingsMarketingTypes.Logos:
                return await this._repo.updateLogos(tenantId, payload as TenantMarketingLogos);
            default:
                return await this._repo.getSettings(tenantId);
        }
    };

    deleteSettings = async (tenantId: uuid): Promise<boolean> => {
        return await this._repo.delete(tenantId);
    };

    updatePdfResourceId = async (tenantId: uuid, resourceId: string): Promise<TenantSettingsMarketingDto> => {
        return await this._repo.updatePDFResourceId(tenantId, resourceId);
    };

    private getDefaultSettings = (): TenantSettingsMarketingDomainModel => {
        const styling = {
            Primary              : '#1a472a',
            Secondary            : '#2d5f3f',
            Accent               : '#25D366',
            LightBg              : '#f1f8f4',
            Panel                : '#ffffff',
            Muted                : '#555',
            Text                 : '#222',
            HeadingFont          : "'Poppins', sans-serif",
            BodyFont             : "'Inter', sans-serif",
            PageWidth            : '210mm',
            PageHeight           : '297mm',
            UserInterfaceWidth   : '260px',
            UserInteractionWidth : '250px',
            QrSize               : '120px',
        };

        const content = {
            Header : {
                MainTitle : 'Your Health Program Name',
                Subtitle  : 'Your Personalized Companion for Health and Wellness',
            },
            Introduction : {
                IntroParagraph : [
                    'Welcome to our health program.',
                    'This comprehensive platform provides you with personalized support, guidance, and resources',
                    'to help you achieve your health goals.',
                ].join(' '),
                ProblemStatement : [
                    'Many individuals struggle with managing their health effectively due to lack of personalized guidance,',
                    'difficulty tracking progress, and limited access to timely support.',
                    'Our program addresses these challenges by providing a structured, easy-to-use platform',
                    'that puts your health journey at your fingertips.',
                ].join(' '),
            },
            Benefits : {
                Title : 'Key Benefits',
                Items : [
                    'Access personalized health recommendations and care plans',
                    'Track your health metrics and progress over time',
                    'Receive timely reminders and health tips',
                    'Connect with healthcare professionals when needed',
                    'Access educational resources tailored to your needs',
                ],
            },
            UserInterface : {
                Heading   : 'Who Can Benefit from This Program',
                Paragraph : [
                    'This program is designed for individuals seeking to take control of their health journey.',
                    'Whether you are managing a chronic condition, working on preventive care,',
                    'or simply looking to improve your overall wellness, our platform provides personalized support',
                    'to meet your unique needs.',
                ].join(' '),
            },
            Footer : {
                CtaHeading     : 'Get Started Today',
                CtaDescription : [
                    'Register by scanning the QR code or contacting us through your preferred channel.',
                    'Join our community and take the first step towards better health.',
                ].join(' '),
                QrInstruction : 'Scan to get started',
            },
        };

        return {
            Styling : styling,
            Content : content,
            QRCode  : null,
            Images  : null,
            Logos   : null,
        };
    };

}

