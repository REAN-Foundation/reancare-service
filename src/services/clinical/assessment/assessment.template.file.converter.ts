import { ApiError } from '../../../common/api.error';
import { Logger } from '../../../common/logger';
import {
    AssessmentNodeType,
    CAssessmentListNode,
    CAssessmentMessageNode,
    CAssessmentNode,
    CAssessmentNodePath,
    CAssessmentPathCondition,
    CAssessmentQueryOption,
    CAssessmentQuestionNode,
    CAssessmentTemplate,
    ConditionCompositionType,
    ConditionOperand,
    ConditionOperandDataType,
    ConditionOperatorType } from '../../../domain.types/clinical/assessment/assessment.types';

///////////////////////////////////////////////////////////////////////

export class AssessmentTemplateFileConverter {

    //#region Publics

    public static convertToJson = async (templateObj: CAssessmentTemplate): Promise<any> => {
        try {

            var tmpl = {
                DisplayCode            : templateObj.DisplayCode,
                Version                : templateObj.Version,
                Type                   : templateObj.Type,
                Title                  : templateObj.Title,
                Description            : templateObj.Description,
                Provider               : templateObj.Provider,
                ProviderAssessmentCode : templateObj.ProviderAssessmentCode,
                RootNodeDisplayCode    : templateObj.RootNodeDisplayCode,
                Nodes                  : []

            };

            for await (var nodeObj of templateObj.Nodes) {
                const node = await AssessmentTemplateFileConverter.nodeToJson(nodeObj);
                tmpl.Nodes.push(node);
            }

            return tmpl;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public static convertFromJson = async (templateObj: any): Promise<CAssessmentTemplate> => {
        try {

            var tmpl: CAssessmentTemplate = new CAssessmentTemplate();
            tmpl.DisplayCode            = templateObj.DisplayCode;
            tmpl.Version                = templateObj.Version;
            tmpl.Type                   = templateObj.Type;
            tmpl.Title                  = templateObj.Title;
            tmpl.Description            = templateObj.Description;
            tmpl.Provider               = templateObj.Provider;
            tmpl.ProviderAssessmentCode = templateObj.ProviderAssessmentCode;
            tmpl.RootNodeDisplayCode    = templateObj.RootNodeDisplayCode;
            tmpl.Nodes                  = [];

            for await (var nodeObj of templateObj.Nodes) {
                const node = await AssessmentTemplateFileConverter.nodeFromJson(nodeObj);
                tmpl.Nodes.push(node);
            }

            return tmpl;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    //#endregion

    //#region Privates

    private static nodeToJson(nodeObj: CAssessmentNode) {

        var node = {
            DisplayCode       : nodeObj.DisplayCode,
            NodeType          : nodeObj.NodeType,
            ProviderGivenId   : nodeObj.ProviderGivenId,
            ProviderGivenCode : nodeObj.ProviderGivenCode,
            Title             : nodeObj.Title,
            Description       : nodeObj.Description,
            Sequence          : nodeObj.Sequence,
            Score             : nodeObj.Score,
        };

        if (nodeObj.NodeType === AssessmentNodeType.NodeList) {
            var listNode: CAssessmentListNode = nodeObj as CAssessmentListNode;
            node['Children'] = listNode.ChildrenNodeDisplayCodes;
        }
        else if (nodeObj.NodeType === AssessmentNodeType.Message) {
            const messageNode = nodeObj as CAssessmentMessageNode;
            node['Message'] = messageNode.Message;
        }
        else {
            //thisNode.NodeType === AssessmentNodeType.Question
            const questionNode = nodeObj as CAssessmentQuestionNode;
            node['QueryResponseType'] = questionNode.QueryResponseType;

            //Add options
            if (questionNode.Options.length > 0) {
                const optionObjects: CAssessmentQueryOption[] = questionNode.Options;
                var options = [];
                for (var optionObj of optionObjects) {
                    const option = {
                        DisplayCode       : optionObj.DisplayCode,
                        ProviderGivenCode : optionObj.ProviderGivenCode,
                        Text              : optionObj.Text,
                        ImageUrl          : optionObj.ImageUrl,
                        Sequence          : optionObj.Sequence,
                    };
                    options.push(option);
                }
                node['Options'] = options;
            }

            //Add paths
            const pathObjects: CAssessmentNodePath[] = questionNode.Paths;

            if (pathObjects.length > 0) {
                var paths = [];
                for (var pathObj of pathObjects) {
                    const path = {
                        DisplayCode           : pathObj.DisplayCode,
                        ParentNodeDisplayCode : nodeObj.DisplayCode,
                        NextNodeDisplayCode   : pathObj.NextNodeDisplayCode,
                        Condition             : AssessmentTemplateFileConverter.conditionToJson(pathObj.Condition)
                    };
                    paths.push(path);
                }
                node['Paths'] = paths;
            }
        }

        return node;
    }

    private static conditionToJson(conditionObj: CAssessmentPathCondition): any {

        var condition = {
            DisplayCode          : conditionObj.DisplayCode,
            IsCompositeCondition : conditionObj.IsCompositeCondition,
        };

        if (conditionObj.IsCompositeCondition) {
            condition['CompositionType'] = conditionObj.CompositionType;
            var children = [];
            for (var childObj of conditionObj.Children) {
                var child = AssessmentTemplateFileConverter.conditionToJson(childObj);
                children.push(child);
            }
            condition['Children'] = children;
        }
        else {
            condition['OperatorType'] = conditionObj.OperatorType;
            if (conditionObj.FirstOperand) {
                var operand = {
                    DataType : conditionObj.FirstOperand.DataType,
                    Name     : conditionObj.FirstOperand.Name,
                    Value    : conditionObj.FirstOperand.Value
                };
                condition['FirstOperand'] = operand;
            }
            if (conditionObj.SecondOperand) {
                var operand = {
                    DataType : conditionObj.SecondOperand.DataType,
                    Name     : conditionObj.SecondOperand.Name,
                    Value    : conditionObj.SecondOperand.Value
                };
                condition['SecondOperand'] = operand;
            }
            if (conditionObj.ThirdOperand) {
                var operand = {
                    DataType : conditionObj.ThirdOperand.DataType,
                    Name     : conditionObj.ThirdOperand.Name,
                    Value    : conditionObj.ThirdOperand.Value
                };
                condition['ThirdOperand'] = operand;
            }
        }
        return condition;
    }

    private static nodeFromJson(nodeObj: any): CAssessmentNode {

        if (nodeObj.NodeType === AssessmentNodeType.NodeList) {

            var listNode: CAssessmentListNode = new CAssessmentListNode();

            listNode.DisplayCode       = nodeObj.DisplayCode;
            listNode.NodeType          = nodeObj.NodeType;
            listNode.ProviderGivenId   = nodeObj.ProviderGivenId;
            listNode.ProviderGivenCode = nodeObj.ProviderGivenCode;
            listNode.Title             = nodeObj.Title;
            listNode.Description       = nodeObj.Description;
            listNode.Sequence          = nodeObj.Sequence;
            listNode.Score             = nodeObj.Score;
            listNode.ChildrenNodeDisplayCodes = nodeObj.ChildrenNodeDisplayCodes;

            return listNode;
        }
        else if (nodeObj.NodeType === AssessmentNodeType.Message) {

            var messageNode: CAssessmentMessageNode = new CAssessmentMessageNode();
            messageNode.Message = nodeObj.Message;

            return messageNode;
        }
        else {

            var questionNode: CAssessmentQuestionNode = new CAssessmentQuestionNode();
            questionNode.QueryResponseType = nodeObj.QueryResponseType;

            //Add options

            if (nodeObj.Options.length > 0) {
                var options: CAssessmentQueryOption[] = [];
                for (var optionObj of nodeObj.Options) {
                    var option = new CAssessmentQueryOption();
                    option.DisplayCode       = optionObj.DisplayCode;
                    option.ProviderGivenCode = optionObj.ProviderGivenCode;
                    option.Text              = optionObj.Text;
                    option.ImageUrl          = optionObj.ImageUrl;
                    option.Sequence          = optionObj.Sequence;
                    options.push(option);
                }
                questionNode.Options = options;
            }

            //Add paths

            if (nodeObj.Paths.length > 0) {
                var paths: CAssessmentNodePath[] = [];
                for (var pathObj of nodeObj.Paths) {
                    var path = new CAssessmentNodePath();
                    path.DisplayCode           = pathObj.DisplayCode;
                    path.ParentNodeDisplayCode = nodeObj.DisplayCode;
                    path.NextNodeDisplayCode   = pathObj.NextNodeDisplayCode;
                    path.Condition             = AssessmentTemplateFileConverter.conditionFromJson(pathObj.Condition);
                    paths.push(path);
                }
                questionNode.Paths = paths;
            }
            return questionNode;
        }
    }

    private static conditionFromJson(conditionObj: any) : CAssessmentPathCondition {

        var condition: CAssessmentPathCondition = new CAssessmentPathCondition();

        condition.DisplayCode          = conditionObj.DisplayCode;
        condition.IsCompositeCondition = conditionObj.IsCompositeCondition;

        if (conditionObj.IsCompositeCondition) {
            condition.CompositionType = conditionObj.CompositionType as ConditionCompositionType;
            var children: CAssessmentPathCondition[] = [];
            for (var childObj of conditionObj.Children) {
                var child = AssessmentTemplateFileConverter.conditionFromJson(childObj);
                children.push(child);
            }
            condition.Children = children;
        }
        else {
            condition.OperatorType = conditionObj.OperatorType as ConditionOperatorType;
            if (conditionObj.FirstOperand) {
                condition.FirstOperand = new ConditionOperand(
                    conditionObj.FirstOperand.DataType as ConditionOperandDataType,
                    conditionObj.FirstOperand.Name,
                    conditionObj.FirstOperand.Value);
            }
            if (conditionObj.SecondOperand) {
                condition.SecondOperand = new ConditionOperand(
                    conditionObj.SecondOperand.DataType as ConditionOperandDataType,
                    conditionObj.SecondOperand.Name,
                    conditionObj.SecondOperand.Value);
            }
            if (conditionObj.ThirdOperand) {
                condition.ThirdOperand = new ConditionOperand(
                    conditionObj.ThirdOperand.DataType as ConditionOperandDataType,
                    conditionObj.ThirdOperand.Name,
                    conditionObj.ThirdOperand.Value);
            }
        }
        return condition;
    }

    //#endregion

}
