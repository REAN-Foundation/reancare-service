import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { MedicalConditionService } from '../../../services/clinical/medical.condition.service';
import { Loader } from '../../../startup/loader';
import { MedicalConditionValidator } from './medical.condition.validator';
import { BaseController } from '../../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class MedicalConditionController extends BaseController {

    //#region member variables and constructors

    _service: MedicalConditionService = null;

    _validator: MedicalConditionValidator = new MedicalConditionValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(MedicalConditionService);

    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('MedicalCondition.Create', request, response);

            const medicalConditionDomainModel = await this._validator.create(request);

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
            await this.setContext('MedicalCondition.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');

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
            await this.setContext('MedicalCondition.Search', request, response);

            const filters = await this._validator.search(request);

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
            await this.setContext('MedicalCondition.Update', request, response);

            const domainModel = await this._validator.update(request);

            const id: uuid = await this._validator.getParamUuid(request, 'id');

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
            await this.setContext('MedicalCondition.Update', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
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
