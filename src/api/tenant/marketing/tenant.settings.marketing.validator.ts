import express from 'express';
import { BaseValidator, Where } from '../../base.validator';
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
import { ApiError } from '../../../common/api.error';

///////////////////////////////////////////////////////////////////////////////////////

export class TenantSettingsMarketingValidator extends BaseValidator {

    constructor() {
        super();
    }

    updateStyling = async (request: express.Request): Promise<TenantMarketingStyling | null> => {
        await this.validateString(request, 'Styling.Primary', Where.Body, false, false);
        await this.validateString(request, 'Styling.Secondary', Where.Body, false, false);
        await this.validateString(request, 'Styling.Accent', Where.Body, false, false);
        await this.validateString(request, 'Styling.LightBg', Where.Body, false, false);
        await this.validateString(request, 'Styling.Panel', Where.Body, false, false);
        await this.validateString(request, 'Styling.Muted', Where.Body, false, false);
        await this.validateString(request, 'Styling.Text', Where.Body, false, false);
        await this.validateString(request, 'Styling.HeadingFont', Where.Body, false, false);
        await this.validateString(request, 'Styling.BodyFont', Where.Body, false, false);
        await this.validateString(request, 'Styling.PageWidth', Where.Body, false, false);
        await this.validateString(request, 'Styling.PageHeight', Where.Body, false, false);
        await this.validateString(request, 'Styling.UserInterfaceWidth', Where.Body, false, false);
        await this.validateString(request, 'Styling.UserInteractionWidth', Where.Body, false, false);
        await this.validateString(request, 'Styling.QrSize', Where.Body, false, false);

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

    updateContent = async (request: express.Request): Promise<TenantMarketingContent | null> => {
        await this.validateString(request, 'Content.Header.MainTitle', Where.Body, false, false, false, 1);
        await this.validateString(request, 'Content.Header.Subtitle', Where.Body, false, false, false, 1);
        await this.validateString(request, 'Content.Introduction.IntroParagraph', Where.Body, false, false);
        await this.validateString(request, 'Content.Introduction.ProblemStatement', Where.Body, false, false);
        await this.validateString(request, 'Content.Benefits.Title', Where.Body, false, false, false, 1);
        await this.validateArray(request, 'Content.Benefits.Items', Where.Body, false, false);
        await this.validateString(request, 'Content.UserInterface.Heading', Where.Body, false, false, false, 1);
        await this.validateString(request, 'Content.UserInterface.Paragraph', Where.Body, false, false);
        await this.validateString(request, 'Content.Footer.CtaHeading', Where.Body, false, false, false, 1);
        await this.validateString(request, 'Content.Footer.CtaDescription', Where.Body, false, false);
        await this.validateString(request, 'Content.Footer.QrInstruction', Where.Body, false, false);

        this.validateRequest(request);

        const benefitItems = request.body?.Content?.Benefits?.Items;
        if (benefitItems != null && Array.isArray(benefitItems)) {
            for (let i = 0; i < benefitItems.length; i++) {
                await this.validateString(request, `Content.Benefits.Items[${i}]`, Where.Body, false, false);
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
        await this.validateAny(request, 'QRCode', Where.Body, false, false);
        await this.validateString(request, 'QRCode.ResourceId', Where.Body, false, false);
        this.validateRequest(request);

        return request.body?.QRCode ?? null;
    };

    updateImages = async (request: express.Request): Promise<TenantMarketingImages | null> => {
        await this.validateObject(request, 'Images', Where.Body, false, false);

        const images = request.body?.Images;
        if (!images) {
            return null;
        }

        const validFields = ['TitleImage', 'UserInterfaceImage'];
        const normalized: TenantMarketingImages = {};

        for (const key of Object.keys(images)) {
            if (!validFields.includes(key)) {
                throw new ApiError(400, `Unknown image field: ${key}. Valid fields: ${validFields.join(', ')}. Note: partnerLogos should be in Logos column.`);
            }

            await this.validateString(request, `Images.${key}`, Where.Body, false, false, false, 1);
            normalized[key] = images[key];
        }

        this.validateRequest(request);

        return normalized;
    };

    updateLogos = async (request: express.Request): Promise<TenantMarketingLogos> => {
        await this.validateAny(request, 'Logos', Where.Body, false, false);
        this.validateRequest(request);

        return request.body?.Logos ?? null;
    };

    updateByType = async (request: express.Request, type: TenantSettingsMarketingTypes)
    : Promise<
        TenantMarketingStyling |
        TenantMarketingContent |
        TenantMarketingQRCode |
        TenantMarketingImages |
        TenantMarketingLogos |
        null
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
        return null;
    };

    updateAll = async (request: express.Request): Promise<TenantSettingsMarketingDomainModel> => {
        const styling = await this.updateStyling(request);
        const content = await this.updateContent(request);
        const qrCode = await this.updateQRCode(request);
        const images = await this.updateImages(request);
        const logos = await this.updateLogos(request);

        this.validateRequest(request);

        const model: TenantSettingsMarketingDomainModel = {
            Styling : styling,
            Content : content,
            QRCode  : qrCode,
            Images  : images,
            Logos   : logos,
        };

        return model;
    };

}
