import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { Loader } from '../../../startup/loader';
import { BaseController } from '../../base.controller';
import { DonationCommunicationValidator } from './donation.communication.validator';
import { DonationCommunicationService } from '../../../services/clinical/donation/donation.communication.service';

///////////////////////////////////////////////////////////////////////////////////////

export class DonationCommunicationController extends BaseController {

    //#region member variables and constructors

    _service: DonationCommunicationService = null;

    _validator: DonationCommunicationValidator = new DonationCommunicationValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(DonationCommunicationService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('DonationCommunication.Create', request, response);

            const domainModel = await this._validator.create(request);

            const donationCommunication = await this._service.create(domainModel);
            if (donationCommunication == null) {
                throw new ApiError(400, 'Cannot create donation communication!');
            }

            ResponseHandler.success(request, response, 'Donation communication created successfully!', 201, {
                DonationCommunication : donationCommunication,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('DonationCommunication.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const donationCommunication = await this._service.getById(id);
            if (donationCommunication == null) {
                throw new ApiError(404, 'Donation communication not found.');
            }

            ResponseHandler.success(request, response, 'Donation communication retrieved successfully!', 200, {
                DonationCommunication : donationCommunication,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('DonationCommunication.Search', request, response);

            const filters = await this._validator.search(request);

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

            await this.setContext('DonationCommunication.Update', request, response);

            const domainModel = await this._validator.update(request);

            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const donationCommunication = await this._service.getById(id);
            if (donationCommunication == null) {
                throw new ApiError(404, 'Donation communication not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
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

            await this.setContext('DonationCommunication.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const donationCommunication = await this._service.getById(id);
            if (donationCommunication == null) {
                throw new ApiError(404, 'Donation communication not found.');
            }

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

}
