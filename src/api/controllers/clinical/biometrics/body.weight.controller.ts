import express from 'express';
import { Authorizer } from '../../../../auth/authorizer';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { BodyWeightService } from '../../../../services/clinical/biometrics/body.weight.service';
import { Loader } from '../../../../startup/loader';
import { BodyWeightValidator } from '../../../validators/clinical/biometrics/body.weight.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class BodyWeightController {

    //#region member variables and constructors

    _service: BodyWeightService = null;

    _authorizer: Authorizer = null;

    constructor() {
        this._service = Loader.container.resolve(BodyWeightService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Biometrics.BodyWeight.Create';
            await this._authorizer.authorize(request, response);
            
            const domainModel = await BodyWeightValidator.create(request);

            const bodyWeight = await this._service.create(domainModel);
            if (bodyWeight == null) {
                throw new ApiError(400, 'Cannot create weight record!');
            }

            ResponseHandler.success(request, response, 'Weight record created successfully!', 201, {
                BodyWeight : bodyWeight,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Biometrics.BodyWeight.GetById';
            
            await this._authorizer.authorize(request, response);

            const id: string = await BodyWeightValidator.getById(request);

            const bodyWeight = await this._service.getById(id);
            if (bodyWeight == null) {
                throw new ApiError(404, 'Weight record not found.');
            }

            ResponseHandler.success(request, response, 'Weight record retrieved successfully!', 200, {
                BodyWeight : bodyWeight,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getByPatientUserId = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Biometrics.BodyWeight.GetByPatientUserId';
            
            await this._authorizer.authorize(request, response);

            const patientUserId: string = await BodyWeightValidator.getByPatientUserId(request);

            const bodyWeights = await this._service.getByPatientUserId(patientUserId);
            if (bodyWeights.length === 0) {
                throw new ApiError(404, 'Weight record not found.');
            }

            ResponseHandler.success(request, response, 'Weight record retrieved successfully!', 200, {
                BodyWeights : bodyWeights,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Biometrics.BodyWeight.Search';
            await this._authorizer.authorize(request, response);

            const filters = await BodyWeightValidator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} weight records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, { BodyWeightRecords: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Biometrics.BodyWeight.Update';
            await this._authorizer.authorize(request, response);

            const domainModel = await BodyWeightValidator.update(request);

            const id: string = await BodyWeightValidator.getById(request);
            const existingBodyWeight = await this._service.getById(id);
            if (existingBodyWeight == null) {
                throw new ApiError(404, 'Weight record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update weight record!');
            }

            ResponseHandler.success(request, response, 'Weight record updated successfully!', 200, {
                BodyWeight : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Biometrics.BodyWeight.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await BodyWeightValidator.getById(request);
            const existingBodyWeight = await this._service.getById(id);
            if (existingBodyWeight == null) {
                throw new ApiError(404, 'Weight record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Weight record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Weight record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
    
    //#endregion

}
