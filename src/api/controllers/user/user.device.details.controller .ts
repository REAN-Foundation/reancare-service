import express from 'express';
import { Authorizer } from '../../../auth/authorizer';
import { ApiError } from '../../../common/api.error';
import { Helper } from '../../../common/helper';
import { ResponseHandler } from '../../../common/response.handler';
import { UserDeviceDetailsService } from '../../../services/user/user.device.details.service';
import { Loader } from '../../../startup/loader';
import { UserDeviceDetailsValidator } from '../../validators/user.device.details.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class UserDeviceDetailsController {

    //#region member variables and constructors

    _service: UserDeviceDetailsService = null;

    _authorizer: Authorizer = null;

    _personService: any;

    constructor() {
        this._service = Loader.container.resolve(UserDeviceDetailsService);
        this._authorizer = Loader.authorizer;

    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'UserDeviceDetails.Create';

            const userDeviceDetailsDomainModel = await UserDeviceDetailsValidator.create(request);

            const UserDeviceDetails = await this._service.create(userDeviceDetailsDomainModel);
            if (UserDeviceDetails == null) {
                throw new ApiError(400, 'Cannot create record for user device details!');
            }

            ResponseHandler.success(request, response, 'User device details record created successfully!', 201, {
                UserDeviceDetails : UserDeviceDetails,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'UserDeviceDetails.GetById';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const id: string = await UserDeviceDetailsValidator.getById(request);

            const UserDeviceDetails = await this._service.getById(id);
            if (UserDeviceDetails == null) {
                throw new ApiError(404, ' User device details record not found.');
            }

            ResponseHandler.success(request, response, 'User device details record retrieved successfully!', 200, {
                UserDeviceDetails : UserDeviceDetails,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'UserDeviceDetails.Search';
            await this._authorizer.authorize(request, response);

            const filters = await UserDeviceDetailsValidator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;

            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} user device details records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, {
                UserDeviceDetailsRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'UserDeviceDetails.Update';

            await this._authorizer.authorize(request, response);

            const domainModel = await UserDeviceDetailsValidator.update(request);

            const id: string = await UserDeviceDetailsValidator.getById(request);
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'User device details record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update user device details record!');
            }

            ResponseHandler.success(request, response, 'User device details record updated successfully!', 200, {
                UserDeviceDetails : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'UserDeviceDetails.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await UserDeviceDetailsValidator.getById(request);
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'User device details record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'User device details record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'User device details record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
