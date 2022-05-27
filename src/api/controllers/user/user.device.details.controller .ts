import express from 'express';
import { uuid } from '../../../../src/domain.types/miscellaneous/system.types';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { UserDeviceDetailsService } from '../../../services/user/user.device.details.service';
import { Loader } from '../../../startup/loader';
import { UserDeviceDetailsValidator } from '../../validators/user/user.device.details.validator';
import { BaseController } from '../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class UserDeviceDetailsController extends BaseController{

    //#region member variables and constructors

    _service: UserDeviceDetailsService = null;

    _validator: UserDeviceDetailsValidator = new UserDeviceDetailsValidator();
    
    _personService: any;

    constructor() {
        super();
        this._service = Loader.container.resolve(UserDeviceDetailsService);

    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('UserDeviceDetails.Create', request, response, false);

            const userDeviceDetailsDomainModel = await this._validator.create(request);

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
            
            await this.setContext('UserDeviceDetails.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');

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
            await this.setContext('UserDeviceDetails.Search', request, response);

            const filters = await this._validator.search(request);

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
            await this.setContext('UserDeviceDetails.Update', request, response);
            const domainModel = await this._validator.update(request);

            const id: string = await this._validator.getParamUuid(request, 'id');
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
            await this.setContext('UserDeviceDetails.Delete', request, response);

            const id: string = await this._validator.getParamUuid(request, 'id');
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
