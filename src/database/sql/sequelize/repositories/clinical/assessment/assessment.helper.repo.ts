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
    CScoringCondition,
    ConditionOperatorType,
    ConditionCompositionType,
    SkipQueryAnswer,
} from '../../../../../../domain.types/clinical/assessment/assessment.types';
import AssessmentTemplate from '../../../models/clinical/assessment/assessment.template.model';
import AssessmentNode from '../../../models/clinical/assessment/assessment.node.model';
import { uuid } from '../../../../../../domain.types/miscellaneous/system.types';
import AssessmentQueryOption from '../../../models/clinical/assessment/assessment.query.option.model';
import AssessmentNodePath from '../../../models/clinical/assessment/assessment.node.path.model';
import AssessmentPathCondition from '../../../models/clinical/assessment/assessment.path.condition.model';
import { AssessmentHelperMapper } from '../../../mappers/clinical/assessment/assessment.helper.mapper';
import AssessmentQueryResponse from '../../../models/clinical/assessment/assessment.query.response.model';
import { Helper } from '../../../../../../common/helper';
import ScoringCondition from '../../../models/clinical/assessment/scoring.condition.model';
import { AssessmentNodeSearchResults } from '../../../../../../domain.types/clinical/assessment/assessment.node.search.types';
import { AssessmentNodeSearchFilters } from '../../../../../../domain.types/clinical/assessment/assessment.node.search.types';
import { Op } from 'sequelize';

///////////////////////////////////////////////////////////////////////

export class AssessmentHelperRepo implements IAssessmentHelperRepo {

    //#region Publics

    public addTemplate = async (t: CAssessmentTemplate): Promise<AssessmentTemplateDto> => {
        try {
            const search = {
                where : {
                    Provider               : t.Provider,
                    ProviderAssessmentCode : t.ProviderAssessmentCode,
                }
            };

            if (t.TenantId) {
                search.where['TenantId'] = t.TenantId;
            }
            
            const existing = await AssessmentTemplate.findOne(search);
            if (existing) {
                return AssessmentTemplateMapper.toDto(existing);
            }

            const entity = {
                DisplayCode                 : t.DisplayCode ?? null,
                Type                        : t.Type ?? null,
                Title                       : t.Title ?? t.Title,
                Description                 : t.Description ?? null,
                ProviderAssessmentCode      : t.ProviderAssessmentCode ?? null,
                Provider                    : t.Provider ?? null,
                ServeListNodeChildrenAtOnce : t.ServeListNodeChildrenAtOnce ?? false,
                TenantId                    : t.TenantId ?? null,
                Tags                        : t.Tags && t.Tags.length > 0 ? JSON.stringify(t.Tags) : null,
            };
            var template = await AssessmentTemplate.create(entity);

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
            Tags                   : template.Tags ? JSON.parse(template.Tags) : [],

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
    };

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

            await this.deleteChildNodes(nodeId);

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
    };

