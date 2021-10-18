import express from 'express';
import { ResponseHandler } from '../../../common/response.handler';
import { Loader } from '../../../startup/loader';
import { ApiError } from '../../../common/api.error';
import { MedicalConditionService } from '../../../services/static types/medical.condition.service';
import { Authorizer } from '../../../auth/authorizer';
import { MedicalConditionValidator } from '../../validators/static types/medical.condition.validator';
import { Helper } from '../../../common/helper';

///////////////////////////////////////////////////////////////////////////////////////

export class MedicalConditionController {

    //#region member variables and constructors

    _service: MedicalConditionService = null;

    _authorizer: Authorizer = null;

    _personService: any;

    constructor() {
        this._service = Loader.container.resolve(MedicalConditionService);
        this._authorizer = Loader.authorizer;

    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'StaticTypes.MedicalCondition.Create';

            const medicalConditionDomainModel = await MedicalConditionValidator.create(request);

            const MedicalCondition = await this._service.create(medicalConditionDomainModel);
            if (MedicalCondition == null) {
                throw new ApiError(400, 'Cannot create record for medical condition record!');
            }

            ResponseHandler.success(request, response, 'Medical condition record created successfully!', 201, {
                MedicalCondition : MedicalCondition,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'StaticTypes.MedicalCondition.GetById';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const id: string = await MedicalConditionValidator.getById(request);

            const MedicalCondition = await this._service.getById(id);
            if (MedicalCondition == null) {
                throw new ApiError(404, ' Medical condition record not found.');
            }

            ResponseHandler.success(request, response, 'Medical condition record retrieved successfully!', 200, {
                MedicalCondition : MedicalCondition,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'StaticTypes.MedicalCondition.Search';
            await this._authorizer.authorize(request, response);

            const filters = await MedicalConditionValidator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;

            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} medical condition records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, {
                MedicalConditionRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'StaticTypes.MedicalCondition.Update';

            await this._authorizer.authorize(request, response);

            const domainModel = await MedicalConditionValidator.update(request);

            const id: string = await MedicalConditionValidator.getById(request);
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Medical condition record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update medical condition record!');
            }

            ResponseHandler.success(request, response, 'Medical condition record updated successfully!', 200, {
                MedicalCondition : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'StaticTypes.MedicalCondition.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await MedicalConditionValidator.getById(request);
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Medical condition record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Medical condition record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Medical condition record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
