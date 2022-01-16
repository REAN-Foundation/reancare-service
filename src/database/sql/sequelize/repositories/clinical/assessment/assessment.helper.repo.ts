//import { Op } from 'sequelize';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { AssessmentTemplateDto } from '../../../../../../domain.types/clinical/assessment/assessment.template.dto';
import { IAssessmentHelperRepo } from '../../../../../repository.interfaces/clinical/assessment/assessment.helper.repo.interface';
import { AssessmentTemplateMapper } from '../../../mappers/clinical/assessment/assessment.template.mapper';
import {
    SAssessmentTemplate,
    SAssessmentNode,
    AssessmentNodeType,
    SAssessmentListNode,
    SAssessmentMessageNode,
    SAssessmentQuestionNode,
    SAssessmentQueryOption,
    SAssessmentNodePath,
    SAssessmentPathCondition
} from '../../../../../../domain.types/clinical/assessment/assessment.types';
import { Helper } from '../../../../../../common/helper';
import { AssessmentTemplateDomainModel } from '../../../../../../domain.types/clinical/assessment/assessment.template.domain.model';
import AssessmentTemplate from '../../../models/clinical/assessment/assessment.template.model';
import AssessmentNode from '../../../models/clinical/assessment/assessment.node.model';
import { uuid } from '../../../../../../domain.types/miscellaneous/system.types';
import AssessmentQueryOption from '../../../models/clinical/assessment/assessment.query.option.model';
import AssessmentNodePath from '../../../models/clinical/assessment/assessment.node.path.model';
import AssessmentPathCondition from '../../../models/clinical/assessment/assessment.path.condition.model';

///////////////////////////////////////////////////////////////////////

export class AssessmentHelperRepo implements IAssessmentHelperRepo {