    private deleteChildNodes = async (parentNodeId: string): Promise<void> => {
        const childNodes = await AssessmentNode.findAll({
            where : {
                ParentNodeId : parentNodeId
            }
        });
    
        for (const childNode of childNodes) {
            await this.deleteChildNodes(childNode.id);
            await AssessmentNode.destroy({
                where : {
                    id : childNode.id
                }
            });
        }
    };

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
    };

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
            | SkipQueryAnswer
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
                QueryResponseType           : QueryResponseType.None,
                RawData                     : nodeObj.RawData ?? null,
                Tags                        : nodeObj.Tags && nodeObj.Tags.length > 0 ? JSON.stringify(nodeObj.Tags) : null,
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

                const questionNode           = nodeObj as CAssessmentQuestionNode;
                thisNode.QueryResponseType   = questionNode.QueryResponseType;
                thisNode.CorrectAnswer       = questionNode.CorrectAnswer;
                thisNode.FieldIdentifier     = questionNode.FieldIdentifier;
                thisNode.FieldIdentifierUnit = questionNode.FieldIdentifierUnit;
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
            if (Helper.hasProperty(updates, 'CorrectAnswer')) {
                thisNode.CorrectAnswer = updates['CorrectAnswer'] ? JSON.stringify(updates['CorrectAnswer']) : null;
            }
            if (Helper.hasProperty(updates, 'Score')) {
                thisNode.Score = updates['Score'];
            }
            if (Helper.hasProperty(updates, 'QueryResponseType')) {
                thisNode.QueryResponseType = updates['QueryResponseType'];
            }
            if (Helper.hasProperty(updates, 'RawData')) {
                thisNode.RawData = updates['RawData'] ? JSON.stringify(updates['RawData']) : null;
            }
            if (Helper.hasProperty(updates, 'Message')) {
                thisNode.Message = updates['Message'];
            }
            if (Helper.hasProperty(updates, 'ServeListNodeChildrenAtOnce')) {
                thisNode.ServeListNodeChildrenAtOnce = updates['ServeListNodeChildrenAtOnce'];
            }
            if (Helper.hasProperty(updates, 'Tags')) {
                thisNode.Tags = updates['Tags'] ? JSON.stringify(updates['Tags']) : null;
            }
            if (Helper.hasProperty(updates, 'FieldIdentifier')) {
                thisNode.FieldIdentifier = updates['FieldIdentifier'];
            }
            if (Helper.hasProperty(updates, 'FieldIdentifierUnit')) {
                thisNode.FieldIdentifierUnit = updates['FieldIdentifierUnit'];
            }
            thisNode = await thisNode.save();

            return await this.populateNodeDetails(thisNode);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public searchNodes = async ( filters:AssessmentNodeSearchFilters):
     Promise<AssessmentNodeSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.Title != null) {
                search.where['Title'] = { [Op.like]: '%' + filters.Title + '%' };
            }
            if (filters.NodeType != null) {
                search.where['NodeType'] = { [Op.like]: '%' + filters.NodeType + '%' };
            }
            if (filters.TemplateId != null) {
                search.where['TemplateId'] = filters.TemplateId;
            }
            if (filters.Tags != null) {
                const tags = filters.Tags.split(',').map(tag => tag.trim());
                search.where[Op.or] = tags.map(tag => ({
                    Tags : {
                        [Op.like] : `%${tag}%`,
                    },
                }));
            }
            let orderByColum = 'Title';
            if (filters.OrderBy) {
                orderByColum = filters.OrderBy;
            }
            let order = 'ASC';
            if (filters.Order === 'descending') {
                order = 'DESC';
            }
            search['order'] = [[orderByColum, order]];

            let limit = 25;
            if (filters.ItemsPerPage) {
                limit = filters.ItemsPerPage;
            }
            let offset = 0;
            let pageIndex = 0;
            if (filters.PageIndex) {
                pageIndex = filters.PageIndex < 0 ? 0 : filters.PageIndex;
                offset = pageIndex * limit;
            }
            search['limit'] = limit;
            search['offset'] = offset;

            const foundResults = await AssessmentNode.findAndCountAll(search);

            const dtos: CAssessmentNode[] = [];
            for (const doctorNote of foundResults.rows) {
                const dto = await this.populateNodeDetails(doctorNote);
                dtos.push(dto);
            }

            const searchResults = {
                TotalCount     : foundResults.count,
                RetrievedCount : dtos.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColum,
                Items          : dtos
            };
            return searchResults;

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
        const scoringCondition = await this.getScoringConditionByNodeId(nodeId);
        return AssessmentHelperMapper.toNodeDto(node, children, paths, options, scoringCondition);
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
                ServeListNodeChildrenAtOnce : false,
                RawData                     : nodeObj.RawData,
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
        BiometricQueryAnswer |
        SkipQueryAnswer
    ) => {

        //Check if the answer is a skip query
        const skipQuery = answer as SkipQueryAnswer;
        if (skipQuery && skipQuery?.Skipped === true) {
            return {
                AssessmentId : skipQuery.AssessmentId,
                NodeId       : skipQuery.NodeId,
                Sequence     : skipQuery.QuestionSequence,
                Type         : skipQuery.ResponseType,
                Skipped      : true,
            };
        }

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

    public addScoringCondition = async (model: CScoringCondition): Promise<CScoringCondition> => {

        try {

            const entity = {
                DisplayCode           : model.DisplayCode ?? Helper.generateDisplayCode('ScCondition'),
                NodeId                : model.NodeId,
                TemplateId            : model.TemplateId,
                ParentConditionId     : model.ParentConditionId,
                IsCompositeCondition  : model.IsCompositeCondition,
                CompositionType       : model.CompositionType ?? ConditionCompositionType.And,
                OperatorType          : model.OperatorType ?? ConditionOperatorType.EqualTo ,
                FirstOperandName      : model.FirstOperand?.Name ?? null,
                FirstOperandValue     : model.FirstOperand?.Value.toString() ?? null,
                FirstOperandDataType  : model.FirstOperand?.DataType ?? null ,
                SecondOperandName     : model.SecondOperand?.Name ?? null ,
                SecondOperandValue    : model.SecondOperand?.Value.toString() ?? null,
                SecondOperandDataType : model.SecondOperand?.DataType ?? null,
                ThirdOperandName      : model.ThirdOperand?.Name ?? null ,
                ThirdOperandValue     : model.ThirdOperand?.Value.toString() ?? null,
                ThirdOperandDataType  : model.ThirdOperand?.DataType ?? null,
                ResolutionScore       : model.ResolutionScore
            };

            var condition = await ScoringCondition.create(entity);
            return await AssessmentHelperMapper.toScoringConditionDto(condition);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getScoringCondition = async (conditionId: uuid): Promise<CScoringCondition> => {
        try {
            const condition = await ScoringCondition.findByPk(conditionId);
            return AssessmentHelperMapper.toScoringConditionDto(condition);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getScoringConditionByNodeId = async (nodeId: uuid): Promise<CScoringCondition> => {
        try {
            const condition = await ScoringCondition.findOne(
                {
                    where : {
                        NodeId : nodeId
                    }
                }
            );
            return AssessmentHelperMapper.toScoringConditionDto(condition);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    updateScoringCondition = async (conditionId: string, updates: any): Promise<CScoringCondition> => {
        try {

            var condition = await ScoringCondition.findByPk(conditionId);

            if (Helper.hasProperty(updates, 'TemplateId')) {
                condition.TemplateId = updates['TemplateId'];
            }
            if (Helper.hasProperty(updates, 'NodeId')) {
                condition.NodeId = updates['NodeId'];
            }
            if (Helper.hasProperty(updates, 'IsCompositeCondition')) {
                condition.IsCompositeCondition = updates['IsCompositeCondition'];
            }
            if (Helper.hasProperty(updates, 'CompositionType')) {
                condition.CompositionType = updates['CompositionType'];
            }
            if (Helper.hasProperty(updates, 'ParentConditionId')) {
                condition.ParentConditionId = updates['ParentConditionId'];
            }
            if (Helper.hasProperty(updates, 'OperatorType')) {
                condition.OperatorType = updates['OperatorType'];
            }
            if (Helper.hasProperty(updates, 'ResolutionScore')) {
                condition.ResolutionScore = updates['ResolutionScore'];
            }
            if (Helper.hasProperty(updates, 'FirstOperandName')) {
                condition.FirstOperandName = updates['FirstOperandName'];
            }
            if (Helper.hasProperty(updates, 'FirstOperandValue')) {
                condition.FirstOperandValue = updates['FirstOperandValue'];
            }
            if (Helper.hasProperty(updates, 'FirstOperandDataType')) {
                condition.FirstOperandDataType = updates['FirstOperandDataType'];
            }
            if (Helper.hasProperty(updates, 'SecondOperandName')) {
                condition.SecondOperandName = updates['SecondOperandName'];
            }
            if (Helper.hasProperty(updates, 'SecondOperandValue')) {
                condition.SecondOperandValue = updates['SecondOperandValue'];
            }
            if (Helper.hasProperty(updates, 'SecondOperandDataType')) {
                condition.SecondOperandDataType = updates['SecondOperandDataType'];
            }
            if (Helper.hasProperty(updates, 'ThirdOperandName')) {
                condition.ThirdOperandName = updates['ThirdOperandName'];
            }
            if (Helper.hasProperty(updates, 'ThirdOperandValue')) {
                condition.ThirdOperandValue = updates['ThirdOperandValue'];
            }
            if (Helper.hasProperty(updates, 'ThirdOperandDataType')) {
                condition.ThirdOperandDataType = updates['ThirdOperandDataType'];
            }
            condition = await condition.save();
            return AssessmentHelperMapper.toScoringConditionDto(condition);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    deleteScoringCondition = async (conditionId: string): Promise<boolean> => {
        try {

            var condition = await ScoringCondition.findByPk(conditionId);
            if (!condition) {
                throw new ApiError(404, `Node not found!`);
            }

            //Check if this is the root node,...
            var childrenConditions = await ScoringCondition.findAll({
                where : {
                    ParentConditionId : conditionId
                }
            });
            if (childrenConditions.length > 0) {
                var ids = childrenConditions.map(x => x.id);
                var list = ids.join(', ');
                throw new ApiError(400, `Cannot delete this parent condition. Please delete following children conditions: ${list}!`);
            }

            const count = await ScoringCondition.destroy({
                where : {
                    id : conditionId
                }
            });
            return count === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }

    };

    addPath = async (nodeId: uuid, path: CAssessmentNodePath): Promise<CAssessmentNodePath> => {
        try {
            const displayCode = path.DisplayCode ?? Helper.generateDisplayCode('Path');
            const parentNode = await AssessmentNode.findByPk(nodeId);
            const nextNode = path.NextNodeId ? await AssessmentNode.findByPk(path.NextNodeId) : null;
            const entity = {
                DisplayCode           : displayCode,
                ParentNodeId          : parentNode.id,
                NextNodeId            : nextNode ? nextNode.id         : null,
                NextNodeDisplayCode   : nextNode ? nextNode.DisplayCode : null,
                ConditionId           : null,
                IsExitPath            : path.IsExitPath,
                MessageBeforeQuestion : path.MessageBeforeQuestion,
            };
            var thisPath = await AssessmentNodePath.create(entity);
            return AssessmentHelperMapper.toPathDto(thisPath);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getPath = async (pathId: uuid): Promise<CAssessmentNodePath> => {
        try {
            var path = await AssessmentNodePath.findByPk(pathId);
            return AssessmentHelperMapper.toPathDto(path);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    updatePath = async (pathId: string, updates: any): Promise<CAssessmentNodePath> => {
        try {
            var path = await AssessmentNodePath.findByPk(pathId);
            if (Helper.hasProperty(updates, 'NextNodeId')) {
                path.NextNodeId = updates['NextNodeId'];
            }
            if (Helper.hasProperty(updates, 'IsExitPath')) {
                path.IsExitPath = updates['IsExitPath'];
            }
            if (Helper.hasProperty(updates, 'ConditionId')) {
                path.ConditionId = updates['ConditionId'];
            }
            if (Helper.hasProperty(updates, 'MessageBeforeQuestion')) {
                path.MessageBeforeQuestion = updates['MessageBeforeQuestion'];
            }
            path = await path.save();
            return AssessmentHelperMapper.toPathDto(path);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    deletePath = async (pathId: string): Promise<boolean> => {
        try {
            if (!pathId) {
                throw new ApiError(400, `Path not found!`);
            }
            var path = await AssessmentNodePath.findByPk(pathId);
            if (!path) {
                throw new ApiError(404, `Path not found!`);
            }
            if (path.ConditionId != null) {
                await this.deletePathCondition(path.ConditionId);
            }
            const count = await AssessmentNodePath.destroy({
                where : {
                    id : pathId
                }
            });
            return count === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getNodePaths = async (nodeId: string): Promise<CAssessmentNodePath[]> => {
        try {
            const paths = await AssessmentNodePath.findAll({
                where : {
                    ParentNodeId : nodeId
                }
            });
            const pathDtos = paths.map(x => AssessmentHelperMapper.toPathDto(x));
            return pathDtos;
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    setNextNodeToPath = async (parentNodeId: string, pathId: string, nextNodeId: string)
        : Promise<CAssessmentNodePath> => {
        try {
            var path = await AssessmentNodePath.findByPk(pathId);
            if (!path) {
                throw new ApiError(404, `Path not found!`);
            }
            var nextNode = await AssessmentNode.findByPk(nextNodeId);
            if (!nextNode) {
                throw new ApiError(404, `Next node not found!`);
            }
            path.NextNodeId = nextNode.id;
            path.NextNodeDisplayCode = nextNode.DisplayCode;
            await path.save();
            return AssessmentHelperMapper.toPathDto(path);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    addPathCondition = async (pathId: string, condition: CAssessmentPathCondition)
        : Promise<CAssessmentPathCondition> => {
        try {
            const path = await AssessmentNodePath.findByPk(pathId);
            if (!path) {
                throw new ApiError(404, `Path not found!`);
            }
            if (condition.DisplayCode == null || condition.DisplayCode == undefined) {
                condition.DisplayCode = Helper.generateDisplayCode('Condition');
            }
            const record = await AssessmentPathCondition.create({
                DisplayCode           : condition.DisplayCode,
                NodeId                : path.ParentNodeId,
                PathId                : path.id,
                ParentConditionId     : null,
                IsCompositeCondition  : condition.IsCompositeCondition,
                CompositionType       : condition.CompositionType ?? ConditionCompositionType.And,
                OperatorType          : condition.OperatorType,
                FirstOperandName      : condition.FirstOperand.Name,
                FirstOperandValue     : condition.FirstOperand.Value,
                FirstOperandDataType  : condition.FirstOperand.DataType,
                SecondOperandName     : condition.SecondOperand.Name,
                SecondOperandValue    : condition.SecondOperand.Value,
                SecondOperandDataType : condition.SecondOperand.DataType,
                ThirdOperandName      : condition.ThirdOperand ? condition.ThirdOperand.Name : null,
                ThirdOperandValue     : condition.ThirdOperand ? condition.ThirdOperand.Value : null,
                ThirdOperandDataType  : condition.ThirdOperand ? condition.ThirdOperand.DataType : null,
            });
            path.ConditionId = record.id;
            await path.save();
            return AssessmentHelperMapper.toConditionDto(record);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    updatePathCondition = async (conditionId: string, updates: CAssessmentPathCondition)
        : Promise<CAssessmentPathCondition> => {
        try {
            const condition = await AssessmentPathCondition.findByPk(conditionId);
            if (!condition) {
                throw new ApiError(404, `Condition not found!`);
            }
            if (updates.DisplayCode) {
                condition.DisplayCode = updates.DisplayCode;
            }
            if (updates.IsCompositeCondition) {
                condition.IsCompositeCondition = updates.IsCompositeCondition;
            }
            if (updates.CompositionType) {
                condition.CompositionType = updates.CompositionType;
            }
            if (updates.OperatorType) {
                condition.OperatorType = updates.OperatorType;
            }
            if (updates.FirstOperand) {
                condition.FirstOperandName = updates.FirstOperand.Name;
                condition.FirstOperandValue = updates.FirstOperand.Value as any;
                condition.FirstOperandDataType = updates.FirstOperand.DataType;
            }
            if (updates.SecondOperand) {
                condition.SecondOperandName = updates.SecondOperand.Name;
                condition.SecondOperandValue = updates.SecondOperand.Value as any;
                condition.SecondOperandDataType = updates.SecondOperand.DataType;
            }
            if (updates.ThirdOperand) {
                condition.ThirdOperandName = updates.ThirdOperand.Name;
                condition.ThirdOperandValue = updates.ThirdOperand.Value as any;
                condition.ThirdOperandDataType = updates.ThirdOperand.DataType;
            }
            await condition.save();
            return AssessmentHelperMapper.toConditionDto(condition);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    deletePathCondition = async (conditionId: uuid) => {
        try {
            var condition = await AssessmentPathCondition.findByPk(conditionId);
            if (condition) {
                var children = await AssessmentPathCondition.findAll({
                    where : {
                        ParentConditionId : condition.id
                    }
                });
                if (children.length > 0) {
                    var ids = children.map(x => x.id);
                    for await (var id of ids) {
                        await this.deletePathCondition(id);
                    }
                }
                await condition.destroy();
            }
            return true;
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getPathConditionForPath = async (pathId: string): Promise<CAssessmentPathCondition> => {
        try {
            const path = await AssessmentNodePath.findByPk(pathId);
            if (!path) {
                throw new ApiError(404, `Path not found!`);
            }
            if (!path.ConditionId) {
                return null;
            }
            const conditon = await this.getPathCondition(path.ConditionId, path.ParentNodeId, pathId);
            return conditon;
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    addOption = async (nodeId: uuid, option: CAssessmentQueryOption): Promise<CAssessmentQueryOption> => {
        try {
            const displayCode = option.DisplayCode ?? Helper.generateDisplayCode('Option');
            const entity = {
                DisplayCode       : displayCode,
                ProviderGivenCode : option.ProviderGivenCode,
                NodeId            : nodeId,
                Text              : option.Text,
                Sequence          : option.Sequence,
                ImageUrl          : option.ImageUrl
            
            };
      
            var thisPath = await AssessmentQueryOption.create(entity);
            return AssessmentHelperMapper.toOptionDto(thisPath);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getOption = async (optionId: uuid): Promise<CAssessmentQueryOption> => {
        try {
            var option = await AssessmentQueryOption.findByPk(optionId);
            return AssessmentHelperMapper.toOptionDto(option);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    updateOption = async (optionId: string, updates: any): Promise<CAssessmentQueryOption> => {
        try {
            var option = await AssessmentQueryOption.findByPk(optionId);
            if (Helper.hasProperty(updates, 'Text')) {
                option.Text = updates['Text'];
            }
            if (Helper.hasProperty(updates, 'Sequence')) {
                option.Sequence = updates['Sequence'];
            }
            if (Helper.hasProperty(updates, 'ImageUrl')) {
                option.ImageUrl = updates['ImageUrl'];
            }
            option = await option.save();
            return AssessmentHelperMapper.toOptionDto(option);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

   deleteOption = async (id: uuid): Promise<boolean> => {
       try {
           await AssessmentQueryOption.destroy({ where: { id: id } });
           return true;
       } catch (error) {
           Logger.instance().log(error.message);
           throw new ApiError(500, error.message);
       }
   };
    
    //#endregion

}
