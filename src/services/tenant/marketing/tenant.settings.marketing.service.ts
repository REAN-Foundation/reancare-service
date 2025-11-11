import { injectable, inject } from 'tsyringe';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { ITenantSettingsMarketingRepo } from '../../../database/repository.interfaces/tenant/marketing/tenant.settings.marketing.interface';
import { TenantSettingsMarketingDto, TenantSettingsMarketingDomainModel, TenantSettingsMarketingTypes } from '../../../domain.types/tenant/marketing/tenant.settings.marketing.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class TenantSettingsMarketingService {

    constructor(
        @inject('ITenantSettingsMarketingRepo') private _repo: ITenantSettingsMarketingRepo,
    ) {}

    createDefaultSettings = async (tenantId: uuid, model: TenantSettingsMarketingDomainModel): Promise<TenantSettingsMarketingDto> => {
        const defaults = this.getDefaultSettings();
        const mergedModel: TenantSettingsMarketingDomainModel = {
            Styling       : model.Styling ?? defaults.Styling,
            Content       : model.Content ?? defaults.Content,
            QRcode        : model.QRcode ?? null,
            Images        : model.Images ?? null,
            Logos         : model.Logos ?? null,
            PDFResourceId : model.PDFResourceId ?? null,
        };
        return await this._repo.createDefaultSettings(tenantId, mergedModel);
    };

    getSettings = async (tenantId: uuid): Promise<TenantSettingsMarketingDto> => {
        return await this._repo.getSettings(tenantId);
    };

    getSettingsByType = async (tenantId: uuid, type: TenantSettingsMarketingTypes): Promise<any> => {
        const settings = await this._repo.getSettings(tenantId);
        if (!settings) { return null; }
        if (type === TenantSettingsMarketingTypes.Styling) { return settings.Styling; }
        if (type === TenantSettingsMarketingTypes.Content) { return settings.Content; }
        if (type === TenantSettingsMarketingTypes.QRcode) { return settings.QRcode; }
        if (type === TenantSettingsMarketingTypes.Images) { return settings.Images; }
        if (type === TenantSettingsMarketingTypes.Logos) { return settings.Logos; }
        return settings;
    };

    updateSettingsByType = async (tenantId: uuid, type: TenantSettingsMarketingTypes, payload: any): Promise<TenantSettingsMarketingDto> => {
        if (type === TenantSettingsMarketingTypes.Styling) { return await this._repo.updateStyling(tenantId, payload); }
        if (type === TenantSettingsMarketingTypes.Content) { return await this._repo.updateContent(tenantId, payload); }
        if (type === TenantSettingsMarketingTypes.QRcode) { return await this._repo.updateQRcode(tenantId, payload); }
        if (type === TenantSettingsMarketingTypes.Images) { return await this._repo.updateImages(tenantId, payload); }
        if (type === TenantSettingsMarketingTypes.Logos) { return await this._repo.updateLogos(tenantId, payload); }
        return await this._repo.getSettings(tenantId);
    };

    deleteSettings = async (tenantId: uuid): Promise<boolean> => {
        return await this._repo.delete(tenantId);
    };

    private getDefaultSettings = (): TenantSettingsMarketingDomainModel => {
        const styling = {
            primary              : '#1a472a',
            secondary            : '#2d5f3f',
            accent               : '#25D366',
            lightBg              : '#f1f8f4',
            panel                : '#ffffff',
            muted                : '#555',
            text                 : '#222',
            headingFont          : "'Poppins', sans-serif",
            bodyFont             : "'Inter', sans-serif",
            pageWidth            : '210mm',
            pageHeight           : '297mm',
            userInterfaceWidth   : '260px',
            userInteractionWidth : '250px',
            qrSize               : '120px',
        };

        const content = {
            header : {
                mainTitle : 'Your Health Program Name',
                subtitle  : 'Your Personalized Companion for Health and Wellness',
            },
            introduction : {
                introParagraph   : 'Welcome to our health program. This comprehensive platform provides you with personalized support, guidance, and resources to help you achieve your health goals.',
                problemStatement : 'Many individuals struggle with managing their health effectively due to lack of personalized guidance, difficulty tracking progress, and limited access to timely support. Our program addresses these challenges by providing a structured, easy-to-use platform that puts your health journey at your fingertips.',
            },
            benefits : {
                title : 'Key Benefits',
                items : [
                    'Access personalized health recommendations and care plans',
                    'Track your health metrics and progress over time',
                    'Receive timely reminders and health tips',
                    'Connect with healthcare professionals when needed',
                    'Access educational resources tailored to your needs',
                ],
            },
            userInterface : {
                heading   : 'Who Can Benefit from This Program',
                paragraph : 'This program is designed for individuals seeking to take control of their health journey. Whether you are managing a chronic condition, working on preventive care, or simply looking to improve your overall wellness, our platform provides personalized support to meet your unique needs.',
            },
            footer : {
                ctaHeading     : 'Get Started Today',
                ctaDescription : 'Register by scanning the QR code or contacting us through your preferred channel. Join our community and take the first step towards better health.',
                qrInstruction  : 'Scan to get started',
            },
        };

        return {
            Styling : styling,
            Content : content,
            QRcode  : null,
            Images  : null,
            Logos   : null,
        };
    };
}


