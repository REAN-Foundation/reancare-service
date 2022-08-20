import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { AssessmentTemplateDto } from '../../../../../../domain.types/clinical/assessment/assessment.template.dto';
import { IAssessmentHelperRepo } from '../../../../../repository.interfaces/clinical/assessment/assessment.helper.repo.interface';
import { AssessmentTemplateMapper } from '../../../mappers/clinical/assessment/assessment.template.mapper';
import {
    CAssessmentTemplate,
    CAssessmentNode,
    AssessmentNodeType,
    CAssessmentListNode,
    CAssessmentMessageNode,
    CAssessmentQuestionNode,
    CAssessmentQueryOption,
    CAssessmentNodePath,
    CAssessmentPathCondition,
    ConditionOperandDataType,
    CAssessmentQueryResponse,
    QueryResponseType,
    SingleChoiceQueryAnswer,
    MultipleChoiceQueryAnswer,
    MessageAnswer,
    TextQueryAnswer,
    IntegerQueryAnswer,
    FloatQueryAnswer,
    BiometricQueryAnswer,
    BooleanQueryAnswer,
    FileQueryAnswer,
    DateQueryAnswer,
    AssessmentType,
} from '../../../../../../domain.types/clinical/assessment/assessment.types';
import { AssessmentTemplateDomainModel } from '../../../../../../domain.types/clinical/assessment/assessment.template.domain.model';
import AssessmentTemplate from '../../../models/clinical/assessment/assessment.template.model';
import AssessmentNode from '../../../models/clinical/assessment/assessment.node.model';
import { uuid } from '../../../../../../domain.types/miscellaneous/system.types';
import AssessmentQueryOption from '../../../models/clinical/assessment/assessment.query.option.model';
import AssessmentNodePath from '../../../models/clinical/assessment/assessment.node.path.model';
import AssessmentPathCondition from '../../../models/clinical/assessment/assessment.path.condition.model';
import { AssessmentHelperMapper } from '../../../mappers/clinical/assessment/assessment.helper.mapper';
import AssessmentQueryResponse from '../../../models/clinical/assessment/assessment.query.response.model';
import { Helper } from '../../../../../../common/helper';

///////////////////////////////////////////////////////////////////////

export class AssessmentHelperRepo implements IAssessmentHelperRepo {

    //#region Publics

