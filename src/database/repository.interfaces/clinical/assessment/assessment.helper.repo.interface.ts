import {
    AssessmentNodeType,
    SAssessmentNode,
    SAssessmentNodePath,
    SAssessmentPathCondition,
    SAssessmentQueryOption,
    SAssessmentQueryResponse,
    SAssessmentTemplate,
} from '../../../../domain.types/clinical/assessment/assessment.types';
import { AssessmentTemplateDto } from '../../../../domain.types/clinical/assessment/assessment.template.dto';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import {
    BiometricQueryAnswer,
    FloatQueryAnswer,
    IntegerQueryAnswer,
    MessageAnswer,
    MultipleChoiceQueryAnswer,
    SingleChoiceQueryAnswer,
    TextQueryAnswer,
} from '../../../../domain.types/clinical/assessment/assessment.answer.dto';

export interface IAssessmentHelperRepo {
    getChildrenConditions(id: string): SAssessmentPathCondition[] | PromiseLike<SAssessmentPathCondition[]>;
    
    getNodeListChildren(nodeId: string): Promise<SAssessmentNode[]>;

    addTemplate(template: SAssessmentTemplate): Promise<AssessmentTemplateDto>;

    getNodeById(nodeId: uuid): Promise<SAssessmentNode>;

    getQueryResponse(assessmentId: string, id: string): Promise<SAssessmentQueryResponse>;

    getQuestionNodeOptions(nodeType: AssessmentNodeType, nodeId: uuid): Promise<SAssessmentQueryOption[]>;

    getQuestionNodePaths(nodeType: AssessmentNodeType, nodeId: uuid): Promise<SAssessmentNodePath[]>;

    getPathCondition(conditionId: string, nodeId: string, pathId: string): Promise<SAssessmentPathCondition>;

    createQueryResponse(answer: | SingleChoiceQueryAnswer
        | MultipleChoiceQueryAnswer
        | MessageAnswer
        | TextQueryAnswer
        | IntegerQueryAnswer
        | FloatQueryAnswer
        | BiometricQueryAnswer): Promise<SAssessmentQueryResponse>;

}
