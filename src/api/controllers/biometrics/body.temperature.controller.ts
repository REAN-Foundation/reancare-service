import express from 'express';
import { ResponseHandler } from '../../../common/response.handler';
import { Loader } from '../../../startup/loader';
import { ApiError } from '../../../common/api.error';
import { BodyTemperatureService } from '../../../services/biometrics/body.temperature.service';
import { Authorizer } from '../../../auth/authorizer';
import { BodyTemperatureValidator } from '../../validators/biometrics/body.temperature.validator';
import { Helper } from '../../../common/helper';

///////////////////////////////////////////////////////////////////////////////////////

export class BodyTemperatureController {

    //#region member variables and constructors

    _service: BodyTemperatureService = null;

    _authorizer: Authorizer = null;

    _personService: any;

    constructor() {
        this._service = Loader.container.resolve(BodyTemperatureService);
        this._authorizer = Loader.authorizer;

    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Biometrics.BodyTemperature.Create';

            const bodyTemperatureDomainModel = await BodyTemperatureValidator.create(request);

            const BodyTemperature = await this._service.create(bodyTemperatureDomainModel);
            if (BodyTemperature == null) {
                throw new ApiError(400, 'Cannot create record for body temperature!');
            }

            ResponseHandler.success(request, response, 'Body temperature record created successfully!', 201, {
                BodyTemperature : BodyTemperature,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Biometrics.BodyTemperature.GetById';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const id: string = await BodyTemperatureValidator.getById(request);

            const BodyTemperature = await this._service.getById(id);
            if (BodyTemperature == null) {
                throw new ApiError(404, 'Body temperature record not found.');
            }

            ResponseHandler.success(request, response, 'Body temperature record retrieved successfully!', 200, {
                BodyTemperature : BodyTemperature,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Biometrics.BodyTemperature.Search';
            await this._authorizer.authorize(request, response);

            const filters = await BodyTemperatureValidator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;
            
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} Body temperature records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, {
                BodyTemperatureRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Biometrics.BodyTemperature.Update';

            await this._authorizer.authorize(request, response);

            const domainModel = await BodyTemperatureValidator.update(request);

            const id: string = await BodyTemperatureValidator.getById(request);
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Body temperature record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update body temperature record!');
            }

            ResponseHandler.success(request, response, 'Body temperature record updated successfully!', 200, {
                BodyTemperature : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Biometrics.BodyTemperature.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await BodyTemperatureValidator.getById(request);
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Body temperature record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Body temperature record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Body temperature record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
