import express from 'express';
import { BaseValidator, Where } from '../../base.validator';
import { ApiError } from '../../../common/api.error';
import {
    TenantSettingsMarketingTypes,
    TenantMarketingStyling,
    TenantMarketingContent,
    TenantMarketingContentHeader,
    TenantMarketingContentIntroduction,
    TenantMarketingContentBenefits,
    TenantMarketingContentSection,
    TenantMarketingContentFooter,
    TenantMarketingQRCode,
    TenantMarketingImages,
    TenantMarketingLogos,
    TenantSettingsMarketingDomainModel,
} from '../../../domain.types/tenant/marketing/tenant.settings.marketing.types';

///////////////////////////////////////////////////////////////////////////////////////

export class TenantSettingsMarketingValidator extends BaseValidator {

    constructor() {
        super();
    }

    updateStyling = async (request: express.Request): Promise<TenantMarketingStyling> => {
        await this.validateString(request, 'Styling.Primary', Where.Body, false, true);
        await this.validateString(request, 'Styling.Secondary', Where.Body, false, true);
        await this.validateString(request, 'Styling.Accent', Where.Body, false, true);
        await this.validateString(request, 'Styling.LightBg', Where.Body, false, true);
        await this.validateString(request, 'Styling.Panel', Where.Body, false, true);
        await this.validateString(request, 'Styling.Muted', Where.Body, false, true);
        await this.validateString(request, 'Styling.Text', Where.Body, false, true);
        await this.validateString(request, 'Styling.HeadingFont', Where.Body, false, true);
        await this.validateString(request, 'Styling.BodyFont', Where.Body, false, true);
        await this.validateString(request, 'Styling.PageWidth', Where.Body, false, true);
        await this.validateString(request, 'Styling.PageHeight', Where.Body, false, true);
        await this.validateString(request, 'Styling.UserInterfaceWidth', Where.Body, false, true);
        await this.validateString(request, 'Styling.UserInteractionWidth', Where.Body, false, true);
        await this.validateString(request, 'Styling.QrSize', Where.Body, false, true);

        this.validateRequest(request);

        const model: TenantMarketingStyling = {
            Primary              : request.body.Styling?.Primary,
            Secondary            : request.body.Styling?.Secondary,
            Accent               : request.body.Styling?.Accent,
            LightBg              : request.body.Styling?.LightBg,
            Panel                : request.body.Styling?.Panel,
            Muted                : request.body.Styling?.Muted,
            Text                 : request.body.Styling?.Text,
            HeadingFont          : request.body.Styling?.HeadingFont,
            BodyFont             : request.body.Styling?.BodyFont,
            PageWidth            : request.body.Styling?.PageWidth,
            PageHeight           : request.body.Styling?.PageHeight,
            UserInterfaceWidth   : request.body.Styling?.UserInterfaceWidth,
            UserInteractionWidth : request.body.Styling?.UserInteractionWidth,
            QrSize               : request.body.Styling?.QrSize,
        };

        return model;
    };

    updateContent = async (request: express.Request): Promise<TenantMarketingContent> => {
        await this.validateString(request, 'Content.Header.MainTitle', Where.Body, false, true, false, 1);
        await this.validateString(request, 'Content.Header.Subtitle', Where.Body, false, true, false, 1);
        await this.validateString(request, 'Content.Introduction.IntroParagraph', Where.Body, false, true);
        await this.validateString(request, 'Content.Introduction.ProblemStatement', Where.Body, false, true);
        await this.validateString(request, 'Content.Benefits.Title', Where.Body, false, true, false, 1);
        await this.validateArray(request, 'Content.Benefits.Items', Where.Body, false, true);
        await this.validateString(request, 'Content.UserInterface.Heading', Where.Body, false, true, false, 1);
        await this.validateString(request, 'Content.UserInterface.Paragraph', Where.Body, false, true);
        await this.validateString(request, 'Content.Footer.CtaHeading', Where.Body, false, true, false, 1);
        await this.validateString(request, 'Content.Footer.CtaDescription', Where.Body, false, true);
        await this.validateString(request, 'Content.Footer.QrInstruction', Where.Body, false, true);

        this.validateRequest(request);

        const benefitItems = request.body?.Content?.Benefits?.Items;
        if (benefitItems != null && Array.isArray(benefitItems)) {
            for (let i = 0; i < benefitItems.length; i++) {
                await this.validateString(request, `Content.Benefits.Items[${i}]`, Where.Body, false, true);
            }
            this.validateRequest(request);
        }

        const model: TenantMarketingContent = {
            Header : request.body.Content?.Header ? {
                MainTitle : request.body.Content.Header.MainTitle,
                Subtitle  : request.body.Content.Header.Subtitle,
            } as TenantMarketingContentHeader : null,
            Introduction : request.body.Content?.Introduction ? {
                IntroParagraph   : request.body.Content.Introduction.IntroParagraph,
                ProblemStatement : request.body.Content.Introduction.ProblemStatement,
            } as TenantMarketingContentIntroduction : null,
            Benefits : request.body.Content?.Benefits ? {
                Title : request.body.Content.Benefits.Title,
                Items : request.body.Content.Benefits.Items,
            } as TenantMarketingContentBenefits : null,
            UserInterface : request.body.Content?.UserInterface ? {
                Heading   : request.body.Content.UserInterface.Heading,
                Paragraph : request.body.Content.UserInterface.Paragraph,
            } as TenantMarketingContentSection : null,
            Footer : request.body.Content?.Footer ? {
                CtaHeading     : request.body.Content.Footer.CtaHeading,
                CtaDescription : request.body.Content.Footer.CtaDescription,
                QrInstruction  : request.body.Content.Footer.QrInstruction,
            } as TenantMarketingContentFooter : null,
        };

        return model;
    };

