import express from 'express';
import { DonationRecordService } from '../../../services/clinical/donation/donation.record.service';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { auth } from '../../../auth/auth.handler';
import { BaseController } from '../../base.controller';
import { DonationRecordValidator } from './donation.record.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class DonationRecordController extends BaseController {

    //#region member variables and constructors

    _service: DonationRecordService = null;

    _validator: DonationRecordValidator = new DonationRecordValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(DonationRecordService);
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
                DonationRecord : donationRecord,
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
                DonationRecord : donationRecord,
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

            ResponseHandler.success(request, response, message, 200, { DonationRecord: searchResults });

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
                DonationRecord : updated,
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
