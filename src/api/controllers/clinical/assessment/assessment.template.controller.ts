import express from 'express';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { AssessmentTemplateService } from '../../../../services/clinical/assessment/assessment.template.service';
import { AssessmentTemplateValidator } from '../../../validators/clinical/assessment/assessment.template.validator';
import { Loader } from '../../../../startup/loader';
import { BaseController } from '../../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class AssessmentTemplateController extends BaseController{

    //#region member variables and constructors

    _service: AssessmentTemplateService = null;

    _validator: AssessmentTemplateValidator = new AssessmentTemplateValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(AssessmentTemplateService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            this.setContext('Biometrics.AssessmentTemplate.Create', request, response);

            const model = await this._validator.create(request);
            const assessment = await this._service.create(model);
            if (assessment == null) {
                throw new ApiError(400, 'Cannot create record for assessment!');
            }

            ResponseHandler.success(request, response, 'AssessmentTemplate record created successfully!', 201, {
                AssessmentTemplate : assessment,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            this.setContext('Biometrics.AssessmentTemplate.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const assessment = await this._service.getById(id);
            if (assessment == null) {
                throw new ApiError(404, 'AssessmentTemplate record not found.');
            }

            ResponseHandler.success(request, response, 'AssessmentTemplate record retrieved successfully!', 200, {
                AssessmentTemplate : assessment,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            this.setContext('Biometrics.AssessmentTemplate.Search', request, response);

            const filters = await this._validator.search(request);
            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;

            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} assessment records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, {
                AssessmentTemplateRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            this.setContext('Biometrics.AssessmentTemplate.Update', request, response);

            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'AssessmentTemplate record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update assessment record!');
            }

            ResponseHandler.success(request, response, 'AssessmentTemplate record updated successfully!', 200, {
                AssessmentTemplate : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            this.setContext('Biometrics.AssessmentTemplate.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'AssessmentTemplate record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'AssessmentTemplate record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'AssessmentTemplate record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
