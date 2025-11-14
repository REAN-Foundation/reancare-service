import express from 'express';
import { BaseValidator, Where } from '../../base.validator';
import { TenantSettingsMarketingTypes } from '../../../domain.types/tenant/marketing/tenant.settings.marketing.types';
import { ApiError } from '../../../common/api.error';
import { Injector } from '../../../startup/injector';
import { FileResourceService } from '../../../services/general/file.resource.service';

///////////////////////////////////////////////////////////////////////////////////////

export class TenantSettingsMarketingValidator extends BaseValidator {

    private readonly _fileResourceService: FileResourceService =
        Injector.Container.resolve(FileResourceService);

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

        const styling = request.body.Styling;
        if (styling) {
            const sizeFields = ['PageWidth', 'PageHeight', 'UserInterfaceWidth', 'UserInteractionWidth', 'QrSize'];
            for (const field of sizeFields) {
                if (styling[field] && !this.isValidCSSSize(styling[field])) {
                    throw new ApiError(400, `Styling.${field} must be a valid CSS size (e.g., 210mm, 280px)`);
                }
            }
        }

        return request.body.Styling;
    };

    updateContent = async (request: express.Request): Promise<any> => {

        const content = request.body.Content;

        if (content === undefined) {
            return undefined;
        }

        if (content === null) {
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
        if (content.Benefits?.Items !== undefined) {
            if (content.Benefits.Items !== null) {
                await this.validateArray(request, 'Content.Benefits.Items', Where.Body, false, false);
                if (Array.isArray(content.Benefits.Items)) {
                    for (let i = 0; i < content.Benefits.Items.length; i++) {
                        if (typeof content.Benefits.Items[i] !== 'string') {
                            throw new ApiError(400, `Content.Benefits.Items[${i}] must be a string`);
                        }
                    }
                } else {
                    throw new ApiError(400, 'Content.Benefits.Items must be an array');
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

        const qrcode = request.body.QRCode;

        if (qrcode === null || qrcode === undefined) {
            return null;
        }

        if (typeof qrcode === 'string') {
            if (qrcode.trim().length === 0) {
                throw new ApiError(400, 'QRCode resource ID cannot be empty');
            }
            if (!this.isValidUUID(qrcode)) {
                throw new ApiError(400, 'QRCode must be a valid resource ID (UUID)');
            }
            await this.ensureResourceExists(qrcode, 'QRCode');
            return qrcode;
        }

        if (typeof qrcode === 'object' && !Array.isArray(qrcode)) {
            if (qrcode.ResourceId) {
                if (typeof qrcode.ResourceId !== 'string' || qrcode.ResourceId.trim().length === 0) {
                    throw new ApiError(400, 'QRCode.ResourceId must be a non-empty string');
                }
                if (!this.isValidUUID(qrcode.ResourceId)) {
                    throw new ApiError(400, 'QRCode.ResourceId must be a valid UUID');
                }
                await this.ensureResourceExists(qrcode.ResourceId, 'QRCode.ResourceId');
            }
            return qrcode;
        }

        throw new ApiError(400, 'QRCode must be a resource ID string or an object with ResourceId property');
    };

    updateImages = async (request: express.Request): Promise<any> => {

        const images = request.body.Images;

        if (images === null || images === undefined) {
            return null;
        }

        if (typeof images !== 'object' || Array.isArray(images)) {
            throw new ApiError(400, 'Images must be an object');
        }

        const validFields = ['TitleImage', 'UserInterfaceImage'];
        const normalized: any = {};
        const existenceChecks: Promise<void>[] = [];

        for (const key of Object.keys(images)) {
            const value = images[key];

            if (validFields.includes(key)) {
                if (typeof value !== 'string' || value.trim().length === 0) {
                    throw new ApiError(400, `Images.${key} must be a non-empty resource ID string`);
                }
                if (!this.isValidUUID(value)) {
                    throw new ApiError(400, `Images.${key} must be a valid resource ID (UUID)`);
                }
                normalized[key] = value;
                existenceChecks.push(this.ensureResourceExists(value, `Images.${key}`));
            }
            else {
                throw new ApiError(400, `Unknown image field: ${key}. Valid fields: ${validFields.join(', ')}. Note: partnerLogos should be in Logos column.`);
            }
        }

        await Promise.all(existenceChecks);

        return normalized;
    };

    updateLogos = async (request: express.Request): Promise<any> => {

        const logos = request.body.Logos;
        
        if (logos === null || logos === undefined) {
            return null;
        }
        
        if (Array.isArray(logos)) {
            const existenceChecks: Promise<void>[] = [];
            for (let i = 0; i < logos.length; i++) {
                if (typeof logos[i] !== 'string' || logos[i].trim().length === 0) {
                    throw new ApiError(400, `Logos[${i}] must be a non-empty resource ID string`);
                }
                if (!this.isValidUUID(logos[i])) {
                    throw new ApiError(400, `Logos[${i}] must be a valid resource ID (UUID)`);
                }
                existenceChecks.push(this.ensureResourceExists(logos[i], `Logos[${i}]`));
            }
            await Promise.all(existenceChecks);
            return logos;
        }
        
        if (typeof logos === 'object') {
            const normalized: any = {};
            const existenceChecks: Promise<void>[] = [];
            for (const key of Object.keys(logos)) {
                const value = logos[key];
                if (typeof value !== 'string' || value.trim().length === 0) {
                    throw new ApiError(400, `Logos.${key} must be a non-empty resource ID string`);
                }
                if (!this.isValidUUID(value)) {
                    throw new ApiError(400, `Logos.${key} must be a valid resource ID (UUID)`);
                }
                normalized[key] = value;
                existenceChecks.push(this.ensureResourceExists(value, `Logos.${key}`));
            }
            await Promise.all(existenceChecks);
            return normalized;
        }
        
        throw new ApiError(400, 'Logos must be an array of resource IDs or an object with resource ID values');
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

    private isValidCSSSize(size: string): boolean {
        const cssPattern = /^\d+(\.\d+)?(px|mm|cm|in|pt|pc|em|rem|%|vh|vw)$/;
        return cssPattern.test(size);
    }

    private isValidUUID(uuid: string): boolean {
        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidPattern.test(uuid);
    }

    private async ensureResourceExists(resourceId: string, field: string): Promise<void> {
        if (!resourceId) {
            return;
        }
        const resource = await this._fileResourceService.getById(resourceId);
        if (!resource) {
            throw new ApiError(
                404,
                `${field} references a file resource that does not exist (id: ${resourceId})`
            );
        }
    }

}
