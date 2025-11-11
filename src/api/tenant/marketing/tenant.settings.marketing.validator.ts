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

    getTypes = async (_request: express.Request): Promise<void> => {
        return;
    };

    // Detailed validation for Styling
    updateStyling = async (request: express.Request): Promise<any> => {
        // Validate each styling field
        await this.validateString(request, 'Styling.primary', Where.Body, false, false);
        await this.validateString(request, 'Styling.secondary', Where.Body, false, false);
        await this.validateString(request, 'Styling.accent', Where.Body, false, false);
        await this.validateString(request, 'Styling.lightBg', Where.Body, false, false);
        await this.validateString(request, 'Styling.panel', Where.Body, false, false);
        await this.validateString(request, 'Styling.muted', Where.Body, false, false);
        await this.validateString(request, 'Styling.text', Where.Body, false, false);
        await this.validateString(request, 'Styling.headingFont', Where.Body, false, false);
        await this.validateString(request, 'Styling.bodyFont', Where.Body, false, false);
        await this.validateString(request, 'Styling.pageWidth', Where.Body, false, false);
        await this.validateString(request, 'Styling.pageHeight', Where.Body, false, false);
        await this.validateString(request, 'Styling.userInterfaceWidth', Where.Body, false, false);
        await this.validateString(request, 'Styling.userInteractionWidth', Where.Body, false, false);
        await this.validateString(request, 'Styling.qrSize', Where.Body, false, false);

        this.validateRequest(request);
        
        const styling = request.body.Styling;
        if (styling) {
            // Validate size format for dimension fields
            const sizeFields = ['pageWidth', 'pageHeight', 'userInterfaceWidth', 'userInteractionWidth', 'qrSize'];
            for (const field of sizeFields) {
                if (styling[field] && !this.isValidCSSSize(styling[field])) {
                    throw new ApiError(400, `Styling.${field} must be a valid CSS size (e.g., 210mm, 280px)`);
                }
            }
        }
        
        return request.body.Styling;
    };

    // Detailed validation for Content
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

        // Header section (optional)
        if (content.header?.mainTitle !== undefined) {
            await this.validateString(request, 'Content.header.mainTitle', Where.Body, false, false, false, 1);
        }
        if (content.header?.subtitle !== undefined) {
            await this.validateString(request, 'Content.header.subtitle', Where.Body, false, false, false, 1);
        }

        // Introduction section (optional)
        if (content.introduction?.introParagraph !== undefined) {
            await this.validateString(request, 'Content.introduction.introParagraph', Where.Body, false, false);
        }
        if (content.introduction?.problemStatement !== undefined) {
            await this.validateString(request, 'Content.introduction.problemStatement', Where.Body, false, false);
        }

        // Benefits section (optional)
        if (content.benefits?.title !== undefined) {
            await this.validateString(request, 'Content.benefits.title', Where.Body, false, false, false, 1);
        }
        if (content.benefits?.items !== undefined) {
            if (content.benefits.items !== null) {
                await this.validateArray(request, 'Content.benefits.items', Where.Body, false, false);
                if (Array.isArray(content.benefits.items)) {
                    for (let i = 0; i < content.benefits.items.length; i++) {
                        if (typeof content.benefits.items[i] !== 'string') {
                            throw new ApiError(400, `Content.benefits.items[${i}] must be a string`);
                        }
                    }
                } else {
                    throw new ApiError(400, 'Content.benefits.items must be an array');
                }
            }
        }

        // User interface section (optional)
        if (content.userInterface?.heading !== undefined) {
            await this.validateString(request, 'Content.userInterface.heading', Where.Body, false, false, false, 1);
        }
        if (content.userInterface?.paragraph !== undefined) {
            await this.validateString(request, 'Content.userInterface.paragraph', Where.Body, false, false);
        }

        // Footer section (optional)
        if (content.footer?.ctaHeading !== undefined) {
            await this.validateString(request, 'Content.footer.ctaHeading', Where.Body, false, false, false, 1);
        }
        if (content.footer?.ctaDescription !== undefined) {
            await this.validateString(request, 'Content.footer.ctaDescription', Where.Body, false, false);
        }
        if (content.footer?.qrInstruction !== undefined) {
            await this.validateString(request, 'Content.footer.qrInstruction', Where.Body, false, false);
        }

        this.validateRequest(request);

        return content;
    };

    updateQRcode = async (request: express.Request): Promise<any> => {
        const qrcode = request.body.QRcode;
        
        // Allow null or undefined
        if (qrcode === null || qrcode === undefined) {
            return null;
        }
        
        // Must be a resource ID string or object with resourceId
        if (typeof qrcode === 'string') {
            if (qrcode.trim().length === 0) {
                throw new ApiError(400, 'QRcode resource ID cannot be empty');
            }
            // Validate UUID format
            if (!this.isValidUUID(qrcode)) {
                throw new ApiError(400, 'QRcode must be a valid resource ID (UUID)');
            }
            await this.ensureResourceExists(qrcode, 'QRcode');
            return qrcode;
        }
        
        if (typeof qrcode === 'object' && !Array.isArray(qrcode)) {
            if (qrcode.resourceId) {
                if (typeof qrcode.resourceId !== 'string' || qrcode.resourceId.trim().length === 0) {
                    throw new ApiError(400, 'QRcode.resourceId must be a non-empty string');
                }
                if (!this.isValidUUID(qrcode.resourceId)) {
                    throw new ApiError(400, 'QRcode.resourceId must be a valid UUID');
                }
                await this.ensureResourceExists(qrcode.resourceId, 'QRcode.resourceId');
            }
            return qrcode;
        }
        
        throw new ApiError(400, 'QRcode must be a resource ID string or an object with resourceId property');
    };

    updateImages = async (request: express.Request): Promise<any> => {
        const images = request.body.Images;
        
        // Allow null or undefined
        if (images === null || images === undefined) {
            return null;
        }

        if (typeof images !== 'object' || Array.isArray(images)) {
            throw new ApiError(400, 'Images must be an object');
        }

        // Validate known image fields (partnerLogos NOT included - it belongs in Logos column)
        const validFields = ['titleImage', 'userInterfaceImage'];
        const normalized: any = {};
        const existenceChecks: Promise<void>[] = [];

        for (const key of Object.keys(images)) {
            const value = images[key];

            // All image fields should be resource ID strings
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
        
        // Allow null or undefined
        if (logos === null || logos === undefined) {
            return null;
        }
        
        // Logos should be an array of resource IDs
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
        
        // Or an object with resource ID values
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
        if (type === TenantSettingsMarketingTypes.Styling) { return await this.updateStyling(request); }
        if (type === TenantSettingsMarketingTypes.Content) { return await this.updateContent(request); }
        if (type === TenantSettingsMarketingTypes.QRcode) { return await this.updateQRcode(request); }
        if (type === TenantSettingsMarketingTypes.Images) { return await this.updateImages(request); }
        if (type === TenantSettingsMarketingTypes.Logos) { return await this.updateLogos(request); }
        return null;
    };

    updateAll = async (request: express.Request): Promise<any> => {
        const model: any = {};
        
        // Validate and add each field if present
        if (request.body.Styling !== undefined) {
            model.Styling = await this.updateStyling(request);
        }
        if (request.body.Content !== undefined) {
            model.Content = await this.updateContent(request);
        }
        if (request.body.QRcode !== undefined) {
            model.QRcode = await this.updateQRcode(request);
        }
        if (request.body.Images !== undefined) {
            model.Images = await this.updateImages(request);
        }
        if (request.body.Logos !== undefined) {
            model.Logos = await this.updateLogos(request);
        }
        
        return model;
    };

    // Helper: Validate CSS size (px, mm, cm, %, etc.)
    private isValidCSSSize(size: string): boolean {
        const cssPattern = /^\d+(\.\d+)?(px|mm|cm|in|pt|pc|em|rem|%|vh|vw)$/;
        return cssPattern.test(size);
    }

    // Helper: Validate UUID format
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



