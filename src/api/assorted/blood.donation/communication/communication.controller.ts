import express from 'express';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { BaseController } from '../../../base.controller';
import { CommunicationValidator } from './communication.validator';
import { DonationCommunicationService } from '../../../../services/assorted/blood.donation/communication.service';
import { Injector } from '../../../../startup/injector';

///////////////////////////////////////////////////////////////////////////////////////

export class CommunicationController extends BaseController {

    //#region member variables and constructors

    _service: DonationCommunicationService = null;

    _validator: CommunicationValidator = new CommunicationValidator();

    constructor() {
        super('BloodDonation.Communication');
        this._service = Injector.Container.resolve(DonationCommunicationService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

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