    addTemplate = async (t: SAssessmentTemplate): Promise<AssessmentTemplateDto> => {
        try {

            const templateModel: AssessmentTemplateDomainModel = {
                DisplayCode            : t.DisplayCode,
                Title                  : t.Title,
                Description            : t.Description,
                Type                   : t.Type,
                Provider               : t.Provider,
                ProviderAssessmentCode : t.ProviderAssessmentCode
            };
            var template = await AssessmentTemplate.create(templateModel);

            const snode: SAssessmentNode = t.RootNode;
            var nodeIndex = 0;
            const parentNodeId: uuid = null;
            const templateId = template.id;

            const rootNode = await this.createNewNode(templateId, templateDisplayCode, nodeIndex, parentNodeId, snode);
            template.RootNodeId = rootNode.id;
            await template.save();

            const templateDto = AssessmentTemplateMapper.toDto(template);
            return templateDto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private async createNewNode(
        templateId: uuid,
        templateDisplayCode: string,
        nodeIndex: number,
        parentNodeId: uuid,
        snode: SAssessmentNode): Promise<AssessmentNode> {

        const nodeEntity = {
            DisplayCode     : templateDisplayCode + `:${nodeIndex.toString()}`,
            TemplateId      : templateId,
            ParentId        : parentNodeId,
            NodeType        : snode.NodeType,
            ProviderGivenId : snode.ProviderGivenId,
            Title           : snode.Title,
            Description     : snode.Description,
            Sequence        : snode.Sequence,
            Score           : snode.Score,
        };

        var thisNode = await AssessmentNode.create(nodeEntity);
        const currentNodeId = thisNode.id;

        if (snode.NodeType === AssessmentNodeType.NodeList) {
            var listNode: SAssessmentListNode = snode as SAssessmentListNode;
            var children = listNode.ChildrenNodeDisplayCodes;
            for await (var child of children) {
                var childNode = await this.createNewNode(
                    templateId, templateDisplayCode, child.Sequence, currentNodeId, child);
                if (childNode) {
                    Logger.instance().log(childNode.DisplayCode);
                }
            }
        }
        else if (snode.NodeType === AssessmentNodeType.Message) {
            const messageNode = snode as SAssessmentMessageNode;
            thisNode.Message = messageNode.Message;
            thisNode.Acknowledged = false;
            await thisNode.save();
        }
        else {
            //thisNode.NodeType === AssessmentNodeType.Question
            const questionNode = snode as SAssessmentQuestionNode;
            thisNode.QueryResponseType = questionNode.QueryResponseType;
            await thisNode.save();

            await this.updateQuestionNode(questionNode, thisNode, templateId, templateDisplayCode);
        }
        return thisNode;
    }

    private async updateQuestionNode(
        questionNode: SAssessmentQuestionNode,
        thisNode: AssessmentNode,
        templateId: string,
        templateDisplayCode: string) {

        //Create question answer options...
        const options: SAssessmentQueryOption[] = questionNode.Options;
        for await (var option of options) {
            const display = option.DisplayCode ? `:${option.DisplayCode}` : '';
            const displayCode = thisNode.DisplayCode + `:opt#${option.Sequence.toString()}${display}`;
            const optEntity = {
                DisplayCode : displayCode,
                NodeId      : thisNode.id,
                Text        : option.Text,
                ImageUrl    : option.ImageUrl,
                Sequence    : option.Sequence
            };
            const queryOption = await AssessmentQueryOption.create(optEntity);
            Logger.instance().log(`QueryOption - ${queryOption.DisplayCode}`);
        }

        //Create paths conditions
        const paths: SAssessmentNodePath[] = questionNode.Paths;
        var pathIndex = 0;

        for await (var sPath of paths) {

            const display = sPath.DisplayCode ? `:${sPath.DisplayCode}` : '';
            const displayCode = thisNode.DisplayCode + `:path#${pathIndex.toString()}${display}`;
            const pathEntity = {
                DisplayCode  : displayCode,
                ParentNodeId : thisNode.id,
            };

            var path = await AssessmentNodePath.create(pathEntity);
            Logger.instance().log(`QueryOption - ${path.DisplayCode}`);
            pathIndex++;

            //Create condition for the path
            const condition = await this.createNewPathCondition(sPath.Condition, thisNode.id, path.id, null);
            path.ConditionId = condition.id;

            //Create the next node
            var nextNode = await this.createNewNode(
                templateId, templateDisplayCode, pathIndex, thisNode.id, sPath.NextNode);

            path.NextNodeId = nextNode.id;

            await path.save();
        }
    }

    private async createNewPathCondition(
        sCondition: SAssessmentPathCondition, currentNodeId: string, pathId: string, parentConditionId: any) {

        var conditionEntity = {
            NodeId                : currentNodeId,
            PathId                : pathId,
            IsCompositeCondition  : sCondition.IsCompositeCondition,
            CompositionType       : sCondition.CompositionType,
            ParentConditionId     : parentConditionId,
            OperatorType          : sCondition.OperatorType,
            FirstOperandName      : sCondition.FirstOperandName,
            FirstOperandValue     : sCondition.FirstOperandValue,
            FirstOperandDataType  : sCondition.FirstOperandDataType,
            SecondOperandName     : sCondition.SecondOperandName,
            SecondOperandValue    : sCondition.SecondOperandValue,
            SecondOperandDataType : sCondition.SecondOperandDataType,
            ThirdOperandName      : sCondition.ThirdOperandName,
            ThirdOperandValue     : sCondition.ThirdOperandValue,
            ThirdOperandDataType  : sCondition.ThirdOperandDataType,
        };

        const condition = await AssessmentPathCondition.create(conditionEntity);

        for await (var childCondition of sCondition.Children) {

            const parentConditionId = condition.id;

            var child = await this.createNewPathCondition(
                childCondition, pathId, currentNodeId, parentConditionId);

            Logger.instance().log(`Operator type: ${child.OperatorType}`);
            Logger.instance().log(`Composition type: ${child.CompositionType}`);
        }
        return condition;
    }

}
