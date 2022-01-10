import { Op } from 'sequelize';
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
    SAssessmentQuestionNode
} from '../../../../../../domain.types/clinical/assessment/assessment.types';
import { Helper } from '../../../../../../common/helper';
import { AssessmentTemplateDomainModel } from '../../../../../../domain.types/clinical/assessment/assessment.template.domain.model';
import AssessmentTemplate from '../../../models/clinical/assessment/assessment.template.model';
import AssessmentNode from '../../../models/clinical/assessment/assessment.node.model';
import { uuid } from '../../../../../../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////

export class AssessmentHelperRepo implements IAssessmentHelperRepo {

    addTemplate = async (t: SAssessmentTemplate): Promise<AssessmentTemplateDto> => {
        try {
            
            const templateDisplayCode = Helper.generateDisplayId('ASSMT');

            const templateModel: AssessmentTemplateDomainModel = {
                DisplayCode            : templateDisplayCode,
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
        templateId: string,
        templateDisplayCode: string,
        nodeIndex: number,
        parentNodeId: uuid,
        snode: SAssessmentNode): Promise<AssessmentNode> {

        const nodeEntity = {
            DisplayCode : templateDisplayCode + `:${nodeIndex.toString()}`,
            TemplateId  : templateId,
            ParentId    : parentNodeId,
            NodeType    : snode.NodeType,
            Title       : snode.Title,
            Description : snode.Description,
            Sequence    : snode.Sequence,
            Score       : snode.Score,
        };

        var thisNode = await AssessmentNode.create(nodeEntity);
        const currentNodeId = thisNode.id;

        if (snode.NodeType === AssessmentNodeType.NodeList) {

            var listNode: SAssessmentListNode = snode as SAssessmentListNode;

            var children = listNode.ChildrenNodes;
            for await (var child of children) {

                var childNode = await this.createNewNode(
                    templateId, templateDisplayCode, nodeIndex, currentNodeId, child);

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

            //Create question paths/options/conditions ...
        }
        return thisNode;
    }

}
