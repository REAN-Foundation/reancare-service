import express from 'express';
import { TenantSettingsService } from '../../../services/tenant/tenant.settings.service';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { TenantSettingsValidator } from './tenant.settings.validator';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { Injector } from '../../../startup/injector';
import { TenantSettingsTypes, TenantSettingsTypesList } from '../../../domain.types/tenant/tenant.settings.types';
import { BaseController } from '../../../api/base.controller';
import { TenantService } from '../../../services/tenant/tenant.service';

///////////////////////////////////////////////////////////////////////////////////////

export class TenantSettingsController extends BaseController {

    //#region member variables and constructors

    _service: TenantSettingsService = Injector.Container.resolve(TenantSettingsService);

    _tenantService: TenantService = Injector.Container.resolve(TenantService);

    _validator: TenantSettingsValidator = new TenantSettingsValidator();

    //#endregion

    getTenantSettingsTypes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            ResponseHandler.success(request, response, 'Tenant settings types retrieved successfully!', 200, {
                TenantSettingsTypes : TenantSettingsTypesList,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getTenantSettingsByType = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const tenantId: uuid = await this._validator.getParamUuid(request, 'tenantId');
            await this.authorizeOne(request, null, tenantId);
            let settings = await this._service.getTenantSettings(tenantId);
            if (!settings) {
                throw new Error(`Tenant settings not found for tenant: ${tenantId}`);
            }
            const settingsType: string = await this._validator.getParamStr(request, 'settingsType');
            const types = TenantSettingsTypesList.map(x => x.toLowerCase());
            if (types.includes(settingsType.toLowerCase())) {
                settings = settings[settingsType];
            }
            ResponseHandler.success(request, response, 'Tenant settings retrieved successfully!', 200, {
                TenantSettings : settings,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getTenantSettings = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const tenantId: uuid = await this._validator.getParamUuid(request, 'tenantId');
            await this.authorizeOne(request, null, tenantId);
            const settings = await this._service.getTenantSettings(tenantId);
            if (!settings) {
                throw new Error(`Tenant settings not found for tenant: ${tenantId}`);
            }
            ResponseHandler.success(request, response, 'Tenant settings retrieved successfully!', 200, {
                TenantSettings : settings,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

        getTenantSettingsByCode = async (request: express.Request, response: express.Response): Promise<void> => {
            try {
                const tenantCode: string = request.params.tenantCode;

                const tenant = await this._tenantService.getTenantWithCode(tenantCode);
                if (!tenant) {
                    throw new Error(`Tenant not found for code: ${tenantCode}`);
                }
                const tenantId = tenant.id;
                const settings = await this._service.getTenantSettings(tenantId);
                if (!settings) {
                    throw new Error(`Tenant settings not found for tenant: ${tenantId}`);
                }
                ResponseHandler.success(request, response, 'Tenant settings retrieved successfully!', 200, {
                    TenantSettings : settings,
                });
            } catch (error) {
                ResponseHandler.handleError(request, response, error);
            }
        };

    updateTenantSettingsByType = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const tenantId: uuid = await this._validator.getParamUuid(request, 'tenantId');
            await this.authorizeOne(request, null, tenantId);
            const settingsType: string = await this._validator.getParamStr(request, 'settingsType');
            const types = TenantSettingsTypesList.map(x => x.toLowerCase());
            if (!types.includes(settingsType.toLowerCase())) {
                throw new Error(`Invalid settings type: ${settingsType}`);
            }
            const settingsType_ = settingsType as TenantSettingsTypes;
            const settings = await this._validator.updateTenantSettingsByType(request, settingsType_);
            const updated = await this._service.updateTenantSettingsByType(tenantId, settingsType_, settings);
            ResponseHandler.success(request, response, 'Tenant settings updated successfully!', 200, {
                Updated : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updateTenantSettings = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const tenantId: uuid = await this._validator.getParamUuid(request, 'tenantId');
            await this.authorizeOne(request, null, tenantId);
            const settings = await this._validator.updateTenantSettings(request);
            const updated = await this._service.updateTenantSettings(tenantId, settings);
            ResponseHandler.success(request, response, 'Tenant settings updated successfully!', 200, {
                Updated : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

}

