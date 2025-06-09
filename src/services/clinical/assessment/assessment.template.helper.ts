import { injectable } from "tsyringe";
import { ApiError } from "../../../common/api.error";
import { Helper } from "../../../common/helper";
import { AssessmentNodeType, CAssessmentPathCondition, CAssessmentQueryOption, CAssessmentQuestionNode, CAssessmentTemplate } from "../../../domain.types/clinical/assessment/assessment.types";
@injectable()
export class AssessmentTemplateHelper {

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
    
}
