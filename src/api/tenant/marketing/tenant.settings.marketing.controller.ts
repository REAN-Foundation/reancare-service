import express from 'express';
import fs from 'fs';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { BaseController } from '../../base.controller';
import { Injector } from '../../../startup/injector';
import { TenantService } from '../../../services/tenant/tenant.service';
import { TenantSettingsMarketingService } from '../../../services/tenant/marketing/tenant.settings.marketing.service';
import { TenantMarketingPdfService } from '../../../services/tenant/marketing/tenant.marketing.pdf.service';
import { FileResourceService } from '../../../services/general/file.resource.service';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { TenantSettingsMarketingTypes } from '../../../domain.types/tenant/marketing/tenant.settings.marketing.types';
import { TenantSettingsMarketingValidator } from './tenant.settings.marketing.validator';
import { Logger } from '../../../common/logger';
import { ApiError } from '../../../common/api.error';
import { FileResourceDto } from '../../../domain.types/general/file.resource/file.resource.dto';

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
                throw new Error('Tenant not found');
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
            const existing = await this._service.getSettings(tenantId);
            if (existing) {
                throw new Error('Marketing settings already exist for this tenant.');
            }

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
            
            if (payload.Styling !== undefined) {
                await this._service.updateSettingsByType(tenantId, TenantSettingsMarketingTypes.Styling, payload.Styling);
            }
            if (payload.Content !== undefined) {
                await this._service.updateSettingsByType(tenantId, TenantSettingsMarketingTypes.Content, payload.Content);
            }
            if (payload.QRCode !== undefined) {
                if (payload.QRCode && typeof payload.QRCode === 'object' && 'ResourceId' in payload.QRCode && payload.QRCode.ResourceId) {
                    await this.ensureResourceExists(payload.QRCode.ResourceId, 'QRCode.ResourceId');
                }
                await this._service.updateSettingsByType(tenantId, TenantSettingsMarketingTypes.QRCode, payload.QRCode);
            }
            if (payload.Images !== undefined) {
                if (payload.Images) {
                    const existenceChecks: Promise<void>[] = [];
                    for (const key of Object.keys(payload.Images)) {
                        const resourceId = payload.Images[key];
                        if (resourceId) {
                            existenceChecks.push(this.ensureResourceExists(resourceId, `Images.${key}`));
                        }
                    }
                    await Promise.all(existenceChecks);
                }
                await this._service.updateSettingsByType(tenantId, TenantSettingsMarketingTypes.Images, payload.Images);
            }
            if (payload.Logos !== undefined) {
                if (payload.Logos && Array.isArray(payload.Logos)) {
                    await Promise.all(payload.Logos.map((id, index) =>
                        this.ensureResourceExists(id, `Logos[${index}]`)
                    ));
                }
                await this._service.updateSettingsByType(tenantId, TenantSettingsMarketingTypes.Logos, payload.Logos);
            }

            if (payload.PageView !== undefined) {
                await this._service.updateSettingsByType(tenantId, TenantSettingsMarketingTypes.PageView, payload.PageView);
            }

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
            
            if (payload) {
                const existenceChecks: Promise<void>[] = [];
                for (const key of Object.keys(payload)) {
                    const resourceId = payload[key];
                    if (resourceId) {
                        existenceChecks.push(this.ensureResourceExists(resourceId, `Images.${key}`));
                    }
                }
                await Promise.all(existenceChecks);
            }
            
            const updated = await this._service.updateSettingsByType(tenantId, TenantSettingsMarketingTypes.Images, payload);
            
            const responseData = {
                Images : updated.Images,
            };
            ResponseHandler.success(request, response, 'Images updated successfully!', 200, responseData);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updateQRCode = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const tenantId: uuid = await this._validator.getParamUuid(request, 'tenantId');
            await this.authorizeOne(request, null, tenantId);
            const payload = await this._validator.updateQRCode(request);
            
            if (payload && typeof payload === 'object' && 'ResourceId' in payload && payload.ResourceId) {
                await this.ensureResourceExists(payload.ResourceId, 'QRCode.ResourceId');
            }
            
            const updated = await this._service.updateSettingsByType(tenantId, TenantSettingsMarketingTypes.QRCode, payload);
            
            const responseData = {
                QRCode : updated.QRCode,
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
            const updated = await this._service.updateSettingsByType(
                tenantId,
                TenantSettingsMarketingTypes.Content,
                payload
            );
            
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
            
            if (payload && Array.isArray(payload)) {
                await Promise.all(payload.map((id, index) =>
                    this.ensureResourceExists(id, `Logos[${index}]`)
                ));
            }
            
            const updated = await this._service.updateSettingsByType(tenantId, TenantSettingsMarketingTypes.Logos, payload);
            
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

            const settings = await this._service.getSettings(tenantId);
            if (!settings) {
                throw new Error('Marketing settings not found for this tenant. Please create settings first.');
            }

            const { absFilepath, filename } = await this._pdfService.generatePamphletFile(settings, 'marketing-pamphlet');

            const storageKey = `tenant/${tenantId}/marketing/pamphlets/${filename}`;
            const existingResourceId = settings.PDFResourceId;
            
            let fileResource: FileResourceDto | null = null;
            if (existingResourceId) {
                fileResource = await this._fileResourceService.replaceLocal(
                    existingResourceId,
                    absFilepath,
                    storageKey,
                    false
                );
            } else {
                fileResource = await this._fileResourceService.uploadLocal(absFilepath, storageKey, false);
                await this._service.updatePdfResourceId(tenantId, fileResource.id);
            }

            const pdfBuffer = await fs.promises.readFile(absFilepath);

            try {
                await fs.promises.unlink(absFilepath);
            } catch (cleanupError) {
                Logger.instance().error('Failed to delete temporary PDF file.', null, cleanupError);
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
