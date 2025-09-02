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
    SkipQueryAnswer,
} from '../../../../domain.types/clinical/assessment/assessment.types';
import { AssessmentTemplateDto } from '../../../../domain.types/clinical/assessment/assessment.template.dto';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { AssessmentNodeSearchFilters } from '../../../../domain.types/clinical/assessment/assessment.node.search.types';
import { AssessmentNodeSearchResults } from '../../../../domain.types/clinical/assessment/assessment.node.search.types';
import { AssessmentDto } from '../../../../domain.types/clinical/assessment/assessment.dto';

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

    createQueryResponse(answer: | SingleChoiceQueryAnswer
        | MultipleChoiceQueryAnswer
        | MessageAnswer
        | TextQueryAnswer
        | DateQueryAnswer
        | IntegerQueryAnswer
        | FloatQueryAnswer
        | BooleanQueryAnswer
        | FileQueryAnswer
        | BiometricQueryAnswer
        | SkipQueryAnswer
    ): Promise<CAssessmentQueryResponse>;
     
    getTemplateChildrenNodes(templateId: uuid)
        : Promise<(CAssessmentQuestionNode | CAssessmentListNode | CAssessmentMessageNode)[]>;

    addRootNode(templateId: uuid): Promise<AssessmentTemplateDto>;

    updateNode(nodeId: uuid, updates: any)
        : Promise<CAssessmentNode | CAssessmentQuestionNode | CAssessmentListNode | CAssessmentMessageNode>;

    addScoringCondition(model: CScoringCondition): Promise<CScoringCondition>;

    getScoringCondition(conditionId: uuid): Promise<CScoringCondition>;

    updateScoringCondition(conditionId: uuid, updates: any): Promise<CScoringCondition>;

    deleteScoringCondition(conditionId: uuid): Promise<boolean>;

    searchNodes(filters: AssessmentNodeSearchFilters): Promise<AssessmentNodeSearchResults>;

    addPath(pathId: uuid, path: CAssessmentNodePath): Promise<CAssessmentNodePath>;

    updatePath(pathId: uuid, updates: any): Promise<CAssessmentNodePath>;

    getPath(pathId: uuid): Promise<CAssessmentNodePath>;

    deletePath(pathId: uuid): Promise<boolean>;

    addPathCondition(pathId: uuid, condition: CAssessmentPathCondition): Promise<CAssessmentPathCondition>;

    updatePathCondition(conditionId: uuid, updates: CAssessmentPathCondition): Promise<CAssessmentPathCondition>;

    getPathCondition(conditionId: uuid, nodeId: uuid, pathId: uuid): Promise<CAssessmentPathCondition>;

    deletePathCondition(conditionId: uuid): Promise<boolean>;

    getPathConditionForPath(pathId: uuid): Promise<CAssessmentPathCondition>;

    getNodePaths(nodeId: uuid): Promise<CAssessmentNodePath[]>;

    setNextNodeToPath(parentNodeId: uuid, pathId: uuid, nextNodeId: uuid): Promise<CAssessmentNodePath>;

    addOption(optionId: uuid, option: CAssessmentQueryOption): Promise<CAssessmentQueryOption>;

    updateOption(optionId: uuid, updates: any): Promise<CAssessmentQueryOption>;

    getOption(optionId: uuid): Promise<CAssessmentQueryOption>;

    deleteOption(optionId: uuid): Promise<boolean>;

}
