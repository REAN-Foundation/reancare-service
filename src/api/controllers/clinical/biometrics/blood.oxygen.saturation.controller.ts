import express from 'express';
import { Authorizer } from '../../../../auth/authorizer';
import { ApiError } from '../../../../common/api.error';
import { Helper } from '../../../../common/helper';
import { ResponseHandler } from '../../../../common/response.handler';
import { BloodOxygenSaturationService } from '../../../../services/clinical/biometrics/blood.oxygen.saturation.service';
import { Loader } from '../../../../startup/loader';
import { BloodOxygenSaturationValidator } from '../../../validators/clinical/biometrics/blood.oxygen.saturation.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class BloodOxygenSaturationController {

    //#region member variables and constructors

    _service: BloodOxygenSaturationService = null;

    _authorizer: Authorizer = null;

    _personService: any;

    constructor() {
        this._service = Loader.container.resolve(BloodOxygenSaturationService);
        this._authorizer = Loader.authorizer;

    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Biometrics.BloodOxygenSaturation.Create';

            const bloodOxygenSaturationDomainModel = await BloodOxygenSaturationValidator.create(request);

            const BloodOxygenSaturation = await this._service.create(bloodOxygenSaturationDomainModel);
            if (BloodOxygenSaturation == null) {
                throw new ApiError(400, 'Cannot create record for blood oxygen saturation!');
            }

            ResponseHandler.success(request, response, 'Blood oxygen saturation record created successfully!', 201, {
                BloodOxygenSaturation : BloodOxygenSaturation,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Biometrics.BloodOxygenSaturation.GetById';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const id: string = await BloodOxygenSaturationValidator.getById(request);

            const BloodOxygenSaturation = await this._service.getById(id);
            if (BloodOxygenSaturation == null) {
                throw new ApiError(404, ' Blood oxygen saturation record not found.');
            }

            ResponseHandler.success(request, response, 'Blood oxygen saturation record retrieved successfully!', 200, {
                BloodOxygenSaturation : BloodOxygenSaturation,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Biometrics.BloodOxygenSaturation.Search';
            await this._authorizer.authorize(request, response);

            const filters = await BloodOxygenSaturationValidator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;
            
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} blood oxygen saturation records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, {
                BloodOxygenSaturationRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Biometrics.BloodOxygenSaturation.Update';

            await this._authorizer.authorize(request, response);

            const domainModel = await BloodOxygenSaturationValidator.update(request);

            const id: string = await BloodOxygenSaturationValidator.getById(request);
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Blood Oxygen Saturation record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update Blood Oxygen Saturation record!');
            }

            ResponseHandler.success(request, response, 'Blood Oxygen Saturation record updated successfully!', 200, {
                BloodOxygenSaturation : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Biometrics.BloodOxygenSaturation.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await BloodOxygenSaturationValidator.getById(request);
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Blood Oxygen Saturation record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Blood Oxygen Saturation record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Blood Oxygen Saturation record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
