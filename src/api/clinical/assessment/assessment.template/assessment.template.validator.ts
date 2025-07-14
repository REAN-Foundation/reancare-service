import express from 'express';
import { AssessmentNodeType, CAssessmentListNode, CAssessmentMessageNode, CAssessmentNode, CAssessmentNodePath, CAssessmentPathCondition, CAssessmentQueryOption, CAssessmentQuestionNode, CScoringCondition } from '../../../../domain.types/clinical/assessment/assessment.types';
import { AssessmentTemplateDomainModel } from '../../../../domain.types/clinical/assessment/assessment.template.domain.model';
import { AssessmentTemplateSearchFilters } from '../../../../domain.types/clinical/assessment/assessment.template.search.types';
import { BaseValidator, Where } from '../../../base.validator';
import { Helper } from '../../../../common/helper';
import { AssessmentNodeSearchFilters } from '../../../../domain.types/clinical/assessment/assessment.node.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class AssessmentTemplateValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): AssessmentTemplateDomainModel => {
        const model: AssessmentTemplateDomainModel = {
            Type                        : request.body.Type ?? null,
            Title                       : request.body.Title ?? null,
            Description                 : request.body.Description ?? null,
            DisplayCode                 : request.body.DisplayCode ?? null,
            ScoringApplicable           : request.body.ScoringApplicable ?? false,
            ProviderAssessmentCode      : request.body.ProviderAssessmentCode ?? null,
            Provider                    : request.body.Provider ?? null,
            ServeListNodeChildrenAtOnce : request.body.ServeListNodeChildrenAtOnce ?? null,
            TotalNumberOfQuestions      : request.body.TotalNumberOfQuestions ?? null,
            TenantId                    : request.body.TenantId ?? request.currentUser.TenantId,
            Tags                        : request.body.Tags ?? [],
        };

        return model;
    };

    create = async (request: express.Request): Promise<AssessmentTemplateDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<AssessmentTemplateSearchFilters> => {
        await this.validateString(request, 'title', Where.Query, false, false);
        await this.validateString(request, 'type', Where.Query, false, false, true);
        await this.validateString(request, 'displayCode', Where.Query, false, false, true);
        await this.validateString(request, 'tags', Where.Query, false, false);
        await this.validateBaseSearchFilters(request);
        this.validateRequest(request);
        return this.getFilter(request);
    };

    private getFilter(request): AssessmentTemplateSearchFilters {
        var filters: AssessmentTemplateSearchFilters = {
            Title       : request.query.title ?? null,
            Type        : request.query.type ?? null,
            DisplayCode : request.query.displayCode ?? null,
            Tags        : request.query.tags ?? null,
        };

        return this.updateBaseSearchFilters(request, filters);
    }

    update = async (request: express.Request): Promise<AssessmentTemplateDomainModel> => {
        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');

        return domainModel;
    };

    private async validateCreateBody(request) {
        await this.validateString(request, 'Type', Where.Body, true, false);
        await this.validateString(request, 'Title', Where.Body, true, false);
        await this.validateString(request, 'Description', Where.Body, false, true);
        await this.validateBoolean(request, 'ScoringApplicable', Where.Body, false, true);
        await this.validateString(request, 'ProviderAssessmentCode', Where.Body, false, true);
        await this.validateBoolean(request, 'ServeListNodeChildrenAtOnce', Where.Body, false, true);
        await this.validateString(request, 'DisplayCode', Where.Body, false, false);
        await this.validateInt(request, 'TotalNumberOfQuestions', Where.Body, false, false);
        await this.validateUuid(request, 'TenantId', Where.Body, false, true);
        await this.validateArray(request, 'Tags', Where.Body, false, true);
        this.validateRequest(request);
    }

    private async validateUpdateBody(request) {
        await this.validateString(request, 'Type', Where.Body, false, false);
        await this.validateString(request, 'Title', Where.Body, false, false);
        await this.validateString(request, 'Description', Where.Body, false, true);
        await this.validateString(request, 'Provider', Where.Body, false, true);
        await this.validateBoolean(request, 'ScoringApplicable', Where.Body, false, true);
        await this.validateString(request, 'ProviderAssessmentCode', Where.Body, false, true);
        await this.validateBoolean(request, 'ServeListNodeChildrenAtOnce', Where.Body, false, true);
        await this.validateInt(request, 'TotalNumberOfQuestions', Where.Body, false, false);
        await this.validateArray(request, 'Tags', Where.Body, false, false);
        this.validateRequest(request);
    }

    importFromJson = async (request: express.Request): Promise<AssessmentTemplateDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    addNode = async (
        request: express.Request
    ): Promise<CAssessmentNode | CAssessmentListNode | CAssessmentQuestionNode | CAssessmentMessageNode> => {
        var templateId = await this.getParamUuid(request, 'id');
        await this.validateString(request, 'ParentNodeId', Where.Body, false, true);
        await this.validateString(request, 'NodeType', Where.Body, true, false);
        await this.validateString(request, 'Title', Where.Body, true, false);
        await this.validateString(request, 'Description', Where.Body, false, true);
        await this.validateString(request, 'QueryResponseType', Where.Body, false, false);
        await this.validateArray(request, 'Options', Where.Body, false, false);
        await this.validateDecimal(request, 'Score', Where.Body, false, false);
        await this.validateAny(request, 'CorrectAnswer', Where.Body, false, false);
        await this.validateObject(request, 'RawData', Where.Body, false, false);
        await this.validateArray(request, 'Tags', Where.Body, false, true);
        await this.validateString(request, 'FieldIdentifier', Where.Body, false, true);
        await this.validateString(request, 'FieldIdentifierUnit', Where.Body, false, true);
        
        this.validateRequest(request);

        if (request.body.NodeType === AssessmentNodeType.Question) {
            var questionNode: CAssessmentQuestionNode = {
                ParentNodeId        : request.body.ParentNodeId,
                NodeType            : AssessmentNodeType.Question,
                DisplayCode         : request.body.DisplayCode ?? Helper.generateDisplayCode('QNode'),
                QueryResponseType   : request.body.QueryResponseType,
                Required            : request.body.Required ?? true,
                ProviderGivenId     : request.body.ProviderGivenId ?? null,
                ProviderGivenCode   : request.body.ProviderGivenCode ?? null,
                Title               : request.body.Title,
                Description         : request.body.Description ?? null,
                TemplateId          : templateId,
                Score               : request.body.Score ?? 0,
                CorrectAnswer       : request.body.CorrectAnswer ? JSON.stringify(request.body.CorrectAnswer) : null,
                Options             : [],
                RawData             : request.body.RawData ? JSON.stringify(request.body.RawData)            : null,
                Tags                : request.body.Tags ?? [],
                FieldIdentifier     : request.body.FieldIdentifier ?? null,
                FieldIdentifierUnit : request.body.FieldIdentifierUnit ?? null,
            };
            if (request.body.Options && request.body.Options.length > 0) {
                var options: CAssessmentQueryOption[] = [];
                for (var o of request.body.Options) {
                    var option: CAssessmentQueryOption = {
                        DisplayCode       : questionNode.DisplayCode + ':Option#' + o.Sequence.toString(),
                        Text              : o.Text,
                        ProviderGivenCode : o.ProviderGivenCode ?? null,
                        Sequence          : o.Sequence,
                    };
                    options.push(option);
                }
                questionNode.Options = options;
            }
            return questionNode;
        } else if (request.body.NodeType === AssessmentNodeType.NodeList) {
            var listNode: CAssessmentListNode = {
                ParentNodeId                : request.body.ParentNodeId,
                NodeType                    : AssessmentNodeType.NodeList,
                DisplayCode                 : Helper.generateDisplayCode('LNode'),
                Required                    : request.body.Required ?? true,
                ProviderGivenId             : request.body.ProviderGivenId ?? null,
                ProviderGivenCode           : request.body.ProviderGivenCode ?? null,
                Title                       : request.body.Title,
                Description                 : request.body.Description ?? null,
                TemplateId                  : templateId,
                Score                       : request.body.Score ?? 0,
                ChildrenNodeDisplayCodes    : [],
                ChildrenNodeIds             : [],
                ServeListNodeChildrenAtOnce : request.body.ServeListNodeChildrenAtOnce,
                Tags                        : request.body.Tags ?? [],
            };
            return listNode;
        } else {
            var messageNode: CAssessmentMessageNode = {
                ParentNodeId      : request.body.ParentNodeId,
                NodeType          : AssessmentNodeType.Message,
                Required          : request.body.Required ?? true,
                ProviderGivenId   : request.body.ProviderGivenId ?? null,
                ProviderGivenCode : request.body.ProviderGivenCode ?? null,
                Title             : request.body.Title,
                Description       : request.body.Description ?? null,
                TemplateId        : templateId,
                Score             : request.body.Score ?? 0,
                Message           : request.body.Message,
                Acknowledged      : false,
                RawData           : request.body.RawData ? JSON.stringify(request.body.RawData) : null,
                Tags              : request.body.Tags ?? [],
            };
            return messageNode;
        }
    };

    updateNode = async (
        request: express.Request
    ): Promise<CAssessmentNode | CAssessmentListNode | CAssessmentQuestionNode | CAssessmentMessageNode> => {
        await this.validateString(request, 'Title', Where.Body, false, false);
        await this.validateString(request, 'ProviderGivenCode', Where.Body, false, false);
        await this.validateString(request, 'ProviderGivenId', Where.Body, false, false);
        await this.validateString(request, 'Description', Where.Body, false, true);
        await this.validateString(request, 'QueryResponseType', Where.Body, false, false);
        await this.validateDecimal(request, 'Score', Where.Body, false, false);
        await this.validateDecimal(request, 'Sequence', Where.Body, false, false);
        await this.validateAny(request, 'CorrectAnswer', Where.Body, false, false);
        await this.validateObject(request, 'RawData', Where.Body, false, false);
        await this.validateArray(request, 'Tags', Where.Body, false, false);
        await this.validateArray(request, 'Options', Where.Body, false, false);
        await this.validateString(request, 'FieldIdentifier', Where.Body, false, true);
        await this.validateString(request, 'FieldIdentifierUnit', Where.Body, false, true);

        this.validateRequest(request);
        return request.body;
    };

    addScoringCondition = async (request: express.Request): Promise<CScoringCondition> => {
        await this.validateUuid(request, 'NodeId', Where.Body, false, false);
        await this.validateDecimal(request, 'ResolutionScore', Where.Body, false, true);
        await this.validateBoolean(request, 'IsCompositeCondition', Where.Body, false, false);
        await this.validateString(request, 'CompositionType', Where.Body, false, true);
        await this.validateUuid(request, 'ParentConditionId', Where.Body, false, false);
        await this.validateString(request, 'OperatorType', Where.Body, false, false);

        await this.validateObject(request, 'FirstOperand', Where.Body, false, true);
        await this.validateObject(request, 'SecondOperand', Where.Body, false, true);
        await this.validateObject(request, 'ThirdOperand', Where.Body, false, true);

        this.validateRequest(request);

        var condition: CScoringCondition = {
            TemplateId           : request.params.id,
            NodeId               : request.body.NodeId ?? null,
            ResolutionScore      : request.body.ResolutionScore ?? null,
            IsCompositeCondition : request.body.IsCompositeCondition ?? false,
            CompositionType      : request.body.CompositionType ?? null,
            ParentConditionId    : request.body.ParentConditionId ?? null,
            OperatorType         : request.body.OperatorType ?? null,
            FirstOperand         : request.body.FirstOperand,
            SecondOperand        : request.body.SecondOperand,
            ThirdOperand         : request.body.ThirdOperand,
        };
        return condition;
    };

    updateScoringCondition = async (request: express.Request): Promise<CScoringCondition> => {
        await this.validateUuid(request, 'NodeId', Where.Body, false, false);
        await this.validateDecimal(request, 'ResolutionScore', Where.Body, false, true);
        await this.validateBoolean(request, 'IsCompositeCondition', Where.Body, false, false);
        await this.validateString(request, 'CompositionType', Where.Body, false, true);
        await this.validateUuid(request, 'ParentConditionId', Where.Body, false, false);
        await this.validateString(request, 'OperatorType', Where.Body, false, false);
        await this.validateObject(request, 'FirstOperand', Where.Body, false, true);
        await this.validateObject(request, 'SecondOperand', Where.Body, false, true);
        await this.validateObject(request, 'ThirdOperand', Where.Body, false, true);

        this.validateRequest(request);

        return request.body;
    };

    searchNodes = async (request: express.Request): Promise<AssessmentNodeSearchFilters> => {
        await this.validateString(request, 'title', Where.Query, false, false);
        await this.validateString(request, 'nodeType', Where.Query, false, false, true);
        await this.validateString(request, 'templateId', Where.Query, false, false, true);
        await this.validateString(request, 'tags', Where.Query, false, false);
        await this.validateBaseSearchFilters(request);
        this.validateRequest(request);
        return this.getNodeFilter(request);
    };

    private getNodeFilter(request): AssessmentNodeSearchFilters {
        var filters: AssessmentNodeSearchFilters = {
            Title      : request.query.title ?? null,
            NodeType   : request.query.nodeType ?? null,
            TemplateId : request.query.templateId ?? null,
            Tags       : request.query.tags ?? null,

        };

        return this.updateBaseSearchFilters(request, filters);
    }

    addPath = async (request: express.Request): Promise<CAssessmentNodePath> => {
        await this.validateString(request, 'DisplayCode', Where.Body, false, false);
        await this.validateUuid(request, 'NextNodeId', Where.Body, false, true);
        await this.validateUuid(request, 'ConditionId', Where.Body, false, false);
        await this.validateBoolean(request, 'IsExitPath', Where.Body, false, false);
        await this.validateString(request, 'MessageBeforeQuestion', Where.Body, false, true);

        this.validateRequest(request);

        var path: CAssessmentNodePath = {
            DisplayCode           : request.body.DisplayCode ?? null,
            NextNodeId            : request.body.NextNodeId ?? null,
            ConditionId           : request.body.ConditionId ?? null,
            IsExitPath            : request.body.IsExitPath ?? false,
            MessageBeforeQuestion : request.body.MessageBeforeQuestion ?? null,
        };
        return path;
    };

    addPathCondition = async (request: express.Request): Promise<CAssessmentPathCondition> => {
        await this.validateBoolean(request, 'IsCompositeCondition', Where.Body, false, false);
        await this.validateString(request, 'CompositionType', Where.Body, false, true);
        await this.validateUuid(request, 'ParentConditionId', Where.Body, false, true);
        await this.validateString(request, 'OperatorType', Where.Body, false, false);
        await this.validateObject(request, 'FirstOperand', Where.Body, false, true);
        await this.validateObject(request, 'SecondOperand', Where.Body, false, true);
        await this.validateObject(request, 'ThirdOperand', Where.Body, false, true);

        this.validateRequest(request);

        var condition: CAssessmentPathCondition = {
            PathId               : request.params.pathId,
            NodeId               : request.params.nodeId,
            ParentConditionId    : request.body.ParentConditionId ?? null,
            IsCompositeCondition : request.body.IsCompositeCondition ?? false,
            CompositionType      : request.body.CompositionType ?? null,
            OperatorType         : request.body.OperatorType ?? null,
            FirstOperand         : request.body.FirstOperand,
            SecondOperand        : request.body.SecondOperand,
            ThirdOperand         : request.body.ThirdOperand,
            Children             : [],
        };
        return condition;
    };

    updatePath = async (request: express.Request): Promise<CAssessmentNodePath> => {
        await this.validateString(request, 'DisplayCode', Where.Body, false, false);
        await this.validateUuid(request, 'NextNodeId', Where.Body, false, true);
        await this.validateUuid(request, 'ConditionId', Where.Body, false, false);
        await this.validateBoolean(request, 'IsExitPath', Where.Body, false, false);
        await this.validateString(request, 'MessageBeforeQuestion', Where.Body, false, true);

        this.validateRequest(request);

        var path: CAssessmentNodePath = {
            DisplayCode           : request.body.DisplayCode ?? null,
            NextNodeId            : request.body.NextNodeId ?? null,
            ConditionId           : request.body.ConditionId ?? null,
            IsExitPath            : request.body.IsExitPath ?? false,
            MessageBeforeQuestion : request.body.MessageBeforeQuestion ?? null,
        };

        return path;
    };

    updatePathCondition = async (request: express.Request): Promise<CAssessmentPathCondition> => {
        await this.validateBoolean(request, 'IsCompositeCondition', Where.Body, false, false);
        await this.validateString(request, 'CompositionType', Where.Body, false, true);
        await this.validateUuid(request, 'ParentConditionId', Where.Body, false, true);
        await this.validateString(request, 'OperatorType', Where.Body, false, false);
        await this.validateObject(request, 'FirstOperand', Where.Body, false, true);
        await this.validateObject(request, 'SecondOperand', Where.Body, false, true);
        await this.validateObject(request, 'ThirdOperand', Where.Body, false, true);

        this.validateRequest(request);

        var condition: CAssessmentPathCondition = {
            IsCompositeCondition : request.body.IsCompositeCondition ?? false,
            CompositionType      : request.body.CompositionType ?? null,
            ParentConditionId    : request.body.ParentConditionId ?? null,
            OperatorType         : request.body.OperatorType ?? null,
            FirstOperand         : request.body.FirstOperand ?? null,
            SecondOperand        : request.body.SecondOperand ?? null,
            ThirdOperand         : request.body.ThirdOperand ?? null,
            Children             : [],
        };
        return condition;
    };

    addOption = async (request: express.Request): Promise<CAssessmentQueryOption> => {
        await this.validateString(request, 'DisplayCode', Where.Body, false, false);
        await this.validateString(request, 'ProviderGivenCode', Where.Body, false, true);
        await this.validateUuid(request, 'NodeId', Where.Body, false, false);
        await this.validateString(request, 'Text', Where.Body, false, false);
        await this.validateInt(request, 'Sequence', Where.Body, false, true);

        this.validateRequest(request);

        var path: CAssessmentQueryOption = {
            DisplayCode       : request.body.DisplayCode ?? null,
            ProviderGivenCode : request.body.ProviderGivenCode ?? null,
            NodeId            : request.body.NodeId,
            Text              : request.body.Text,
            Sequence          : request.body.Sequence,
        };
        return path;
    };

    updateOption = async (request: express.Request): Promise<CAssessmentQueryOption> => {
        await this.validateString(request, 'DisplayCode', Where.Body, false, false);
        await this.validateString(request, 'ProviderGivenCode', Where.Body, false, true);
        await this.validateUuid(request, 'NodeId', Where.Body, false, false);
        await this.validateString(request, 'Text', Where.Body, false, false);
        await this.validateInt(request, 'Sequence', Where.Body, false, true);

        this.validateRequest(request);

        return request.body;
    };

}
