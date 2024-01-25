import express from 'express';
import fs from 'fs';
import { Logger } from '../../../../common/logger';
import { ApiError } from '../../../../common/api.error';
import { Helper } from '../../../../common/helper';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { CAssessmentListNode, CAssessmentMessageNode, CAssessmentNode, CAssessmentQuestionNode, CAssessmentTemplate, CScoringCondition } from '../../../../domain.types/clinical/assessment/assessment.types';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { AssessmentTemplateFileConverter } from '../../../../services/clinical/assessment/assessment.template.file.converter';
import { AssessmentTemplateService } from '../../../../services/clinical/assessment/assessment.template.service';
import { FileResourceService } from '../../../../services/general/file.resource.service';
import { Injector } from '../../../../startup/injector';
import { AssessmentTemplateValidator } from './assessment.template.validator';
import { FileResourceValidator } from '../../../general/file.resource/file.resource.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class AssessmentTemplateController{

    //#region member variables and constructors

    _service: AssessmentTemplateService = null;

    _fileResourceService: FileResourceService = null;

    _validator: AssessmentTemplateValidator = new AssessmentTemplateValidator();

    _fileResourceValidator: FileResourceValidator = new FileResourceValidator();

    constructor() {
        this._service = Injector.Container.resolve(AssessmentTemplateService);
        this._fileResourceService = Injector.Container.resolve(FileResourceService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

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

    export = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const assessmentTemplate = await this._service.getById(id);
            if (assessmentTemplate == null) {
                throw new ApiError(404, 'Cannot find assessment Template!');
            }

            var templateObj: CAssessmentTemplate = await this._service.readTemplateObjToExport(assessmentTemplate.id);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { dateFolder, filename, sourceFileLocation }
                = await AssessmentTemplateFileConverter.storeTemplateToFileLocally(templateObj);

            var mimeType = Helper.getMimeType(sourceFileLocation);
            response.setHeader('Content-type', mimeType);
            response.setHeader('Content-disposition', 'attachment; filename=' + filename);

            var filestream = fs.createReadStream(sourceFileLocation);
            filestream.pipe(response);

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    importFromFile = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const uploadModels = this._fileResourceValidator.getUploadDomainModel(request);
            if (uploadModels.length === 0) {
                throw new ApiError(422, 'Cannot find valid file to import!');
            }

            const uploadModel = uploadModels[0];
            const metadata = uploadModel.FileMetadata;
            const sourceFilePath = metadata.SourceFilePath;
            const originalFileName = metadata.OriginalName;

            Helper.sleep(1000);
            const fileContent = fs.readFileSync(sourceFilePath, 'utf8');
            const extension = Helper.getFileExtension(originalFileName);
            if (extension.toLowerCase() !== 'json') {
                throw new Error(`Expected .json file extension!`);
            }
            const templateModel =  JSON.parse(fileContent);

            var assessmentTemplate = await this._service.import(templateModel);
            if (assessmentTemplate == null) {
                throw new ApiError(400, 'Cannot import assessment Template!');
            }

            ResponseHandler.success(request, response, 'Assessment template imported successfully!', 201, {
                AssessmentTemplate : assessmentTemplate,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    importFromJson = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const templateModel = JSON.parse(request.body);

            var assessmentTemplate = await this._service.import(templateModel);
            if (assessmentTemplate == null) {
                throw new ApiError(400, 'Cannot import assessment Template!');
            }

            ResponseHandler.success(request, response, 'Assessment template imported successfully!', 201, {
                AssessmentTemplate : assessmentTemplate,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    addNode = async (request: express.Request, response: express.Response) => {
        try {
            const model:CAssessmentNode | CAssessmentListNode | CAssessmentQuestionNode | CAssessmentMessageNode
                = await this._validator.addNode(request);

            const assessmentNode = await this._service.addNode(model);
            if (assessmentNode == null) {
                throw new ApiError(400, 'Cannot create record for assessment node!');
            }

            ResponseHandler.success(request, response, 'Assessment node record created successfully!', 201, {
                AssessmentNode : assessmentNode,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updateNode = async (request: express.Request, response: express.Response) => {
        try {

            const nodeId: uuid = await this._validator.getParamUuid(request, 'nodeId');
            var updates = await this._validator.updateNode(request);

            var assessmentNode: CAssessmentNode = await this._service.getNode(nodeId);
            if (assessmentNode == null) {
                throw new ApiError(404, 'Cannot retrieve record for assessment node!');
            }

            var updatedNode = await this._service.updateNode(nodeId, updates);
            if (updatedNode == null) {
                throw new ApiError(500, 'Unable to update assessment node!');
            }

            ResponseHandler.success(request, response, 'Assessment node record retrieved successfully!', 200, {
                AssessmentNode : updatedNode,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    deleteNode = async (request: express.Request, response: express.Response) => {
        try {

            const nodeId: uuid = await this._validator.getParamUuid(request, 'nodeId');
            const deleted: boolean = await this._service.deleteNode(nodeId);
            if (!deleted) {
                throw new ApiError(400, 'Cannot remove record for assessment node!');
            }

            ResponseHandler.success(request, response, 'Assessment node record removed successfully!', 200, {
                Deleted : deleted,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getNode = async (request: express.Request, response: express.Response) => {
        try {

            const nodeId: uuid = await this._validator.getParamUuid(request, 'nodeId');
            const assessmentNode: CAssessmentNode = await this._service.getNode(nodeId);
            if (assessmentNode == null) {
                throw new ApiError(404, 'Cannot retrieve record for assessment node!');
            }

            ResponseHandler.success(request, response, 'Assessment node record retrieved successfully!', 200, {
                AssessmentNode : assessmentNode,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    addScoringCondition = async (request: express.Request, response: express.Response) => {
        try {

            const model:CScoringCondition
                = await this._validator.addScoringCondition(request);

            const condition = await this._service.addScoringCondition(model);
            if (condition == null) {
                throw new ApiError(400, 'Cannot create record for scoring condition!');
            }

            ResponseHandler.success(request, response, 'Scoring condition record created successfully!', 201, {
                ScoringCondition : condition,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updateScoringCondition = async (request: express.Request, response: express.Response) => {
        try {

            const templateId: uuid = await this._validator.getParamUuid(request, 'id');
            Logger.instance().log(`Updating scoring condition for assessment template - ${templateId}`);

            const conditionId: uuid = await this._validator.getParamUuid(request, 'conditionId');
            var updates = await this._validator.updateScoringCondition(request);

            var condition: CScoringCondition = await this._service.getScoringCondition(conditionId);
            if (condition == null) {
                throw new ApiError(404, 'Cannot retrieve record for scoring condition!');
            }

            var updatedCondition = await this._service.updateScoringCondition(conditionId, updates);
            if (updatedCondition == null) {
                throw new ApiError(500, 'Unable to update scoring condition!');
            }

            ResponseHandler.success(request, response, 'Scoring condition record retrieved successfully!', 200, {
                ScoringCondition : updatedCondition,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    deleteScoringCondition = async (request: express.Request, response: express.Response) => {
        try {

            const conditionId: uuid = await this._validator.getParamUuid(request, 'conditionId');
            const deleted: boolean = await this._service.deleteScoringCondition(conditionId);
            if (!deleted) {
                throw new ApiError(400, 'Cannot remove record for scoring condition!');
            }

            ResponseHandler.success(request, response, 'Scoring condition record removed successfully!', 200, {
                Deleted : deleted,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getScoringCondition = async (request: express.Request, response: express.Response) => {
        try {

            const conditionId: uuid = await this._validator.getParamUuid(request, 'conditionId');
            const condition: CScoringCondition = await this._service.getScoringCondition(conditionId);
            if (condition == null) {
                throw new ApiError(404, 'Cannot retrieve record for scoring condition!');
            }

            ResponseHandler.success(request, response, 'Scoring condition record retrieved successfully!', 200, {
                ScoringCondition : condition,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    searchNode = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const filters = await this._validator.searchNode(request);
            const searchResults = await this._service.searchNode(filters);

            const count = searchResults.Items.length;

            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} assessment node records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                AssessmentNodeRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
