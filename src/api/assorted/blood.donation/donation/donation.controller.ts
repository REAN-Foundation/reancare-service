import express from 'express';
import { DonationService } from '../../../../services/assorted/blood.donation/donation.service';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { DonationValidator } from './donation.validator';
import { Injector } from '../../../../startup/injector';
import { BaseController } from '../../../../api/base.controller';
import { DonationDomainModel } from '../../../../domain.types/assorted/blood.donation/donation/donation.domain.model';
import { DonationSearchFilters } from '../../../../domain.types/assorted/blood.donation/donation/donation.search.types';
import { Roles } from '../../../../domain.types/role/role.types';

///////////////////////////////////////////////////////////////////////////////////////

export class DonationController extends BaseController {

    //#region member variables and constructors

    _service: DonationService = Injector.Container.resolve(DonationService);

    _validator: DonationValidator = new DonationValidator();

    constructor() {
        super();
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model: DonationDomainModel = await this._validator.create(request);
            await this.authorizeOne(request, null, model.TenantId);
            const record = await this._service.create(model);
            if (record == null) {
                throw new ApiError(400, 'Cannot create donation record!');
            }
            ResponseHandler.success(request, response, 'Donation record created successfully!', 201, {
                Donation : record,
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
                throw new ApiError(404, 'Donation record not found.');
            }
            await this.authorizeOne(request, null, record.TenantId);
            ResponseHandler.success(request, response, 'Donation record retrieved successfully!', 200, {
                Donation : record,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            let filters: DonationSearchFilters = await this._validator.search(request);
            filters = await this.authorizeSearch(request, filters);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} donation records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, { Donation: searchResults });
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
                throw new ApiError(404, 'Donation record not found.');
            }
            await this.authorizeOne(request, null, record.TenantId);
            const updated = await this._service.update(model.id, model);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update donation record!');
            }
            ResponseHandler.success(request, response, 'Donation record updated successfully!', 200, {
                Donation : updated,
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
                throw new ApiError(404, 'Donation record not found.');
            }
            await this.authorizeOne(request, null, record.TenantId);
            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Donation record cannot be deleted.');
            }
            ResponseHandler.success(request, response, 'Donation record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    //#region Authorization methods

    authorizeSearch = async (
        request: express.Request,
        filters: DonationSearchFilters): Promise<DonationSearchFilters> => {
            
        if (request.currentClient?.IsPrivileged) {
            return filters;
        }

        const currentUserId = request.currentUser.UserId;
        const currentUserRole = request.currentUser.CurrentRole;
    
        if (filters.PatientUserId === currentUserId ||
                filters.VolunteerUserId === currentUserId ||
                filters.DonorUserId === currentUserId) {
            return filters;
        }
            
        if (filters.PatientUserId !== currentUserId &&
                filters.VolunteerUserId !== currentUserId) {
            if (currentUserRole === Roles.SystemAdmin || currentUserRole === Roles.SystemUser ||
                    currentUserRole === Roles.Volunteer || currentUserRole === Roles.TenantAdmin ||
                    currentUserRole === Roles.TenantUser) {
                return filters;
            }
            throw new ApiError(403, 'Unauthorized');
        }
    };

    //#endregion

}