    public addTemplate = async (t: CAssessmentTemplate): Promise<AssessmentTemplateDto> => {
        try {
            const existing = await AssessmentTemplate.findOne({
                where : {
                    Provider               : t.Provider,
                    ProviderAssessmentCode : t.ProviderAssessmentCode,
                },
            });
            if (existing) {
                return AssessmentTemplateMapper.toDto(existing);
            }

            const templateModel: AssessmentTemplateDomainModel = {
                DisplayCode                 : t.DisplayCode,
                Title                       : t.Title,
                Description                 : t.Description,
                Type                        : t.Type,
                Provider                    : t.Provider,
                ProviderAssessmentCode      : t.ProviderAssessmentCode,
                FileResourceId              : t.FileResourceId,
                ServeListNodeChildrenAtOnce : t.ServeListNodeChildrenAtOnce,
            };

            var template = await AssessmentTemplate.create(templateModel as any);

            const rootNodeDisplayCode: string = t.RootNodeDisplayCode;
            var sRootNode = CAssessmentTemplate.getNodeByDisplayCode(t.Nodes, rootNodeDisplayCode);
            sRootNode.Sequence = 0;
            sRootNode.Score = 0;
            const rootNode = await this.createNewNode(t, template.id, null, sRootNode);
            template.RootNodeId = rootNode.id;
            var updatedTemplate = await template.save();
            if (updatedTemplate.RootNodeId == null) {
                throw new Error("Unable to save root node id for the template.");
            }

            return AssessmentTemplateMapper.toDto(template);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    addRootNode = async (templateId: string): Promise<AssessmentTemplateDto> => {

        var template = await AssessmentTemplate.findByPk(templateId);

        const rootNodeDisplayCode: string = Helper.generateDisplayCode('RNode');
        const rootNode: CAssessmentListNode = {
            NodeType                 : AssessmentNodeType.NodeList,
            TemplateId               : template.id,
            DisplayCode              : rootNodeDisplayCode,
            ParentNodeId             : null,
            Title                    : 'Assessment root node',
            Sequence                 : 0,
            Score                    : 0,
            Required                 : true,
            ChildrenNodeDisplayCodes : [],
            ChildrenNodeIds          : []
        };
        const node = await this.createNode(template.id, null, rootNode);
        template.RootNodeId = node.id;
        var updatedTemplate = await template.save();
        if (updatedTemplate.RootNodeId == null) {
            throw new Error("Unable to save root node id for the template.");
        }

        return AssessmentTemplateMapper.toDto(template);
    };

    public readTemplateAsObj = async (templateId: uuid): Promise<CAssessmentTemplate> => {
        var template = await AssessmentTemplate.findByPk(templateId);
        if (!template) {
            return null;
        }
        var rootNodeId = template.RootNodeId;
        var rootNode = await this.getNodeById(rootNodeId);
        if (!rootNode) {
            throw new ApiError(404, `Cannot find root node for the assessment template!`);
        }
        var nodes = await this.getTemplateChildrenNodesForExport(templateId);
        var templateObj: CAssessmentTemplate = {
            TemplateId             : template.id,
            DisplayCode            : template.DisplayCode,
            Title                  : template.Title,
            Description            : template.Description,
            Provider               : template.Provider,
            ProviderAssessmentCode : template.ProviderAssessmentCode,
            Version                : template.Version,
            RootNodeDisplayCode    : rootNode.DisplayCode,
            Nodes                  : nodes,
            Type                   : template.Type as AssessmentType,
        };
        return templateObj;
    };

    public getTemplateChildrenNodesForExport = async (templateId: uuid)
        : Promise<(CAssessmentQuestionNode | CAssessmentListNode | CAssessmentMessageNode)[]> => {
        try {
            var nodes = await AssessmentNode.findAll({
                where : {
                    TemplateId : templateId
                }
            });
            var xNodes = [];
            for await (var node of nodes) {
                var xNode = await this.populateNodeDetails(node);
                xNodes.push(xNode);
            }
            return xNodes;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    public getNodeById = async (
        nodeId: string
    ): Promise<CAssessmentQuestionNode | CAssessmentListNode | CAssessmentMessageNode> => {
        try {
            const node = await AssessmentNode.findByPk(nodeId);
            return await this.populateNodeDetails(node);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public deleteNode = async (nodeId: string): Promise<boolean> => {
        try {

            var node = await AssessmentNode.findByPk(nodeId);
            if (!node) {
                throw new ApiError(404, `Node not found!`);
            }

            //Check if this is the root node,...
            var parentNodeId = node.ParentNodeId;
            var parentNode = await AssessmentNode.findByPk(parentNodeId);
            if (!parentNodeId || !parentNode) {
                throw new ApiError(400, `Cannot delete root node of the assessment template!`);
            }

            const count = await AssessmentNode.destroy({
                where : {
                    id : nodeId
                }
            });
            var result = count === 1;

            if (parentNode.NodeType === AssessmentNodeType.NodeList) {
                var siblings = await AssessmentNode.findAll({
                    where : {
                        parentNodeId : parentNodeId
                    }
                });
                //Sort in ascending order by sequence
                siblings = siblings.sort((a, b) => {
                    return a.Sequence - b.Sequence;
                });

                var sequence = 1;
                for await (var sibling of siblings) {
                    sibling.Sequence = sequence;
                    sequence++;
                    await sibling.save();
                }
            }

            return result;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    public getTemplateChildrenNodes = async (templateId: uuid)
        : Promise<(CAssessmentQuestionNode | CAssessmentListNode | CAssessmentMessageNode)[]> => {
        try {
            const nodes = await AssessmentNode.findAll({
                where : {
                    TemplateId : templateId
                }
            });
            return nodes.map((x) => AssessmentHelperMapper.toNodeDto(x, null, null, null));
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    public getQuestionNodeOptions = async (nodeType: AssessmentNodeType, nodeId: uuid)
        : Promise<CAssessmentQueryOption[]> => {

        if (nodeType === AssessmentNodeType.Question) {
            const options = await AssessmentQueryOption.findAll({
                where : {
                    NodeId : nodeId,
                },
            });

            var dtos = options.map((x) => AssessmentHelperMapper.toOptionDto(x));

            //Sort in ascending order by sequence
            dtos = dtos.sort((a, b) => {
                return a.Sequence - b.Sequence;
            });

            return dtos;
        }
        return [];
    };

    public getQuestionNodePaths = async (
        nodeType: AssessmentNodeType,
        nodeId: uuid
    ): Promise<CAssessmentNodePath[]> => {
        if (nodeType === AssessmentNodeType.Question) {
            var paths = await AssessmentNodePath.findAll({
                where : {
                    ParentNodeId : nodeId,
                },
            });
            var pathDtos: CAssessmentNodePath[] = [];
            for await (var path of paths) {
                const conditionId = path.ConditionId;
                const pathId = path.id;
                const condition = await this.getPathCondition(conditionId, nodeId, pathId);
                var pathDto = AssessmentHelperMapper.toPathDto(path);
                pathDto['Condition'] = condition;
                pathDtos.push(pathDto);
            }
            return pathDtos;
        }
        return [];
    };

    public getNodeListChildren = async (nodeId: uuid): Promise<CAssessmentNode[]> => {
        try {
            const node = await AssessmentNode.findByPk(nodeId);
            if (node.NodeType !== AssessmentNodeType.NodeList) {
                return [];
            }
            var children = await AssessmentNode.findAll({
                where : {
                    ParentNodeId : nodeId,
                },
            });
            var childrenDtos: CAssessmentNode[] = [];
            for await (var child of children) {
                var childDto = await this.populateNodeDetails(child);
                childrenDtos.push(childDto);
            }
            //Sort in ascending order by sequence
            childrenDtos = childrenDtos.sort((a, b) => {
                return a.Sequence - b.Sequence;
            });
            return childrenDtos;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public getPathCondition = async (
        conditionId: string,
        nodeId: string,
        pathId: string
    ): Promise<CAssessmentPathCondition> => {
        var condition = await AssessmentPathCondition.findByPk(conditionId);
        if (condition == null) {
            return null;
        }
        if (condition.IsCompositeCondition === true) {
            const children = await AssessmentPathCondition.findAll({
                where : {
                    NodeId            : nodeId,
                    PathId            : pathId,
                    ParentConditionId : conditionId,
                },
            });
            var childrenDtos: CAssessmentPathCondition[] = [];
            for await (var child of children) {
                var childDto = await this.getPathCondition(child.id, nodeId, pathId);
                childrenDtos.push(childDto);
            }
            var conditionDto = AssessmentHelperMapper.toConditionDto(condition);
            conditionDto['Children'] = childrenDtos;
            return conditionDto;
        } else {
            return AssessmentHelperMapper.toConditionDto(condition);
        }
    };

    public getQueryResponse = async (assessmentId: uuid, nodeId: uuid): Promise<CAssessmentQueryResponse> => {
        try {
            var response = await AssessmentQueryResponse.findOne({
                where : {
                    AssessmentId : assessmentId,
                    NodeId       : nodeId,
                },
            });
            return AssessmentHelperMapper.toQueryResponseDto(response);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public getUserResponses = async (assessmentId: uuid): Promise<CAssessmentQueryResponse[]> => {
        try {
            var results = await AssessmentQueryResponse.findAll({
                where : {
                    AssessmentId : assessmentId
                },
                include : [
                    {
                        model    : AssessmentNode,
                        required : true,
                        as       : 'Node'
                    }
                ]
            });
            var responses = results.map(x => AssessmentHelperMapper.toQueryResponseDto(x));
            responses = responses.sort((a, b) => {
                return a.Sequence - b.Sequence;
            });
            return responses;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public createQueryResponse = async (
        answer:
            | SingleChoiceQueryAnswer
            | MultipleChoiceQueryAnswer
            | MessageAnswer
            | TextQueryAnswer
            | IntegerQueryAnswer
            | FloatQueryAnswer
            | BooleanQueryAnswer
            | FileQueryAnswer
            | BiometricQueryAnswer
    ): Promise<CAssessmentQueryResponse> => {
        try {
            const model = this.generateQueryAnswerModel(answer);
            var response = await AssessmentQueryResponse.create(model);
            return AssessmentHelperMapper.toQueryResponseDto(response);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public getChildrenConditions = async (conditionId: uuid): Promise<CAssessmentPathCondition[]> => {
        try {
            var conditions = await AssessmentPathCondition.findAll({
                where : {
                    ParentConditionId : conditionId
                }
            });
            return conditions.map(x => {
                return AssessmentHelperMapper.toConditionDto(x);
            });
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public createNode = async(
        templateId: uuid,
        parentNodeId: uuid,
        nodeObj: CAssessmentNode): Promise<CAssessmentNode> => {

        try {

            const sequence = await this.calculateNodeSequence(parentNodeId);

            if (!nodeObj.Title) {
                nodeObj.Title = nodeObj.NodeType;
            }

            const nodeEntity = {
                DisplayCode                 : nodeObj.DisplayCode ?? this.getNodeDisplayCode(nodeObj.NodeType),
                TemplateId                  : templateId,
                ParentNodeId                : parentNodeId,
                NodeType                    : nodeObj.NodeType,
                ProviderGivenId             : nodeObj.ProviderGivenId,
                ProviderGivenCode           : nodeObj.ProviderGivenCode,
                Title                       : nodeObj.Title,
                Description                 : nodeObj.Description,
                Sequence                    : nodeObj.Sequence ?? sequence,
                Score                       : nodeObj.Score,
                ServeListNodeChildrenAtOnce : nodeObj.ServeListNodeChildrenAtOnce,
                QueryResponseType           : QueryResponseType.None
            };

            var thisNode = await AssessmentNode.create(nodeEntity);

            if (nodeObj.NodeType === AssessmentNodeType.Message) {
                const messageNode = nodeObj as CAssessmentMessageNode;
                thisNode.Message = messageNode.Message;
                thisNode.QueryResponseType = QueryResponseType.Ok;
                thisNode.Acknowledged = false;
                await thisNode.save();
            }
            else if (nodeObj.NodeType === AssessmentNodeType.Question) {

                const questionNode = nodeObj as CAssessmentQuestionNode;
                thisNode.QueryResponseType = questionNode.QueryResponseType;
                await thisNode.save();

                if (questionNode.Options && questionNode.Options.length > 0) {
                    //Create question answer options...
                    const options: CAssessmentQueryOption[] = questionNode.Options;

                    for await (var option of options) {
                        const optEntity = {
                            DisplayCode       : option.DisplayCode,
                            ProviderGivenCode : option.ProviderGivenCode,
                            NodeId            : thisNode.id,
                            Text              : option.Text,
                            ImageUrl          : option.ImageUrl,
                            Sequence          : option.Sequence,
                        };
                        const queryOption = await AssessmentQueryOption.create(optEntity);
                        Logger.instance().log(`QueryOption - ${queryOption.DisplayCode}`);
                    }
                }
            }

            return await this.populateNodeDetails(thisNode);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public updateNode = async (nodeId: uuid, updates: any)
        : Promise<CAssessmentNode | CAssessmentQuestionNode | CAssessmentListNode | CAssessmentMessageNode> => {

        try {

            var thisNode = await AssessmentNode.findByPk(nodeId);

            if (Helper.hasProperty(updates, 'ProviderGivenId')) {
                thisNode.ProviderGivenId = updates['ProviderGivenId'];
            }
            if (Helper.hasProperty(updates, 'ProviderGivenCode')) {
                thisNode.ProviderGivenCode = updates['ProviderGivenCode'];
            }
            if (Helper.hasProperty(updates, 'Title')) {
                thisNode.Title = updates['Title'];
            }
            if (Helper.hasProperty(updates, 'Description')) {
                thisNode.Description = updates['Description'];
            }
            if (Helper.hasProperty(updates, 'Sequence')) {
                thisNode.Sequence = updates['Sequence'];
            }
            if (Helper.hasProperty(updates, 'Score')) {
                thisNode.Score = updates['Score'];
            }
            if (Helper.hasProperty(updates, 'QueryResponseType')) {
                thisNode.QueryResponseType = updates['QueryResponseType'];
            }

            thisNode = await thisNode.save();
            return await this.populateNodeDetails(thisNode);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    //#endregion

    //#region Privates

    calculateNodeSequence = async (parentNodeId: uuid): Promise<number> => {
        if (!parentNodeId) {
            return 0;
        }
        var childrenCount = await AssessmentNode.count( {
            where : {
                ParentNodeId : parentNodeId
            }
        });
        return childrenCount + 1;
    };

    private async populateNodeDetails(node: AssessmentNode)
        : Promise<CAssessmentQuestionNode | CAssessmentListNode | CAssessmentMessageNode> {

        if (node == null) {
            return null;
        }
        const nodeId: uuid = node.id;
        const options = await this.getQuestionNodeOptions(node.NodeType as AssessmentNodeType, nodeId);
        const paths = await this.getQuestionNodePaths(node.NodeType as AssessmentNodeType, nodeId);
        const children = await this.getNodeListChildren(nodeId);
        return AssessmentHelperMapper.toNodeDto(node, children, paths, options);
    }

    private async updateQuestionNode(
        sTemplate: CAssessmentTemplate,
        questionNode: CAssessmentQuestionNode,
        thisNode: AssessmentNode,
        templateId: string
    ) {
        if (questionNode.Options && questionNode.Options.length > 0) {

            //Create question answer options...
            const options: CAssessmentQueryOption[] = questionNode.Options;

            for await (var option of options) {
                const optEntity = {
                    DisplayCode       : option.DisplayCode,
                    ProviderGivenCode : option.ProviderGivenCode,
                    NodeId            : thisNode.id,
                    Text              : option.Text,
                    ImageUrl          : option.ImageUrl,
                    Sequence          : option.Sequence,
                };
                const queryOption = await AssessmentQueryOption.create(optEntity);
                Logger.instance().log(`QueryOption - ${queryOption.DisplayCode}`);
            }
        }

        if (questionNode.Paths && questionNode.Paths.length > 0) {

            //Create paths conditions
            const paths: CAssessmentNodePath[] = questionNode.Paths;

            for await (var sPath of paths) {
                const pathEntity = {
                    DisplayCode         : sPath.DisplayCode,
                    ParentNodeId        : thisNode.id,
                    NextNodeDisplayCode : sPath.NextNodeDisplayCode,
                    IsExitPath          : sPath.IsExitPath
                };

                var path = await AssessmentNodePath.create(pathEntity);
                Logger.instance().log(`QueryOption - ${path.DisplayCode}`);

                if (!sPath.IsExitPath) {

                    //Create condition for the path
                    const condition = await this.createNewPathCondition(sPath.Condition, thisNode.id, path.id, null);
                    path.ConditionId = condition.id;

                    //Create the next node
                    const sNextNode =
                        CAssessmentTemplate.getNodeByDisplayCode(sTemplate.Nodes, sPath.NextNodeDisplayCode);
                    if (sNextNode) {
                        var nextNode = await this.createNewNode(sTemplate, templateId, thisNode.id, sNextNode);
                        if (nextNode) {
                            path.NextNodeId = nextNode.id;
                            // path.NextNodeDisplayCode = sPath.NextNodeDisplayCode;
                            await path.save();
                        }
                    }
                }
            }
        }
    }

    private async createNewNode(
        templateObj: CAssessmentTemplate,
        templateId: uuid,
        parentNodeId: uuid,
        nodeObj: CAssessmentNode
    ): Promise<AssessmentNode> {

        try {
            const existingNode = await AssessmentNode.findOne({
                where : {
                    DisplayCode : nodeObj.DisplayCode,
                },
            });
            if (existingNode) {
                return existingNode;
            }

            if (!nodeObj.Title) {
                nodeObj.Title = nodeObj.NodeType;
            }

            const nodeEntity = {
                DisplayCode                 : nodeObj.DisplayCode ?? this.getNodeDisplayCode(nodeObj.NodeType),
                TemplateId                  : templateId,
                ParentNodeId                : parentNodeId,
                NodeType                    : nodeObj.NodeType,
                ProviderGivenId             : nodeObj.ProviderGivenId,
                ProviderGivenCode           : nodeObj.ProviderGivenCode,
                Title                       : nodeObj.Title,
                Description                 : nodeObj.Description,
                Sequence                    : nodeObj.Sequence,
                Score                       : nodeObj.Score,
                QueryResponseType           : QueryResponseType.None,
                ServeListNodeChildrenAtOnce : false
            };

            if (nodeObj.ChildrenNodeDisplayCodes !== undefined) {
                for await (var childDisplayCode of nodeObj.ChildrenNodeDisplayCodes) {
                    if (childDisplayCode.startsWith('QNode#') && !nodeObj.DisplayCode.startsWith('RNode#')
                    && templateObj.ServeListNodeChildrenAtOnce === true) {
                        nodeEntity.ServeListNodeChildrenAtOnce = true;
                    }
                }
            }
            var thisNode = await AssessmentNode.create(nodeEntity);
            const currentNodeId = thisNode.id;

            if (thisNode.DisplayCode.startsWith('RNode#')) {
                var template = await AssessmentTemplate.findByPk(templateId);
                if (template !== null) {
                    template.RootNodeId = thisNode.id;
                    await template.save();
                }
            }

            if (nodeObj.NodeType === AssessmentNodeType.NodeList) {
                var listNode: CAssessmentListNode = nodeObj as CAssessmentListNode;
                var childrenDisplayCodes = listNode.ChildrenNodeDisplayCodes;
                for await (var childDisplayCode of childrenDisplayCodes) {
                    const child = CAssessmentTemplate.getNodeByDisplayCode(templateObj.Nodes, childDisplayCode);
                    if (child) {
                        var childNode = await this.createNewNode(templateObj, templateId, currentNodeId, child);
                        if (childNode) {
                            Logger.instance().log(childNode.DisplayCode);
                        }
                    }
                }
            } else if (nodeObj.NodeType === AssessmentNodeType.Message) {
                const messageNode = nodeObj as CAssessmentMessageNode;
                thisNode.Message = messageNode.Message;
                thisNode.QueryResponseType = QueryResponseType.Ok;
                thisNode.Acknowledged = false;
                await thisNode.save();
            } else {
                const questionNode = nodeObj as CAssessmentQuestionNode;
                thisNode.QueryResponseType = questionNode.QueryResponseType;
                await thisNode.save();
                await this.updateQuestionNode(templateObj, questionNode, thisNode, templateId);
            }
            return thisNode;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    private getOperandValueString(operand, dataType: ConditionOperandDataType): string {
        if (!operand) {
            return null;
        }
        if (
            dataType === ConditionOperandDataType.Text ||
            dataType === ConditionOperandDataType.Float ||
            dataType === ConditionOperandDataType.Integer
        ) {
            return operand.toString();
        }
        if (dataType === ConditionOperandDataType.Array) {
            return JSON.stringify(operand);
        }
        if (dataType === ConditionOperandDataType.Boolean) {
            if (operand === true) {
                return 'true';
            }
            return 'false';
        }
        return null;
    }

    private async createNewPathCondition(
        sCondition: CAssessmentPathCondition,
        currentNodeId: string,
        pathId: string,
        parentConditionId: any
    ) {
        const firstOperandValue = sCondition.FirstOperand ? this.getOperandValueString(
            sCondition.FirstOperand.Value,
            sCondition.FirstOperand.DataType
        ) : null;

        const secondOperandValue = sCondition.SecondOperand ? this.getOperandValueString(
            sCondition.SecondOperand.Value,
            sCondition.SecondOperand.DataType
        ) : null;

        const thirdOperandValue = sCondition.ThirdOperand ? this.getOperandValueString(
            sCondition.ThirdOperand.Value,
            sCondition.ThirdOperand.DataType
        ) : null;

        const dt = ConditionOperandDataType.Text;

        var conditionEntity = {
            NodeId                : currentNodeId,
            PathId                : pathId,
            DisplayCode           : sCondition.DisplayCode,
            IsCompositeCondition  : sCondition.IsCompositeCondition,
            CompositionType       : sCondition.CompositionType,
            ParentConditionId     : parentConditionId,
            OperatorType          : sCondition.OperatorType,
            FirstOperandName      : sCondition.FirstOperand ? sCondition.FirstOperand.Name : null,
            FirstOperandValue     : firstOperandValue,
            FirstOperandDataType  : sCondition.FirstOperand ? sCondition.FirstOperand.DataType : dt,
            SecondOperandName     : sCondition.SecondOperand ? sCondition.SecondOperand.Name : null,
            SecondOperandValue    : secondOperandValue,
            SecondOperandDataType : sCondition.SecondOperand ? sCondition.SecondOperand.DataType : dt,
            ThirdOperandName      : sCondition.ThirdOperand ? sCondition.ThirdOperand.Name : null,
            ThirdOperandValue     : thirdOperandValue,
            ThirdOperandDataType  : sCondition.ThirdOperand ? sCondition.ThirdOperand.DataType : dt,
        };

        const condition = await AssessmentPathCondition.create(conditionEntity);

        for await (var childCondition of sCondition.Children) {
            var child = await this.createNewPathCondition(childCondition, currentNodeId, pathId, condition.id);
            Logger.instance().log(`Operator type: ${child.OperatorType}`);
            Logger.instance().log(`Composition type: ${child.CompositionType}`);
        }
        return condition;
    }

    private generateQueryAnswerModel = (answer:
        SingleChoiceQueryAnswer |
        MultipleChoiceQueryAnswer |
        MessageAnswer |
        TextQueryAnswer |
        DateQueryAnswer |
        IntegerQueryAnswer |
        FloatQueryAnswer |
        BooleanQueryAnswer |
        FileQueryAnswer |
        BiometricQueryAnswer) => {

        if (answer.ResponseType === QueryResponseType.SingleChoiceSelection) {
            const a = answer as SingleChoiceQueryAnswer;
            return {
                AssessmentId : a.AssessmentId,
                NodeId       : a.NodeId,
                Sequence     : a.QuestionSequence,
                Type         : a.ResponseType,
                IntegerValue : a.ChosenSequence,
                Additional   : JSON.stringify(a.ChosenOption),
            };
        }
        if (answer.ResponseType === QueryResponseType.MultiChoiceSelection) {
            const a = answer as MultipleChoiceQueryAnswer;
            return {
                AssessmentId : a.AssessmentId,
                NodeId       : a.NodeId,
                Sequence     : a.QuestionSequence,
                Type         : a.ResponseType,
                TextValue    : JSON.stringify(a.ChosenSequences),
                Additional   : JSON.stringify(a.ChosenOptions),
            };
        }
        if (answer.ResponseType === QueryResponseType.Ok) {
            const a = answer as MessageAnswer;
            return {
                AssessmentId : a.AssessmentId,
                NodeId       : a.NodeId,
                Sequence     : a.QuestionSequence,
                Type         : a.ResponseType,
                BooleanValue : a.Achnowledged,
            };
        }
        if (answer.ResponseType === QueryResponseType.Text) {
            const a = answer as TextQueryAnswer;
            return {
                AssessmentId : a.AssessmentId,
                NodeId       : a.NodeId,
                Sequence     : a.QuestionSequence,
                Type         : a.ResponseType,
                TextValue    : a.Text,
            };
        }
        if (answer.ResponseType === QueryResponseType.Boolean) {
            const a = answer as BooleanQueryAnswer;
            return {
                AssessmentId : a.AssessmentId,
                NodeId       : a.NodeId,
                Sequence     : a.QuestionSequence,
                Type         : a.ResponseType,
                BooleanValue : a.Value,
            };
        }
        if (answer.ResponseType === QueryResponseType.Date ||
            answer.ResponseType === QueryResponseType.DateTime) {
            const a = answer as DateQueryAnswer;
            return {
                AssessmentId : a.AssessmentId,
                NodeId       : a.NodeId,
                Sequence     : a.QuestionSequence,
                Type         : a.ResponseType,
                DateValue    : a.Date,
            };
        }
        if (answer.ResponseType === QueryResponseType.Integer) {
            const a = answer as IntegerQueryAnswer;
            return {
                AssessmentId : a.AssessmentId,
                NodeId       : a.NodeId,
                Sequence     : a.QuestionSequence,
                Type         : a.ResponseType,
                IntegerValue : a.Value,
            };
        }
        if (answer.ResponseType === QueryResponseType.Float) {
            const a = answer as FloatQueryAnswer;
            return {
                AssessmentId : a.AssessmentId,
                NodeId       : a.NodeId,
                Sequence     : a.QuestionSequence,
                Type         : a.ResponseType,
                FloatValue   : a.Value,
            };
        }
        if (answer.ResponseType === QueryResponseType.Biometrics) {
            const a = answer as BiometricQueryAnswer;
            return {
                AssessmentId : a.AssessmentId,
                NodeId       : a.NodeId,
                Sequence     : a.QuestionSequence,
                Type         : a.ResponseType,
                TextValue    : JSON.stringify(a.Values),
            };
        }
        if (answer.ResponseType === QueryResponseType.File) {
            const a = answer as FileQueryAnswer;
            return {
                AssessmentId : a.AssessmentId,
                NodeId       : a.NodeId,
                Sequence     : a.QuestionSequence,
                Type         : a.ResponseType,
                TextValue    : a.Field,
                Url          : a.Url,
                ResourceId   : a.ResourceId
            };
        }
        return null;
    };

    private getNodeDisplayCode = (nodeType: AssessmentNodeType): string => {

        if (nodeType === AssessmentNodeType.Message) {
            return Helper.generateDisplayCode('MNode');
        }
        else if (nodeType === AssessmentNodeType.Question) {
            return Helper.generateDisplayCode('QNode');
        }
        else {
            return Helper.generateDisplayCode('LNode');
        }
    };

    //#endregion

}
