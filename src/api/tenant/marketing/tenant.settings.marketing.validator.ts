import express from 'express';
import { BaseValidator, Where } from '../../base.validator';
import { TenantSettingsMarketingTypes } from '../../../domain.types/tenant/marketing/tenant.settings.marketing.types';
import { ApiError } from '../../../common/api.error';

///////////////////////////////////////////////////////////////////////////////////////

export class TenantSettingsMarketingValidator extends BaseValidator {

    constructor() {
        super();
    }

    getTypes = async (): Promise<void> => {
        // Method required by interface; no validation needed here currently.
    };

    updateStyling = async (request: express.Request): Promise<any> => {

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

        return request.body.Styling;
    };

    updateContent = async (request: express.Request): Promise<any> => {

        const content = request.body?.Content;

        if (!content) {
            return null;
        }

        if (typeof content !== 'object') {
            throw new ApiError(400, 'Content must be an object');
        }

        if (content.Header?.MainTitle !== undefined) {
            await this.validateString(request, 'Content.Header.MainTitle', Where.Body, false, false, false, 1);
        }
        if (content.Header?.Subtitle !== undefined) {
            await this.validateString(request, 'Content.Header.Subtitle', Where.Body, false, false, false, 1);
        }

        if (content.Introduction?.IntroParagraph !== undefined) {
            await this.validateString(request, 'Content.Introduction.IntroParagraph', Where.Body, false, false);
        }
        if (content.Introduction?.ProblemStatement !== undefined) {
            await this.validateString(request, 'Content.Introduction.ProblemStatement', Where.Body, false, false);
        }

        if (content.Benefits?.Title !== undefined) {
            await this.validateString(request, 'Content.Benefits.Title', Where.Body, false, false, false, 1);
        }
        const benefitItems = content.Benefits?.Items;
        if (benefitItems != null) {
            await this.validateArray(request, 'Content.Benefits.Items', Where.Body, false, false);
            const items = benefitItems as unknown as string[];
            for (let i = 0; i < items.length; i++) {
                if (typeof items[i] !== 'string') {
                    throw new ApiError(400, `Content.Benefits.Items[${i}] must be a string`);
                }
            }
        }

        if (content.UserInterface?.Heading !== undefined) {
            await this.validateString(request, 'Content.UserInterface.Heading', Where.Body, false, false, false, 1);
        }
        if (content.UserInterface?.Paragraph !== undefined) {
            await this.validateString(request, 'Content.UserInterface.Paragraph', Where.Body, false, false);
        }

        if (content.Footer?.CtaHeading !== undefined) {
            await this.validateString(request, 'Content.Footer.CtaHeading', Where.Body, false, false, false, 1);
        }
        if (content.Footer?.CtaDescription !== undefined) {
            await this.validateString(request, 'Content.Footer.CtaDescription', Where.Body, false, false);
        }
        if (content.Footer?.QrInstruction !== undefined) {
            await this.validateString(request, 'Content.Footer.QrInstruction', Where.Body, false, false);
        }

        this.validateRequest(request);

        return content;
    };

    updateQRCode = async (request: express.Request): Promise<any> => {

        const qrcode = request.body?.QRCode;

        if (qrcode == null) {
            return null;
        }

        if (typeof qrcode === 'string') {
            return qrcode;
        }

        if (typeof qrcode === 'object' && !Array.isArray(qrcode)) {
            if (qrcode.ResourceId && typeof qrcode.ResourceId !== 'string') {
                throw new ApiError(400, 'QRCode.ResourceId must be a string');
            }
            return qrcode;
        }

        throw new ApiError(400, 'QRCode must be a resource ID string or an object with ResourceId property');
    };

    updateImages = async (request: express.Request): Promise<any> => {

        const images = request.body?.Images;

        if (!images) {
            return null;
        }

        if (typeof images !== 'object' || Array.isArray(images)) {
            throw new ApiError(400, 'Images must be an object');
        }

        const validFields = ['TitleImage', 'UserInterfaceImage'];
        const normalized: any = {};

        for (const key of Object.keys(images)) {
            const value = images[key];

            if (validFields.includes(key)) {
                if (typeof value !== 'string' || value.trim().length === 0) {
                    throw new ApiError(400, `Images.${key} must be a non-empty resource ID string`);
                }
                normalized[key] = value;
            }
            else {
                throw new ApiError(400, `Unknown image field: ${key}. Valid fields: ${validFields.join(', ')}. Note: partnerLogos should be in Logos column.`);
            }
        }

        return normalized;
    };

    updateLogos = async (request: express.Request): Promise<any> => {
        const logos = request.body?.Logos;
        if (!logos) {
            return null;
        }

        await this.validateArray(request, 'Logos', Where.Body, false, false);
        this.validateRequest(request);

        return logos;
    };

    updateByType = async (request: express.Request, type: TenantSettingsMarketingTypes): Promise<any> => {
        switch (type) {
            case TenantSettingsMarketingTypes.Styling:
                return await this.updateStyling(request);
            case TenantSettingsMarketingTypes.Content:
                return await this.updateContent(request);
            case TenantSettingsMarketingTypes.QRCode:
                return await this.updateQRCode(request);
            case TenantSettingsMarketingTypes.Images:
                return await this.updateImages(request);
            case TenantSettingsMarketingTypes.Logos:
                return await this.updateLogos(request);
            default:
                return null;
        }
    };

    updateAll = async (request: express.Request): Promise<any> => {
        const model: any = {};
        
        if (request.body.Styling !== undefined) {
            model.Styling = await this.updateStyling(request);
        }
        if (request.body.Content !== undefined) {
            model.Content = await this.updateContent(request);
        }
        if (request.body.QRCode !== undefined) {
            model.QRCode = await this.updateQRCode(request);
        }
        if (request.body.Images !== undefined) {
            model.Images = await this.updateImages(request);
        }
        if (request.body.Logos !== undefined) {
            model.Logos = await this.updateLogos(request);
        }
        
        return model;
    };

}
