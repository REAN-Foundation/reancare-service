import express from 'express';
import { ResponseHandler } from '../../../common/response.handler';
import { Loader } from '../../../startup/loader';
import { ApiError } from '../../../common/api.error';
import { PulseService } from '../../../services/biometrics/pulse.service';
import { Authorizer } from '../../../auth/authorizer';
import { PulseValidator } from '../../validators/biometrics/pulse.validator';
import { Helper } from '../../../common/helper';

///////////////////////////////////////////////////////////////////////////////////////

export class PulseController {

    //#region member variables and constructors

    _service: PulseService = null;

    _authorizer: Authorizer = null;

    _personService: any;

    constructor() {
        this._service = Loader.container.resolve(PulseService);
        this._authorizer = Loader.authorizer;

    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Biometrics.Pulse.Create';

            const pulseDomainModel = await PulseValidator.create(request);

            const Pulse = await this._service.create(pulseDomainModel);
            if (Pulse == null) {
                throw new ApiError(400, 'Cannot create record for pulse!');
            }

            ResponseHandler.success(request, response, 'Pulse record created successfully!', 201, {
                Pulse : Pulse,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Biometrics.Pulse.GetById';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const id: string = await PulseValidator.getById(request);

            const Pulse = await this._service.getById(id);
            if (Pulse == null) {
                throw new ApiError(404, ' Pulse record not found.');
            }

            ResponseHandler.success(request, response, 'Pulse record retrieved successfully!', 200, {
                Pulse : Pulse,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Biometrics.Pulse.Search';
            await this._authorizer.authorize(request, response);

            const filters = await PulseValidator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;

            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} pulse records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, {
                PulseRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Biometrics.Pulse.Update';

            await this._authorizer.authorize(request, response);

            const domainModel = await PulseValidator.update(request);

            const id: string = await PulseValidator.getById(request);
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Pulse record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update pulse record!');
            }

            ResponseHandler.success(request, response, 'Pulse record updated successfully!', 200, {
                Pulse : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Biometrics.Pulse.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await PulseValidator.getById(request);
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Pulse record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Pulse record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Pulse record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
