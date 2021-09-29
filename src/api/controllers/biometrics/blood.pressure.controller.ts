import express from 'express';
import { ResponseHandler } from '../../../common/response.handler';
import { Loader } from '../../../startup/loader';
import { ApiError } from '../../../common/api.error';
import { BloodPressureService } from '../../../services/biometrics/blood.pressure.service';
import { Authorizer } from '../../../auth/authorizer';
import { BloodPressureValidator } from '../../validators/biometrics/blood.pressure.validator';
import { Helper } from '../../../common/helper';

///////////////////////////////////////////////////////////////////////////////////////

export class BloodPressureController {

    //#region member variables and constructors

    _service: BloodPressureService = null;

    _authorizer: Authorizer = null;

    _personService: any;

    constructor() {
        this._service = Loader.container.resolve(BloodPressureService);
        this._authorizer = Loader.authorizer;

    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Biometrics.BloodPressure.Create';

            const bloodPressureDomainModel = await BloodPressureValidator.create(request);

            const BloodPressure = await this._service.create(bloodPressureDomainModel);
            if (BloodPressure == null) {
                throw new ApiError(400, 'Cannot create record for blood pressure!');
            }

            ResponseHandler.success(request, response, 'Blood pressure record created successfully!', 201, {
                BloodPressure : BloodPressure,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Biometrics.BloodPressure.GetById';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const id: string = await BloodPressureValidator.getById(request);

            const BloodPressure = await this._service.getById(id);
            if (BloodPressure == null) {
                throw new ApiError(404, ' Blood pressure record not found.');
            }

            ResponseHandler.success(request, response, 'Blood pressure record retrieved successfully!', 200, {
                BloodPressure : BloodPressure,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Biometrics.BloodPressure.Search';
            await this._authorizer.authorize(request, response);

            const filters = await BloodPressureValidator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;

            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} blood pressure records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                BloodPressureRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Biometrics.BloodPressure.Update';

            await this._authorizer.authorize(request, response);

            const domainModel = await BloodPressureValidator.update(request);

            const id: string = await BloodPressureValidator.getById(request);
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Blood Pressure record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update Blood Pressure record!');
            }

            ResponseHandler.success(request, response, 'Blood Pressure record updated successfully!', 200, {
                BloodPressure : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Biometrics.BloodPressure.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await BloodPressureValidator.getById(request);
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Blood Pressure record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Blood Pressure record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Blood Pressure record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
