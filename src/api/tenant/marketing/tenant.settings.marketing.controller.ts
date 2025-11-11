import express from 'express';
import fs from 'fs';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { BaseController } from '../../base.controller';
import { Injector } from '../../../startup/injector';
import { TenantService } from '../../../services/tenant/tenant.service';
import { TenantSettingsMarketingService } from '../../../services/tenant/marketing/tenant.settings.marketing.service';
import { TenantMarketingPdfService } from '../../../modules/pdf/tenant.marketing.pdf.service';
import { FileResourceService } from '../../../services/general/file.resource.service';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { TenantSettingsMarketingTypes } from '../../../domain.types/tenant/marketing/tenant.settings.marketing.types';
import { TenantSettingsMarketingValidator } from './tenant.settings.marketing.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class TenantSettingsMarketingController extends BaseController {

    _service: TenantSettingsMarketingService = Injector.Container.resolve(TenantSettingsMarketingService);

    _tenantService: TenantService = Injector.Container.resolve(TenantService);

    _pdfService: TenantMarketingPdfService = Injector.Container.resolve(TenantMarketingPdfService);

    _fileResourceService: FileResourceService = Injector.Container.resolve(FileResourceService);

    _validator: TenantSettingsMarketingValidator = new TenantSettingsMarketingValidator();

    getByTenant = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const tenantId: uuid = await this._validator.getParamUuid(request, 'tenantId');
            await this.authorizeOne(request, null, tenantId);
            const settings = await this._service.getSettings(tenantId);
            ResponseHandler.success(request, response, 'Tenant marketing settings retrieved successfully!', 200, {
                TenantMarketingSettings : settings,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getByCode = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const tenantCode: string = await this._validator.getParamStr(request, 'tenantCode');
            const tenant = await this._tenantService.getTenantWithCode(tenantCode);
            if (!tenant) {
                ResponseHandler.failure(request, response, 'Tenant not found', 404);
                return;
            }
            await this.authorizeOne(request, null, tenant.id);
            const settings = await this._service.getSettings(tenant.id);
            ResponseHandler.success(request, response, 'Tenant marketing settings retrieved successfully!', 200, {
                TenantMarketingSettings : settings,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const tenantId: uuid = await this._validator.getParamUuid(request, 'tenantId');
            await this.authorizeOne(request, null, tenantId);
            const payload = await this._validator.updateAll(request);
            const created = await this._service.createDefaultSettings(tenantId, payload);
            ResponseHandler.success(request, response, 'Tenant marketing settings created successfully!', 201, {
                TenantMarketingSettings : created,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updateAll = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const tenantId: uuid = await this._validator.getParamUuid(request, 'tenantId');
            await this.authorizeOne(request, null, tenantId);
            const payload = await this._validator.updateAll(request);

            // Update each field if provided
            if (payload.Styling !== undefined) {
                await this._service.updateSettingsByType(tenantId, TenantSettingsMarketingTypes.Styling, payload.Styling);
            }
            if (payload.Content !== undefined) {
                await this._service.updateSettingsByType(tenantId, TenantSettingsMarketingTypes.Content, payload.Content);
            }
            if (payload.QRcode !== undefined) {
                await this._service.updateSettingsByType(tenantId, TenantSettingsMarketingTypes.QRcode, payload.QRcode);
            }
            if (payload.Images !== undefined) {
                await this._service.updateSettingsByType(tenantId, TenantSettingsMarketingTypes.Images, payload.Images);
            }
            if (payload.Logos !== undefined) {
                await this._service.updateSettingsByType(tenantId, TenantSettingsMarketingTypes.Logos, payload.Logos);
            }

            // Fetch and return updated settings
            const updated = await this._service.getSettings(tenantId);
            ResponseHandler.success(request, response, 'Tenant marketing settings updated successfully!', 200, {
                TenantMarketingSettings : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updateImages = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const tenantId: uuid = await this._validator.getParamUuid(request, 'tenantId');
            await this.authorizeOne(request, null, tenantId);
            const payload = await this._validator.updateImages(request);
            const updated = await this._service.updateSettingsByType(tenantId, TenantSettingsMarketingTypes.Images, payload);
            
            // Return only the updated field
            const responseData = {
                Images : updated.Images,
            };
            ResponseHandler.success(request, response, 'Images updated successfully!', 200, responseData);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updateQRcode = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const tenantId: uuid = await this._validator.getParamUuid(request, 'tenantId');
            await this.authorizeOne(request, null, tenantId);
            const payload = await this._validator.updateQRcode(request);
            const updated = await this._service.updateSettingsByType(tenantId, TenantSettingsMarketingTypes.QRcode, payload);
            
            // Return only the updated field
            const responseData = {
                QRcode : updated.QRcode,
            };
            ResponseHandler.success(request, response, 'QR code updated successfully!', 200, responseData);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updateContent = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const tenantId: uuid = await this._validator.getParamUuid(request, 'tenantId');
            await this.authorizeOne(request, null, tenantId);
            const payload = await this._validator.updateContent(request);
            const updated = await this._service.updateSettingsByType(tenantId, TenantSettingsMarketingTypes.Content, payload);
            
            // Return only the updated field
            const responseData = {
                Content : updated.Content,
            };
            ResponseHandler.success(request, response, 'Content updated successfully!', 200, responseData);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updateLogos = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const tenantId: uuid = await this._validator.getParamUuid(request, 'tenantId');
            await this.authorizeOne(request, null, tenantId);
            const payload = await this._validator.updateLogos(request);
            const updated = await this._service.updateSettingsByType(tenantId, TenantSettingsMarketingTypes.Logos, payload);
            
            // Return only the updated field
            const responseData = {
                Logos : updated.Logos,
            };
            ResponseHandler.success(request, response, 'Partner logos updated successfully!', 200, responseData);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    downloadPdf = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const tenantId: uuid = await this._validator.getParamUuid(request, 'tenantId');
            await this.authorizeOne(request, null, tenantId);

            // Fetch marketing settings
            const settings = await this._service.getSettings(tenantId);
            if (!settings) {
                throw new Error('Marketing settings not found for this tenant. Please create settings first.');
            }

            // Generate PDF file
            const { absFilepath, filename } = await this._pdfService.generatePamphletFile(settings, 'marketing-pamphlet');

            // Upload or replace PDF in storage
            const storageKey = `tenant/${tenantId}/marketing/pamphlets/${filename}`;
            const existingResourceId = settings.PDFResourceId;
            
            let fileResource: any;
            if (existingResourceId) {
                // Replace existing PDF (prevents accumulation)
                fileResource = await this._fileResourceService.replaceLocal(
                    existingResourceId,
                    absFilepath,
                    storageKey,
                    false
                );
            } else {
                // Create new PDF (first time generation)
                fileResource = await this._fileResourceService.uploadLocal(absFilepath, storageKey, false);
                
                // Save resource ID for future replacements
                const marketingRepo = Injector.Container.resolve('ITenantSettingsMarketingRepo');
                await (marketingRepo as any).updatePDFResourceId(tenantId, fileResource.id);
            }

            const pdfBuffer = await fs.promises.readFile(absFilepath);

            try {
                await fs.promises.unlink(absFilepath);
            } catch (cleanupError) {
                // Ignore cleanup errors
            }

            response.setHeader('Content-Type', 'application/pdf');
            response.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            response.setHeader('Content-Length', pdfBuffer.length.toString());
            if (fileResource?.id) {
                response.setHeader('x-file-resource-id', fileResource.id);
            }
            if (fileResource?.DefaultVersion?.Url) {
                response.setHeader('x-file-resource-url', fileResource.DefaultVersion.Url);
            }

            response.status(200).send(pdfBuffer);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const tenantId: uuid = await this._validator.getParamUuid(request, 'tenantId');
            await this.authorizeOne(request, null, tenantId);
            const ok = await this._service.deleteSettings(tenantId);
            ResponseHandler.success(request, response, 'Tenant marketing settings deleted successfully!', 200, {
                Deleted : ok,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
}


