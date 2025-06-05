import { Helper } from "../../../common/helper";
import { inject, injectable } from "tsyringe";
import { IAssessmentHelperRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.helper.repo.interface";
import { IAssessmentTemplateRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.template.repo.interface";
import { AssessmentTemplateDomainModel } from '../../../domain.types/clinical/assessment/assessment.template.domain.model';
import { AssessmentTemplateDto } from '../../../domain.types/clinical/assessment/assessment.template.dto';
import { AssessmentTemplateSearchFilters, AssessmentTemplateSearchResults } from "../../../domain.types/clinical/assessment/assessment.template.search.types";
import { AssessmentNodeType, CAssessmentListNode, CAssessmentMessageNode, CAssessmentNode, CAssessmentNodePath, CAssessmentPathCondition, CAssessmentQueryOption, CAssessmentQuestionNode, CAssessmentTemplate, CScoringCondition } from "../../../domain.types/clinical/assessment/assessment.types";
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { AssessmentTemplateFileConverter } from "./assessment.template.file.converter";
import { AssessmentNodeSearchFilters } from "../../../domain.types/clinical/assessment/assessment.node.search.types";
import { AssessmentNodeSearchResults } from "../../../domain.types/clinical/assessment/assessment.node.search.types";
import { Logger } from "../../../common/logger";
import { ApiError } from "../../../common/api.error";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class AssessmentTemplateService {

    constructor(
        @inject('IAssessmentTemplateRepo') private _assessmentTemplateRepo: IAssessmentTemplateRepo,
        @inject('IAssessmentHelperRepo') private _assessmentHelperRepo: IAssessmentHelperRepo,
    ) {}

    public create = async (assessmentDomainModel: AssessmentTemplateDomainModel): Promise<AssessmentTemplateDto> => {
        if (!assessmentDomainModel.DisplayCode) {
            assessmentDomainModel.DisplayCode = Helper.generateDisplayCode('AssessmtTmpl');
        }
        var template = await this._assessmentTemplateRepo.create(assessmentDomainModel);
        template = await this._assessmentHelperRepo.addRootNode(template.id);
        return template;
    };

    public getById = async (id: uuid): Promise<AssessmentTemplateDto> => {
        var templateDto = await this._assessmentTemplateRepo.getById(id);

        return templateDto;
    };

    public search = async (filters: AssessmentTemplateSearchFilters): Promise<AssessmentTemplateSearchResults> => {
        return await this._assessmentTemplateRepo.search(filters);
    };

    public update = async (id: uuid, assessmentDomainModel: AssessmentTemplateDomainModel):
        Promise<AssessmentTemplateDto> => {
        return await this._assessmentTemplateRepo.update(id, assessmentDomainModel);
    };

    public delete = async (id: uuid): Promise<boolean> => {
        return await this._assessmentTemplateRepo.delete(id);
    };

    public getByProviderAssessmentCode = async (provider: string, providerId: string) => {
        return await this._assessmentTemplateRepo.getByProviderAssessmentCode(
            provider, providerId);
    };

    public readTemplateObjToExport = async (templateId: uuid): Promise<CAssessmentTemplate> => {
        var template = await this._assessmentHelperRepo.readTemplateAsObj(templateId);
        template = this.sanitizeTemplateForExport(template);
        return template;
    };

    public import = async (model: any): Promise<AssessmentTemplateDto> => {
        let template: CAssessmentTemplate = model as CAssessmentTemplate;
        template = this.copyAssessmentTemplate(template);
        template.Title = `${template?.Title} - Copy`;
        return await this.addTemplate(template);
    };

    public addTemplate = async (template: CAssessmentTemplate): Promise<AssessmentTemplateDto> => {
        const resource = await AssessmentTemplateFileConverter.storeAssessmentTemplate(template);
        template.FileResourceId = resource.id;
        return await this._assessmentHelperRepo.addTemplate(template);
    };

    getNode = async (nodeId: string): Promise<any> => {
        return await this._assessmentHelperRepo.getNodeById(nodeId);
    };

    deleteNode = async (nodeId: string): Promise<boolean> => {
        return await this._assessmentHelperRepo.deleteNode(nodeId);
    };

    addNode = async (
        model: CAssessmentNode | CAssessmentListNode | CAssessmentQuestionNode | CAssessmentMessageNode) => {
        return await this._assessmentHelperRepo.createNode(model.TemplateId, model.ParentNodeId, model);
    };

    updateNode = async(nodeId: uuid, updates: any) => {
        return await this._assessmentHelperRepo.updateNode(nodeId, updates);
    };

    sanitizeTemplateForExport = (template: CAssessmentTemplate): CAssessmentTemplate => {

        delete template.TemplateId;

        for (var node of template.Nodes) {
            delete node.id;
            delete node.TemplateId;
            delete node.ParentNodeId;

            if (node.NodeType === AssessmentNodeType.NodeList) {
                delete (node as CAssessmentListNode).ChildrenNodeIds;
                delete (node as CAssessmentListNode).Children;
            }
            else if (node.NodeType === AssessmentNodeType.Question) {
                for (var option of (node as CAssessmentQuestionNode).Options) {
                    delete option.id;
                    delete option.NodeId;
                }
                for (var path of (node as CAssessmentQuestionNode).Paths) {
                    delete path.id;
                    delete path.ParentNodeId;
                    delete path.ConditionId;
                    delete path.NextNodeId;
                }
            }
            else if (node.NodeType === AssessmentNodeType.Message) {
                delete (node as CAssessmentMessageNode).Acknowledged;
            }
        }

        return template;
    };

    addScoringCondition = async(model: CScoringCondition): Promise<CScoringCondition> => {
        return await this._assessmentHelperRepo.addScoringCondition(model);
    };

    getScoringCondition = async(conditionId: uuid): Promise<CScoringCondition> => {
        return await this._assessmentHelperRepo.getScoringCondition(conditionId);
    };

    updateScoringCondition = async(conditionId: uuid, updates: any): Promise<CScoringCondition> => {
        return await this._assessmentHelperRepo.updateScoringCondition(conditionId, updates);
    };

    deleteScoringCondition = async(conditionId: uuid): Promise<boolean> => {
        return await this._assessmentHelperRepo.deleteScoringCondition(conditionId);
    };

    public searchNodes = async (filters: AssessmentNodeSearchFilters): Promise<AssessmentNodeSearchResults> => {
        return await this._assessmentHelperRepo.searchNodes(filters);
    };

    addPath = async (nodeId: uuid, path: CAssessmentNodePath): Promise<CAssessmentNodePath> => {
        return await this._assessmentHelperRepo.addPath(nodeId, path);
    };

    updatePath = async (pathId: uuid, updates: CAssessmentNodePath): Promise<CAssessmentNodePath> => {
        return await this._assessmentHelperRepo.updatePath(pathId, updates);
    };

    getPath = async (pathId: uuid): Promise<CAssessmentNodePath> => {
        return await this._assessmentHelperRepo.getPath(pathId);
    };

    deletePath = async (pathId: uuid): Promise<boolean> => {
        return await this._assessmentHelperRepo.deletePath(pathId);
    };

    addPathCondition = async (pathId: uuid, condition: CAssessmentPathCondition): Promise<CAssessmentPathCondition> => {
        return await this._assessmentHelperRepo.addPathCondition(pathId, condition);
    };

    updatePathCondition = async (conditionId: uuid, updates: CAssessmentPathCondition):
    Promise<CAssessmentPathCondition> => {
        return await this._assessmentHelperRepo.updatePathCondition(conditionId, updates);
    };

    getPathCondition = async (conditionId: uuid, nodeId: uuid, pathId: uuid): Promise<CAssessmentPathCondition> => {
        return await this._assessmentHelperRepo.getPathCondition(conditionId, nodeId, pathId);
    };

    deletePathCondition = async (conditionId: uuid): Promise<boolean> => {
        return await this._assessmentHelperRepo.deletePathCondition(conditionId);
    };

    getPathConditionForPath = async (pathId: uuid): Promise<CAssessmentPathCondition> => {
        return await this._assessmentHelperRepo.getPathConditionForPath(pathId);
    };

    getNodePaths = async (nodeId: uuid): Promise<CAssessmentNodePath[]> => {
        return await this._assessmentHelperRepo.getNodePaths(nodeId);
    };

    setNextNodeToPath = async (parentNodeId: uuid, pathId: uuid, nextNodeId: uuid): Promise<CAssessmentNodePath> => {
        return await this._assessmentHelperRepo.setNextNodeToPath(parentNodeId, pathId, nextNodeId);
    };

    addOption = async (nodeId: uuid, option: CAssessmentQueryOption ): Promise<CAssessmentQueryOption> => {
        return await this._assessmentHelperRepo.addOption(nodeId, option);
    };

    updateOption = async (optionId: uuid, updates: CAssessmentQueryOption): Promise<CAssessmentQueryOption> => {
        return await this._assessmentHelperRepo.updateOption(optionId, updates);
    };

    getOption = async (optionId: uuid): Promise<CAssessmentQueryOption> => {
        return await this._assessmentHelperRepo.getOption(optionId);
    };

    deleteOption = async (optionId: uuid): Promise<boolean> => {
        return await this._assessmentHelperRepo.deleteOption(optionId);
    };

    copyAssessmentTemplate = (originalTemplate: CAssessmentTemplate) : CAssessmentTemplate => {
        const copyTemplate = originalTemplate;

        const nodeCodeMap: Record<string, string> = {};
        const optionCodeMap: Record<string, string> = {};
        const conditionCodeMap: Record<string, string> = {};

        copyTemplate.ProviderAssessmentCode = Helper.generateDisplayId();

        const newTemplateDisplayCode = Helper.generateDisplayCode('AssessmtTmpl');
        copyTemplate.DisplayCode = newTemplateDisplayCode;

        for (const node of copyTemplate.Nodes) {
            const oldCode = node.DisplayCode;
            const isRNode = node.DisplayCode.startsWith('RNode');
            const prefix = this.getPrefixFromType(node.NodeType, isRNode);
            if (!prefix) {
                throw new ApiError(400, `Invalid node type: ${node.NodeType}`);
            }
            const newCode = Helper.generateDisplayCode(prefix);
            nodeCodeMap[oldCode] = newCode;
            node.DisplayCode = newCode;
        }

        if (originalTemplate.RootNodeDisplayCode && nodeCodeMap[originalTemplate.RootNodeDisplayCode]) {
            copyTemplate.RootNodeDisplayCode = nodeCodeMap[originalTemplate.RootNodeDisplayCode];
        }

        for (const node of copyTemplate.Nodes) {
            if (node.NodeType === AssessmentNodeType.NodeList && node.ChildrenNodeDisplayCodes?.length > 0) {
                node.ChildrenNodeDisplayCodes = node.ChildrenNodeDisplayCodes.map((oldChildCode: string) =>
                    nodeCodeMap[oldChildCode] || oldChildCode
                );
            }

            if (node.ParentNodeDisplayCode && nodeCodeMap[node.ParentNodeDisplayCode]) {
                node.ParentNodeDisplayCode = nodeCodeMap[node.ParentNodeDisplayCode];
            }
            
            if (node.NodeType === AssessmentNodeType.Question) {
                const questionNode = node as CAssessmentQuestionNode;
                if (questionNode.Options?.length) {
                    questionNode.Options = this.copyOptions(questionNode.Options, optionCodeMap);
                }

                if (questionNode.Paths && Array.isArray(questionNode.Paths)) {
                    questionNode.Paths = this.copyConditionCodes(
                        questionNode.Paths,
                        questionNode.DisplayCode,
                        conditionCodeMap
                    );
                }
            }
        }

        return copyTemplate;
    };

    private copyOptions = (
        options: CAssessmentQueryOption[],
        optionCodeMap: Record<string, string>
    ): CAssessmentQueryOption[] => {
        return options.map(option => {
            const newCode = `${Helper.generateDisplayCode('QNode')}:Option#${option.Sequence}`;
            optionCodeMap[option.DisplayCode] = newCode;
            option.DisplayCode = newCode;
            return option;
        });
    };

    private copyConditionCodes = (
        conditions: CAssessmentPathCondition[],
        parentCode: string,
        conditionCodeMap: Record<string, string>
    ): CAssessmentPathCondition[] => {
        return conditions.map((condition) => {
            const newCode = Helper.generateDisplayCode('Condition');
            if (condition.DisplayCode) {
                conditionCodeMap[condition.DisplayCode] = newCode;
            }
            condition.DisplayCode = newCode;

            if (condition.Children && condition.Children.length > 0) {
                condition.Children = this.copyConditionCodes(
                    condition.Children,
                    parentCode,
                    conditionCodeMap,
                );
            }

            return condition;
        });
    };

    private getPrefixFromType = (type: string, isRNode: boolean = false): string => {
        switch (type) {
            case AssessmentNodeType.Message:
                return 'MNode';
            case AssessmentNodeType.Question:
                return 'QNode';
            case AssessmentNodeType.NodeList:
                return isRNode ? 'RNode' : 'LNode';
            default:
                return null;
        }
    };

    public setupBasicAssessmentTemplate = async (tenantId: uuid): Promise<void> => {
        const displayCode = "BasicAssessmentTemplate";

        const filters: AssessmentTemplateSearchFilters = {
            DisplayCode : displayCode,
        };

        const searchResult = await this.search(filters);
        if (searchResult.RetrievedCount === 0) {
            throw new ApiError(404, 'Cannot find basic assessment Template!');
        }

        const assessmentTemplateId = searchResult.Items[0]?.id;
          
        let templateObj: CAssessmentTemplate = await this.readTemplateObjToExport(assessmentTemplateId);
        templateObj.TenantId = tenantId;

        templateObj = this.copyAssessmentTemplate(templateObj);
        const template = await this._assessmentHelperRepo.addTemplate(templateObj);

        if (!template) {
            throw new ApiError(500, 'Failed to promote basic assessment template to tenant.');
        }
        Logger.instance().log(`Successfully created basic assessment template for tenant.`);
    
    };

}
