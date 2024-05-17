import express from 'express';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { CommunicationValidator } from './communication.validator';
import { DonationCommunicationService } from '../../../../services/assorted/blood.donation/communication.service';
import { Injector } from '../../../../startup/injector';
import { BaseController } from '../../../../api/base.controller';
import { DonationCommunicationDomainModel } from '../../../../domain.types/assorted/blood.donation/communication/communication.domain.model';
import { DonationCommunicationSearchFilters } from '../../../../domain.types/assorted/blood.donation/communication/communication.search.types';
import { Roles } from '../../../../domain.types/role/role.types';

///////////////////////////////////////////////////////////////////////////////////////

export class CommunicationController extends BaseController {

    //#region member variables and constructors

    _service: DonationCommunicationService = Injector.Container.resolve(DonationCommunicationService);

    _validator: CommunicationValidator = new CommunicationValidator();

    constructor() {
        super();
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model: DonationCommunicationDomainModel = await this._validator.create(request);
            await this.authorizeOne(request, null, model.TenantId);
            model.TenantId = model.TenantId ?? request.resourceTenantId;
            const record = await this._service.create(model);
            if (record == null) {
                throw new ApiError(400, 'Cannot create donation communication!');
            }
            ResponseHandler.success(request, response, 'Donation communication created successfully!', 201, {
                DonationCommunication : record,
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
                throw new ApiError(404, 'Donation communication not found.');
            }
            await this.authorizeOne(request, null, record.TenantId);
            ResponseHandler.success(request, response, 'Donation communication retrieved successfully!', 200, {
                DonationCommunication : record,
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
                    : `Total ${count} donation communications retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, { DonationCommunication: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'Donation communication not found.');
            }
            await this.authorizeOne(request, null, record.TenantId);
            const updated = await this._service.update(model.id, model);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update donation communication!');
            }
            ResponseHandler.success(request, response, 'Donation communication updated successfully!', 200, {
                DonationCommunication : updated,
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
                throw new ApiError(404, 'Donation communication not found.');
            }
            await this.authorizeOne(request, null, record.TenantId);
            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Donation communication cannot be deleted.');
            }
            ResponseHandler.success(request, response, 'Donation communication deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    authorizeSearch = async (
        request: express.Request,
        searchFilters: DonationCommunicationSearchFilters): Promise<any> => {

        if (request.currentClient?.IsPrivileged) {
            return searchFilters;
        }
            
        const currentUserId = request.currentUser.UserId;
        const currentUserRole = request.currentUser.CurrentRole;

        if (searchFilters.PatientUserId === currentUserId ||
            searchFilters.VolunteerUserId === currentUserId ||
            searchFilters.DonorUserId === currentUserId) {
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