    updateQRCode = async (request: express.Request): Promise<TenantMarketingQRCode> => {
        await this.validateObject(request, 'QRCode', Where.Body, false, true);
        await this.validateString(request, 'QRCode.ResourceId', Where.Body, false, true);

        this.validateRequest(request);

        const qrCode = request.body?.QRCode;
        const model: TenantMarketingQRCode = qrCode ? { ...qrCode } : null;

        return model;
    };

    updateImages = async (request: express.Request): Promise<TenantMarketingImages> => {
        await this.validateObject(request, 'Images', Where.Body, false, true);

        const images = request.body?.Images;
        if (!images) {
            const model: TenantMarketingImages = {};
            return model;
        }

        const model: TenantMarketingImages = {};

        for (const key of Object.keys(images)) {
            await this.validateString(request, `Images.${key}`, Where.Body, false, true, false, 1);
            model[key] = images[key];
        }

        this.validateRequest(request);

        return model;
    };

    updateLogos = async (request: express.Request): Promise<TenantMarketingLogos> => {
        await this.validateArray(request, 'Logos', Where.Body, false, true);

        const logos = request.body?.Logos;
        if (logos && Array.isArray(logos)) {
            for (let i = 0; i < logos.length; i++) {
                await this.validateString(request, `Logos[${i}]`, Where.Body, false, true, false, 1);
            }
        }

        this.validateRequest(request);

        const model: TenantMarketingLogos = logos ? [ ...logos ] : null;

        return model;
    };

    updatePageView = async (request: express.Request): Promise<number> => {
        await this.validateInt(request, 'PageView', Where.Body, false, true);
        
        this.validateRequest(request);

        const pageView = request.body?.PageView ?? 2;
        
        // Validate that pageView is 1 or 2
        if (pageView !== 1 && pageView !== 2) {
            throw new ApiError(400, 'PageView must be either 1 or 2');
        }

        return pageView;
    };

    updateByType = async (request: express.Request, type: TenantSettingsMarketingTypes)
    : Promise<
        TenantMarketingStyling |
        TenantMarketingContent |
        TenantMarketingQRCode |
        TenantMarketingImages |
        TenantMarketingLogos |
        number
    > => {
        if (type === TenantSettingsMarketingTypes.Styling) {
            return await this.updateStyling(request);
        }
        if (type === TenantSettingsMarketingTypes.Content) {
            return await this.updateContent(request);
        }
        if (type === TenantSettingsMarketingTypes.QRCode) {
            return await this.updateQRCode(request);
        }
        if (type === TenantSettingsMarketingTypes.Images) {
            return await this.updateImages(request);
        }
        if (type === TenantSettingsMarketingTypes.Logos) {
            return await this.updateLogos(request);
        }
        if (type === TenantSettingsMarketingTypes.PageView) {
            return await this.updatePageView(request);
        }
        return null;
    };

    updateAll = async (request: express.Request): Promise<TenantSettingsMarketingDomainModel> => {
        const styling = await this.updateStyling(request);
        const content = await this.updateContent(request);
        const qrCode = await this.updateQRCode(request);
        const images = await this.updateImages(request);
        const logos = await this.updateLogos(request);
        const pageView = await this.updatePageView(request);

        this.validateRequest(request);

        const model: TenantSettingsMarketingDomainModel = {
            Styling  : styling,
            Content  : content,
            QRCode   : qrCode,
            Images   : images,
            Logos    : logos,
            PageView : pageView,
        };

        return model;
    };
}