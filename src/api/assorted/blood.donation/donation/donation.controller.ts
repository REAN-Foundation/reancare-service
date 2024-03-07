import express from 'express';
import { DonationService } from '../../../../services/assorted/blood.donation/donation.service';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { DonationValidator } from './donation.validator';
import { Injector } from '../../../../startup/injector';

///////////////////////////////////////////////////////////////////////////////////////

export class DonationController {

    //#region member variables and constructors

    _service: DonationService = null;

    _validator: DonationValidator = new DonationValidator();

    constructor() {
        this._service = Injector.Container.resolve(DonationService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const domainModel = await this._validator.create(request);

            const donationRecord = await this._service.create(domainModel);
            if (donationRecord == null) {
                throw new ApiError(400, 'Cannot create donation record!');
            }

            ResponseHandler.success(request, response, 'Donation record created successfully!', 201, {
                Donation : donationRecord,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const donationRecord = await this._service.getById(id);
            if (donationRecord == null) {
                throw new ApiError(404, 'Donation record not found.');
            }

            ResponseHandler.success(request, response, 'Donation record retrieved successfully!', 200, {
                Donation : donationRecord,
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
                    : `Total ${count} donation records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, { Donation: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const domainModel = await this._validator.update(request);

            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const donationRecord = await this._service.getById(id);
            if (donationRecord == null) {
                throw new ApiError(404, 'Donation record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
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
            const donationRecord = await this._service.getById(id);
            if (donationRecord == null) {
                throw new ApiError(404, 'Donation record not found.');
            }

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

}
