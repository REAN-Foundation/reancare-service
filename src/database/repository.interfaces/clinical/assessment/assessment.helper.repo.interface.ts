import {
    AssessmentNodeType,
    CAssessmentNode,
    CAssessmentNodePath,
    CAssessmentPathCondition,
    CAssessmentQueryOption,
    CAssessmentQueryResponse,
    CAssessmentTemplate,
    BiometricQueryAnswer,
    FloatQueryAnswer,
    IntegerQueryAnswer,
    MessageAnswer,
    MultipleChoiceQueryAnswer,
    SingleChoiceQueryAnswer,
    TextQueryAnswer,
    CAssessmentQuestionNode,
    CAssessmentListNode,
    CAssessmentMessageNode,
    FileQueryAnswer,
    BooleanQueryAnswer,
    DateQueryAnswer,
    CScoringCondition,
} from '../../../../domain.types/clinical/assessment/assessment.types';
import { AssessmentTemplateDto } from '../../../../domain.types/clinical/assessment/assessment.template.dto';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { AssessmentNodeSearchFilters } from '../../../../domain.types/clinical/assessment/assessment.node.search.types';
import { AssessmentNodeSearchResults } from '../../../../domain.types/clinical/assessment/assessment.node.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface IAssessmentHelperRepo {

    getChildrenConditions(id: string): CAssessmentPathCondition[] | PromiseLike<CAssessmentPathCondition[]>;

    getNodeListChildren(nodeId: string): Promise<CAssessmentNode[]>;

    addTemplate(template: CAssessmentTemplate): Promise<AssessmentTemplateDto>;

    readTemplateAsObj(templateId: uuid): Promise<CAssessmentTemplate>;

    getNodeById(nodeId: uuid): Promise<CAssessmentQuestionNode | CAssessmentListNode | CAssessmentMessageNode>;

    createNode(
        templateId: uuid,
        parentNodeId: uuid,
        nodeObj: CAssessmentNode
    ): Promise<CAssessmentNode>;

    deleteNode(nodeId: string): Promise<boolean>;

    getQueryResponse(assessmentId: uuid, nodeId: uuid): Promise<CAssessmentQueryResponse>;

    getUserResponses(assessmentId: uuid): Promise<CAssessmentQueryResponse[]>;

    getQuestionNodeOptions(nodeType: AssessmentNodeType, nodeId: uuid): Promise<CAssessmentQueryOption[]>;

    getQuestionNodePaths(nodeType: AssessmentNodeType, nodeId: uuid): Promise<CAssessmentNodePath[]>;

    getPathCondition(conditionId: string, nodeId: string, pathId: string): Promise<CAssessmentPathCondition>;

    createQueryResponse(answer: | SingleChoiceQueryAnswer
        | MultipleChoiceQueryAnswer
        | MessageAnswer
        | TextQueryAnswer
        | DateQueryAnswer
        | IntegerQueryAnswer
        | FloatQueryAnswer
        | BooleanQueryAnswer
        | FileQueryAnswer
        | BiometricQueryAnswer): Promise<CAssessmentQueryResponse>;

    getTemplateChildrenNodes(templateId: uuid)
        : Promise<(CAssessmentQuestionNode | CAssessmentListNode | CAssessmentMessageNode)[]>;

    addRootNode(templateId: uuid): Promise<AssessmentTemplateDto>;

    updateNode(nodeId: uuid, updates: any)
        : Promise<CAssessmentNode | CAssessmentQuestionNode | CAssessmentListNode | CAssessmentMessageNode>;

    addScoringCondition(model: CScoringCondition): Promise<CScoringCondition>;

    getScoringCondition(conditionId: string): Promise<CScoringCondition>;

    updateScoringCondition(conditionId: string, updates: any): Promise<CScoringCondition>;

    deleteScoringCondition(conditionId: string): Promise<boolean>;

    searchNode(filters: AssessmentNodeSearchFilters): Promise<AssessmentNodeSearchResults>;

}
