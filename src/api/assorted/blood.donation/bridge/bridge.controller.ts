import express from 'express';
import { BridgeService } from '../../../../services/assorted/blood.donation/bridge.service';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { BridgeValidator } from './bridge.validator';
import { Injector } from '../../../../startup/injector';
import { BaseController } from '../../../../api/base.controller';
import { BridgeDomainModel } from '../../../../domain.types/assorted/blood.donation/bridge/bridge.domain.model';
import { TenantService } from '../../../../services/tenant/tenant.service';
import { BridgeSearchFilters } from '../../../../domain.types/assorted/blood.donation/bridge/bridge.search.types';
import { Roles } from '../../../../domain.types/role/role.types';

///////////////////////////////////////////////////////////////////////////////////////

export class BridgeController extends BaseController {

    //#region member variables and constructors

    _service: BridgeService = Injector.Container.resolve(BridgeService);

    _tenantService: TenantService = Injector.Container.resolve(TenantService);

    _validator: BridgeValidator = new BridgeValidator();

    constructor() {
        super();
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model: BridgeDomainModel = await this._validator.create(request);
            await this.authorizeOne(request, null, model.TenantId);
            model.TenantId = model.TenantId ?? request.resourceTenantId;
            const patientDonors = await this._service.create(model);
            if (patientDonors == null) {
                throw new ApiError(400, 'Cannot create Blood bridge!');
            }
            ResponseHandler.success(request, response, 'Blood bridge created successfully!', 201, {
                PatientDonors : patientDonors,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'Blood bridge not found.');
            }
            await this.authorizeOne(request, null, record.TenantId);
            ResponseHandler.success(request, response, 'Blood bridge retrieved successfully!', 200, {
                PatientDonors : record,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            let filters = await this._validator.search(request);
            filters = await this.authorizeSearch(request, filters);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} blood bridge records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, { PatientDonors: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'Blood bridge not found.');
            }
            await this.authorizeOne(request, null, record.TenantId);
            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update blood bridge record!');
            }
            ResponseHandler.success(request, response, 'Blood bridge record updated successfully!', 200, {
                PatientDonors : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'Blood bridge not found.');
            }
            await this.authorizeOne(request, null, record.TenantId);
            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Blood bridge cannot be deleted.');
            }
            ResponseHandler.success(request, response, 'Blood bridge record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    authorizeSearch = async (
        request: express.Request,
        searchFilters: BridgeSearchFilters): Promise<BridgeSearchFilters> => {

        if (request.currentClient?.IsPrivileged) {
            return searchFilters;
        }

        const currentUserId = request.currentUser.UserId;
        const currentUserRole = request.currentUser.CurrentRole;

        if (searchFilters.PatientUserId === currentUserId) {
            return searchFilters;
        }
        if (searchFilters.VolunteerUserId === currentUserId) {
            return searchFilters;
        }
        
        if (searchFilters.PatientUserId !== currentUserId &&
            searchFilters.VolunteerUserId !== currentUserId) {
            if (currentUserRole === Roles.SystemAdmin || currentUserRole === Roles.SystemUser ||
                currentUserRole === Roles.Volunteer || currentUserRole === Roles.TenantAdmin ||
                currentUserRole === Roles.TenantUser) {
                return searchFilters;
            }
            throw new ApiError(403, 'Unauthorized');
        }

    };

}
