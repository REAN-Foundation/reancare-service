import express from 'express';
import { TenantFeatureSettingService } from '../../../services/tenant/feature.setting/tenant.feature.setting.service';
import { ResponseHandler } from '../../../common/response.handler';
import { Loader } from '../../../startup/loader';
import { TenantFeatureSettingValidator } from '../feature.setting/tenant.feature.setting.validator';
import { ApiError } from '../../../common/api.error';
import { BaseController } from '../../base.controller';
import { uuid } from '../../../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////////////////////

export class TenantFeatureSettingController extends BaseController {

    //#region member variables and constructors

    _service: TenantFeatureSettingService = null;

    _validator: TenantFeatureSettingValidator = new TenantFeatureSettingValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(TenantFeatureSettingService);
    }

    //#endregion

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('TenantFeatureSetting.Create', request, response);
            const model = await this._validator.createOrUpdate(request, false);
            const tenantFeatureSetting = await this._service.create(model);
            if (tenantFeatureSetting == null) {
                throw new ApiError(400, 'Unable to create tenant feature settings.');
            }
            ResponseHandler.success(request, response, 'Tenant feature settings added successfully!', 201, {
                Tenant : tenantFeatureSetting,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('TenantFeatureSetting.GetById', request, response);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const tenantFeatureSetting = await this._service.getById(id);
            if (tenantFeatureSetting == null) {
                throw new ApiError(404, 'Tenant feature settings not found.');
            }
            ResponseHandler.success(request, response, 'Tenant feature settings retrieved successfully!', 200, {
                Tenant : tenantFeatureSetting,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('TenantFeatureSetting.Search', request, response);
            const filters = await this._validator.search(request);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0 ? 'No records found!' : `Total ${count} tenant records retrieved successfully!`;
            ResponseHandler.success(request, response, message, 200, {
                TenantRecords : searchResults,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('TenantFeatureSetting.Update', request, response);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const tenantFeatureSetting = await this._service.getById(id);
            if (tenantFeatureSetting == null) {
                throw new ApiError(404, 'Tenant feature settings not found.');
            }
            const model = await this._validator.createOrUpdate(request, true);
            const updatedTenantFeatureSetting = await this._service.update(id, model);
            if (updatedTenantFeatureSetting == null) {
                throw new ApiError(400, 'Unable to update tenant feature settings record!');
            }
            ResponseHandler.success(request, response, 'Tenant feature settings updated successfully!', 200, {
                Tenant : updatedTenantFeatureSetting,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('TenantFeatureSetting.Delete', request, response);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const tenantFeatureSetting = await this._service.getById(id);
            if (tenantFeatureSetting == null) {
                throw new ApiError(404, 'Tenant feature settings not found.');
            }
            const deleted = await this._service.delete(id);
            ResponseHandler.success(request, response, 'Tenant feature settings deleted successfully!', 200, {
                Deleted : deleted,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
    
}

