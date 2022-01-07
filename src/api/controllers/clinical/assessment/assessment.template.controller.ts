import express from 'express';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { AssessmentTemplateService } from '../../../../services/clinical/assessment/assessment.template.service';
import { AssessmentTemplateValidator } from '../../../validators/clinical/assessment/assessment.template.validator';
import { Loader } from '../../../../startup/loader';
import { BaseController } from '../../base.controller';
import { FileResourceValidator } from '../../../validators/file.resource.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class AssessmentTemplateController extends BaseController{

    //#region member variables and constructors

    _service: AssessmentTemplateService = null;

    _validator: AssessmentTemplateValidator = new AssessmentTemplateValidator();

    _fileResourceValidator: FileResourceValidator = new FileResourceValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(AssessmentTemplateService);
    }

    //#endregion

    //#region Action methods

    // importFromFile = async (request: express.Request, response: express.Response): Promise<void> => {
    //     try {
            
    //         this.setContext('AssessmentTemplate.ImportFromFile', request, response);

    //         const models = await this._fileResourceValidator.getUploadDomainModel(request);
    //         if (models.length === 0) {
    //             throw new ApiError(422, 'Cannot find valid file to import!');
    //         }
    //         const model = models[0];
    //         const assessmentTemplate = await this._service.importFromFile(model);
    //         if (assessmentTemplate == null) {
    //             throw new ApiError(400, 'Cannot import assessment Template!');
    //         }

    //         ResponseHandler.success(request, response, 'Assessment template record created successfully!', 201, {
    //             AssessmentTemplate : assessmentTemplate,
    //         });
    //     } catch (error) {
    //         ResponseHandler.handleError(request, response, error);
    //     }
    // };

    // importFromJson = async (request: express.Request, response: express.Response): Promise<void> => {
    //     try {
            
    //         this.setContext('AssessmentTemplate.ImportFromJson', request, response);

    //         const model = request.body;
    //         const assessmentTemplate = await this._service.importFromJson(model);
    //         if (assessmentTemplate == null) {
    //             throw new ApiError(400, 'Cannot find valid file to import!');
    //         }

    //         ResponseHandler.success(request, response, 'Assessment template record created successfully!', 201, {
    //             AssessmentTemplate : assessmentTemplate,
    //         });
    //     } catch (error) {
    //         ResponseHandler.handleError(request, response, error);
    //     }
    // };

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            this.setContext('AssessmentTemplate.Create', request, response);

            const model = await this._validator.create(request);
            const assessmentTemplate = await this._service.create(model);
            if (assessmentTemplate == null) {
                throw new ApiError(400, 'Cannot create record for assessment Template!');
            }

            ResponseHandler.success(request, response, 'Assessment template record created successfully!', 201, {
                AssessmentTemplate : assessmentTemplate,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            this.setContext('AssessmentTemplate.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const assessmentTemplate = await this._service.getById(id);
            if (assessmentTemplate == null) {
                throw new ApiError(404, 'Assessment template record not found.');
            }

            ResponseHandler.success(request, response, 'Assessment template record retrieved successfully!', 200, {
                AssessmentTemplate : assessmentTemplate,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            this.setContext('AssessmentTemplate.Search', request, response);

            const filters = await this._validator.search(request);
            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;

            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} assessmentTemplate records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, {
                AssessmentTemplateRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            this.setContext('AssessmentTemplate.Update', request, response);

            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Assessment template record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update assessmentTemplate record!');
            }

            ResponseHandler.success(request, response, 'Assessment template record updated successfully!', 200, {
                AssessmentTemplate : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            this.setContext('AssessmentTemplate.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Assessment template record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Assessment template record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Assessment template record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
