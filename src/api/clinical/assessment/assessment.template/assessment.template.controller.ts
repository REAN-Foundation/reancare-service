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
import { BaseController } from '../../../../api/base.controller';
import { AssessmentTemplateDto } from '../../../../domain.types/clinical/assessment/assessment.template.dto';
import { AssessmentTemplateSearchFilters } from '../../../../domain.types/clinical/assessment/assessment.template.search.types';
import { AssessmentTemplateDomainModel } from '../../../../domain.types/clinical/assessment/assessment.template.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

export class AssessmentTemplateController extends BaseController {

    //#region member variables and constructors

    _service: AssessmentTemplateService = Injector.Container.resolve(AssessmentTemplateService);

    _fileResourceService: FileResourceService = Injector.Container.resolve(FileResourceService);

    _validator: AssessmentTemplateValidator = new AssessmentTemplateValidator();

    _fileResourceValidator: FileResourceValidator = new FileResourceValidator();

    constructor() {
        super();
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const model = await this._validator.create(request);
            await this.authorizeOne(request, null, model.TenantId);
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
            const assessmentTemplate: AssessmentTemplateDto = await this._service.getById(id);
            if (assessmentTemplate == null) {
                throw new ApiError(404, 'Assessment template record not found.');
            }
            await this.authorizeOne(request, null, assessmentTemplate.TenantId);
            ResponseHandler.success(request, response, 'Assessment template record retrieved successfully!', 200, {
                AssessmentTemplate : assessmentTemplate,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            let filters = await this._validator.search(request);
            filters = await this.authorizeSearch(request, filters);
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
            await this.authorizeOne(request, null, existingRecord.TenantId);

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
            await this.authorizeOne(request, null, existingRecord.TenantId);
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
            await this.authorizeOne(request, null, assessmentTemplate.TenantId);

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

            // Ensure that the imported template belongs to the current user's tenant
            const currentUserTenantId = request.currentUser.TenantId;
            if (assessmentTemplate.TenantId !== currentUserTenantId && 
                currentUserTenantId != null) {
                const updates: AssessmentTemplateDomainModel = { TenantId: currentUserTenantId };
                await this._service.update(assessmentTemplate.id, updates);
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

            // Ensure that the imported template belongs to the current user's tenant
            const currentUserTenantId = request.currentUser.TenantId;
            if (assessmentTemplate.TenantId !== currentUserTenantId &&
                currentUserTenantId != null) {
                const updates: AssessmentTemplateDomainModel = { TenantId: currentUserTenantId };
                await this._service.update(assessmentTemplate.id, updates);
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

            await this.authorizeTemplateAccess(request);
            
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
            await this.authorizeTemplateAccess(request);
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
            await this.authorizeTemplateAccess(request);
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
            await this.authorizeTemplateAccess(request);
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
            await this.authorizeTemplateAccess(request);
            
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
            await this.authorizeTemplateAccess(request);
            
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
            await this.authorizeTemplateAccess(request);
            
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
            await this.authorizeTemplateAccess(request);
            
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

    searchNodes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            let filters = await this._validator.searchNodes(request);
            filters = await this.authorizeSearch(request, filters);
            
            const searchResults = await this._service.searchNodes(filters);

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

    addPath = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorizeTemplateAccess(request);
            
            const nodeId: uuid = await this._validator.getParamUuid(request, 'nodeId');
            const templateId: uuid = await this._validator.getParamUuid(request, 'id');
            await this.checkNodeAndTemplate(nodeId, templateId);
            const model = await this._validator.addPath(request);
            const path = await this._service.addPath(nodeId, model);
            if (path == null) {
                throw new ApiError(400, 'Cannot create record for path!');
            }
            ResponseHandler.success(request, response, 'Path record created successfully!', 201, {
                NodePath : path,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updatePath = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorizeTemplateAccess(request);
            
            const nodeId: uuid = await this._validator.getParamUuid(request, 'nodeId');
            const pathId: uuid = await this._validator.getParamUuid(request, 'pathId');
            const templateId: uuid = await this._validator.getParamUuid(request, 'id');
            await this.checkNodeAndTemplate(nodeId, templateId);
            const updates = await this._validator.updatePath(request);
            const path = await this._service.updatePath(pathId, updates);
            if (path == null) {
                throw new ApiError(400, 'Cannot update record for path!');
            }
            ResponseHandler.success(request, response, 'Path record updated successfully!', 200, {
                NodePath : path,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    deletePath = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorizeTemplateAccess(request);
            
            const nodeId: uuid = await this._validator.getParamUuid(request, 'nodeId');
            const pathId: uuid = await this._validator.getParamUuid(request, 'pathId');
            const templateId: uuid = await this._validator.getParamUuid(request, 'id');
            await this.checkNodeAndTemplate(nodeId, templateId);
            const deleted = await this._service.deletePath(pathId);
            if (!deleted) {
                throw new ApiError(400, 'Cannot remove record for path!');
            }
            ResponseHandler.success(request, response, 'Path record removed successfully!', 200, {
                Deleted : deleted,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getPath = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorizeTemplateAccess(request);
            
            const nodeId: uuid = await this._validator.getParamUuid(request, 'nodeId');
            const pathId: uuid = await this._validator.getParamUuid(request, 'pathId');
            const templateId: uuid = await this._validator.getParamUuid(request, 'id');
            await this.checkNodeAndTemplate(nodeId, templateId);
            const path = await this._service.getPath(pathId);
            if (path == null) {
                throw new ApiError(404, 'Cannot retrieve record for path!');
            }
            ResponseHandler.success(request, response, 'Path record retrieved successfully!', 200, {
                NodePath : path,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getNodePaths = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorizeTemplateAccess(request);
            
            const nodeId: uuid = await this._validator.getParamUuid(request, 'nodeId');
            const templateId: uuid = await this._validator.getParamUuid(request, 'id');
            await this.checkNodeAndTemplate(nodeId, templateId);
            const paths = await this._service.getNodePaths(nodeId);
            ResponseHandler.success(request, response, 'Node paths retrieved successfully!', 200, {
                NodePaths : paths,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    addPathCondition = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorizeTemplateAccess(request);
            
            const nodeId: uuid = await this._validator.getParamUuid(request, 'nodeId');
            const pathId: uuid = await this._validator.getParamUuid(request, 'pathId');
            const templateId: uuid = await this._validator.getParamUuid(request, 'id');
            await this.checkNodeAndTemplate(nodeId, templateId);
            const model = await this._validator.addPathCondition(request);
            const condition = await this._service.addPathCondition(pathId, model);
            if (condition == null) {
                throw new ApiError(400, 'Cannot create record for path condition!');
            }
            ResponseHandler.success(request, response, 'Path condition record created successfully!', 201, {
                PathCondition : condition,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updatePathCondition = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorizeTemplateAccess(request);
            
            const nodeId: uuid = await this._validator.getParamUuid(request, 'nodeId');
            // const pathId: uuid = await this._validator.getParamUuid(request, 'pathId');
            const conditionId: uuid = await this._validator.getParamUuid(request, 'conditionId');
            const templateId: uuid = await this._validator.getParamUuid(request, 'id');
            await this.checkNodeAndTemplate(nodeId, templateId);
            const updates = await this._validator.updatePathCondition(request);
            const condition = await this._service.updatePathCondition(conditionId, updates);
            if (condition == null) {
                throw new ApiError(400, 'Cannot update record for path condition!');
            }
            ResponseHandler.success(request, response, 'Path condition record updated successfully!', 200, {
                PathCondition : condition,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    deletePathCondition = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorizeTemplateAccess(request);
            
            const nodeId: uuid = await this._validator.getParamUuid(request, 'nodeId');
            // const pathId: uuid = await this._validator.getParamUuid(request, 'pathId');
            const conditionId: uuid = await this._validator.getParamUuid(request, 'conditionId');
            const templateId: uuid = await this._validator.getParamUuid(request, 'id');
            await this.checkNodeAndTemplate(nodeId, templateId);
            const deleted = await this._service.deletePathCondition(conditionId);
            if (!deleted) {
                throw new ApiError(400, 'Cannot remove record for path condition!');
            }
            ResponseHandler.success(request, response, 'Path condition record removed successfully!', 200, {
                Deleted : deleted,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getPathCondition = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorizeTemplateAccess(request);
            
            const nodeId: uuid = await this._validator.getParamUuid(request, 'nodeId');
            const pathId: uuid = await this._validator.getParamUuid(request, 'pathId');
            const conditionId: uuid = await this._validator.getParamUuid(request, 'conditionId');
            const templateId: uuid = await this._validator.getParamUuid(request, 'id');
            await this.checkNodeAndTemplate(nodeId, templateId);
            const condition = await this._service.getPathCondition(conditionId, nodeId, pathId);
            if (condition == null) {
                throw new ApiError(404, 'Cannot retrieve record for path condition!');
            }
            ResponseHandler.success(request, response, 'Path condition record retrieved successfully!', 200, {
                PathCondition : condition,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getPathConditionsForPath = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorizeTemplateAccess(request);
            
            const nodeId: uuid = await this._validator.getParamUuid(request, 'nodeId');
            const pathId: uuid = await this._validator.getParamUuid(request, 'pathId');
            const templateId: uuid = await this._validator.getParamUuid(request, 'id');
            await this.checkNodeAndTemplate(nodeId, templateId);
            const conditions = await this._service.getPathConditionForPath(pathId);
            ResponseHandler.success(request, response, 'Path conditions retrieved successfully!', 200, {
                PathConditions : conditions,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    setNextNodeToPath = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorizeTemplateAccess(request);
            
            const nodeId: uuid = await this._validator.getParamUuid(request, 'nodeId');
            const pathId: uuid = await this._validator.getParamUuid(request, 'pathId');
            const templateId: uuid = await this._validator.getParamUuid(request, 'id');
            await this.checkNodeAndTemplate(nodeId, templateId);
            const nextNodeId: uuid = await this._validator.getParamUuid(request, 'nextNodeId');
            const updatedPath = await this._service.setNextNodeToPath(nodeId, pathId, nextNodeId);
            if (updatedPath == null) {
                throw new ApiError(400, 'Cannot update record for path!');
            }
            ResponseHandler.success(request, response, 'Path record updated successfully!', 200, {
                NodePath : updatedPath,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
    
    addOption = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.authorizeTemplateAccess(request);
            
            const nodeId: uuid = await this._validator.getParamUuid(request, 'nodeId');
            const templateId: uuid = await this._validator.getParamUuid(request, 'id');
            await this.checkNodeAndTemplate(nodeId, templateId);

            const model = await this._validator.addOption(request);
            const option = await this._service.addOption(nodeId, model);
            if (option == null) {
                throw new ApiError(400, 'Cannot create record for option!');
            }
            ResponseHandler.success(request, response, 'Option record created successfully!', 201, {
                NodeOption : option,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updateOption = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorizeTemplateAccess(request);
            
            const nodeId: uuid = await this._validator.getParamUuid(request, 'nodeId');
            const optionId: uuid = await this._validator.getParamUuid(request, 'optionId');
            const templateId: uuid = await this._validator.getParamUuid(request, 'id');
            await this.checkNodeAndTemplate(nodeId, templateId);
            const updates = await this._validator.updateOption(request);
            const option = await this._service.updateOption(optionId, updates);
            if (option == null) {
                throw new ApiError(400, 'Cannot update record for option!');
            }
            ResponseHandler.success(request, response, 'Option record updated successfully!', 200, {
                NodeOption : option,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getOption = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorizeTemplateAccess(request);
            
            const nodeId: uuid = await this._validator.getParamUuid(request, 'nodeId');
            const optionId: uuid = await this._validator.getParamUuid(request, 'optionId');
            const templateId: uuid = await this._validator.getParamUuid(request, 'id');
            await this.checkNodeAndTemplate(nodeId, templateId);
            const option = await this._service.getOption(optionId);
            if (option == null) {
                throw new ApiError(404, 'Cannot retrieve record for option!');
            }
            ResponseHandler.success(request, response, 'Option record retrieved successfully!', 200, {
                Option : option,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    deleteOption = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorizeTemplateAccess(request);
            
            const nodeId: uuid = await this._validator.getParamUuid(request, 'nodeId');
            const optionId: uuid = await this._validator.getParamUuid(request, 'optionId');
            const templateId: uuid = await this._validator.getParamUuid(request, 'id');
            await this.checkNodeAndTemplate(nodeId, templateId);
            const deleted = await this._service.deleteOption(optionId);
            if (!deleted) {
                throw new ApiError(400, 'Cannot remove option for assessment node!');
            }
            ResponseHandler.success(request, response, 'Assessment node option record removed successfully!', 200, {
                Deleted : deleted,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    private async checkNodeAndTemplate(nodeId: string, templateId: string) {
        const node = await this._service.getNode(nodeId);
        if (node == null) {
            throw new ApiError(404, 'Cannot find node to add path!');
        }
        if (node.NodeType !== 'Question') {
            throw new ApiError(400, 'Only question nodes can have paths!');
        }
        if (node.TemplateId !== templateId) {
            throw new ApiError(400, 'Node does not belong to the template!');
        }
    }

    //#endregion

    //#region Authorization

    authorizeSearch = async (
        request: express.Request,
        searchFilters: AssessmentTemplateSearchFilters): Promise<AssessmentTemplateSearchFilters> => {

        if (request.currentClient?.IsPrivileged) {
            return searchFilters;
        }

        if (searchFilters.TenantId != null) {
            if (searchFilters.TenantId !== request.currentUser.TenantId) {
                throw new ApiError(403, 'Forbidden');
            }
        }
        else {
            searchFilters.TenantId = request.currentUser.TenantId;
        }
        return searchFilters;
    };

    authorizeTemplateAccess = async (request: express.Request): Promise<void> => {
        const templateId = await this._validator.getParamUuid(request, 'id');
        const assessmentTemplate = await this._service.getById(templateId);
        if (assessmentTemplate == null) {
            throw new ApiError(404, 'Cannot find assessment Template!');
        }
        await this.authorizeOne(request, null, assessmentTemplate.TenantId);
    };

    //#endregion
}
