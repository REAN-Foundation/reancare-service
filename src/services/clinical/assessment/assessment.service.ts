import { Logger } from '../../../common/logger';
import { EHRAnalyticsHandler } from '../../../modules/ehr.analytics/ehr.analytics.handler';
import { inject, injectable } from 'tsyringe';
import { ApiError } from '../../../common/api.error';
import { IAssessmentHelperRepo } from '../../../database/repository.interfaces/clinical/assessment/assessment.helper.repo.interface';
import { IAssessmentRepo } from '../../../database/repository.interfaces/clinical/assessment/assessment.repo.interface';
import { IAssessmentTemplateRepo } from '../../../database/repository.interfaces/clinical/assessment/assessment.template.repo.interface';
import { AssessmentHelperMapper } from '../../../database/sql/sequelize/mappers/clinical/assessment/assessment.helper.mapper';
import { AssessmentAnswerDomainModel } from '../../../domain.types/clinical/assessment/assessment.answer.domain.model';
import { AssessmentDomainModel } from '../../../domain.types/clinical/assessment/assessment.domain.model';
import { AssessmentDto } from '../../../domain.types/clinical/assessment/assessment.dto';
import { AssessmentQueryDto, AssessmentQueryListDto } from '../../../domain.types/clinical/assessment/assessment.query.dto';
import { AssessmentQuestionResponseDto } from '../../../domain.types/clinical/assessment/assessment.question.response.dto';
import {
    AssessmentSearchFilters,
    AssessmentSearchResults
} from '../../../domain.types/clinical/assessment/assessment.search.types';
import {
    AssessmentNodeType, BiometricQueryAnswer,
    FloatQueryAnswer,
    IntegerQueryAnswer,
    MessageAnswer,
    MultipleChoiceQueryAnswer, QueryResponseType,
    CAssessmentMessageNode,
    CAssessmentNode,
    CAssessmentNodePath,
    CAssessmentQueryOption,
    CAssessmentQuestionNode,
    SingleChoiceQueryAnswer,
    TextQueryAnswer,
    DateQueryAnswer,
    FileQueryAnswer,
    BooleanQueryAnswer,
    CAssessmentListNode } from '../../../domain.types/clinical/assessment/assessment.types';
import { ProgressStatus, uuid } from '../../../domain.types/miscellaneous/system.types';
import { Loader } from '../../../startup/loader';
import { AssessmentBiometricsHelper } from './assessment.biometrics.helper';
import { ConditionProcessor } from './condition.processor';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class AssessmentService {

    _conditionProcessor: ConditionProcessor = null;

    constructor(
        @inject('IAssessmentRepo') private _assessmentRepo: IAssessmentRepo,
        @inject('IAssessmentHelperRepo') private _assessmentHelperRepo: IAssessmentHelperRepo,
        @inject('IAssessmentTemplateRepo') private _assessmentTemplateRepo: IAssessmentTemplateRepo,
    ) {
        this._conditionProcessor = Loader.container.resolve(ConditionProcessor);
    }

    public create = async (model: AssessmentDomainModel): Promise<AssessmentDto> => {
        if (model.AssessmentTemplateId == null) {
            throw new Error('Invalid template id');
        }
        const template = await this._assessmentTemplateRepo.getById(model.AssessmentTemplateId);

        var code = template.DisplayCode ? template.DisplayCode.split('#')[1] : '';
        var datestr = (new Date()).toISOString()
            .split('T')[0];

        const displayCode = 'Assessment#' + code + ':' + datestr;
        model.DisplayCode = displayCode;
        model.Description = template.Description;
        model.Provider = template.Provider;
        model.ProviderAssessmentCode = template.ProviderAssessmentCode;
        model.Title = model.Title ?? template.Title;
        model.ScoringApplicable = template.ScoringApplicable;
        model.Type = template.Type;
        model.ScheduledDateString = model.ScheduledDateString ?? new Date().toISOString()
            .split('T')[0];
        model.TotalNumberOfQuestions = template.TotalNumberOfQuestions;

        return await this._assessmentRepo.create(model);
    };

    public getById = async (id: string): Promise<AssessmentDto> => {
        var assessment = await this._assessmentRepo.getById(id);
        var responses = await this._assessmentHelperRepo.getUserResponses(id);
        assessment.UserResponses = responses;
        return assessment;
    };

    public search = async (filters: AssessmentSearchFilters): Promise<AssessmentSearchResults> => {
        return await this._assessmentRepo.search(filters);
    };

    public update = async (id: string, assessmentDomainModel: AssessmentDomainModel): Promise<AssessmentDto> => {
        return await this._assessmentRepo.update(id, assessmentDomainModel);
    };

    public delete = async (id: string): Promise<boolean> => {
        return await this._assessmentRepo.delete(id);
    };

    public startAssessment = async (id: uuid): Promise<AssessmentQueryDto | AssessmentQueryListDto> => {
        var assessment = await this._assessmentRepo.getById(id);
        if (assessment.Status === ProgressStatus.InProgress &&
            assessment.StartedAt !== null) {
            throw new Error('Assessment is already in progress.');
        }
        if (assessment.Status === ProgressStatus.Cancelled) {
            throw new Error('Assessment has been cancelled.');
        }
        if (assessment.Status === ProgressStatus.Completed) {
            throw new Error('Assessment has already been completed.');
        }
        assessment = await this._assessmentRepo.startAssessment(id);

        const template = await this._assessmentTemplateRepo.getById(assessment.AssessmentTemplateId);
        if (!template) {
            throw new Error(`Error while starting assessment. Cannot find template.`);
        }

        const rootNodeId = template.RootNodeId;
        if (!rootNodeId) {
            throw new Error(`Error while starting assessment. Cannot find template root node.`);
        }

        var nextQuestion = await this.traverse(assessment, rootNodeId);

        return nextQuestion;
    };

    public answerQuestion = async (answerModel: AssessmentAnswerDomainModel)
        : Promise<AssessmentQuestionResponseDto> => {

        const nodeId = answerModel.QuestionNodeId;
        const assessmentId = answerModel.AssessmentId;

        //Check if the this question node is from same template as assessment
        const node = (await this._assessmentHelperRepo.getNodeById(nodeId));
        if (!node) {
            throw new ApiError(404, `Question with id ${nodeId} cannot be found!`);
        }
        const assessment = await this._assessmentRepo.getById(assessmentId);
        if (!assessment) {
            throw new ApiError(404, `Assessment with id ${assessmentId} cannot be found!`);
        }
        if (node.TemplateId !== assessment.AssessmentTemplateId) {
            throw new ApiError(400, `Template associated with assessment dows not match with the question!`);
        }

        var isAnswered = await this.isAnswered(assessmentId, nodeId);
        if (isAnswered) {
            return null;
        }

        const incomingResponseType = answerModel.ResponseType;
        const nodeType = node.NodeType;

        //Convert the answer to the format which we can persist

        if (nodeType === AssessmentNodeType.Question) {
            return await this.handleAnswersToQuestion(answerModel, assessment, node, incomingResponseType);
        }
        else if (nodeType === AssessmentNodeType.Message && incomingResponseType === QueryResponseType.Ok) {
            const messageNode = node as CAssessmentMessageNode;
            return await this.handleAcknowledgement(assessment, messageNode);
        }

        return null;
    };

    public answerQuestionList = async (
        assessmentId: uuid,
        listNode: CAssessmentListNode,
        answerModels: AssessmentAnswerDomainModel[]) => {

        const assessment = await this._assessmentRepo.getById(assessmentId);
        if (!assessment) {
            throw new ApiError(404, `Assessment with id ${assessmentId} cannot be found!`);
        }
        if (listNode.TemplateId !== assessment.AssessmentTemplateId) {
            throw new ApiError(400, `Template associated with assessment dows not match with the question!`);
        }

        var isListAnswered = await this.isListAnswered(assessmentId, listNode);
        if (isListAnswered) {
            return null;
        }

        var answerResponses: AssessmentQuestionResponseDto[] = [];

        for await (var answerModel of answerModels) {
            var question = await this.getQuestionById(assessmentId, answerModel.QuestionNodeId);
            if (question == null) {
                throw new ApiError(404, 'Assessment question not found.');
            }
            var answerResponse = await this.answerQuestion(answerModel);
            answerResponses.push(answerResponse);
        }

        isListAnswered = await this.isListAnswered(assessmentId, listNode);
        if (!isListAnswered) {
            throw new ApiError(400, `Problem encountered in answering all children questions!`);
        }

        const queryListDto = await this.getQueryListDto(assessment, listNode);
        const next = await this.traverse(assessment, listNode.id);
        const response = {
            AssessmentId : assessment.id,
            Parent       : queryListDto,
            Answer       : answerResponses,
            Next         : next,
        };
        return response;
    };

    public getQuestionById = async (assessmentId: uuid, questionId: uuid): Promise<AssessmentQueryDto | string> => {
        const questionNode = await this._assessmentHelperRepo.getNodeById(questionId);
        if (
            questionNode.NodeType !== AssessmentNodeType.Question &&
            questionNode.NodeType !== AssessmentNodeType.Message
        ) {
            return `The node with id ${questionId} is not a question!`;
        }
        const assessment = await this._assessmentRepo.getById(assessmentId);
        if (questionNode.NodeType === AssessmentNodeType.Question) {
            return this.questionNodeAsQueryDto(questionNode, assessment);
        } else {
            return this.messageNodeAsQueryDto(questionNode, assessment);
        }
    };

    public getNodeById = async (nodeId: uuid):
        Promise<CAssessmentListNode | CAssessmentMessageNode | CAssessmentQuestionNode> => {
        return this._assessmentHelperRepo.getNodeById(nodeId);
    };

    public getNextQuestion = async (assessmentId: uuid): Promise<AssessmentQueryDto | AssessmentQueryListDto> => {
        const assessment = await this._assessmentRepo.getById(assessmentId);
        const currentNodeId = assessment.CurrentNodeId;
        return await this.traverse(assessment, currentNodeId);
    };

    public getAssessmentStatus = async (assessmentId: uuid): Promise<ProgressStatus> => {
        const assessment = await this._assessmentRepo.getById(assessmentId);
        return assessment.Status as ProgressStatus;
    };

    public completeAssessment = async (assessmentId: uuid): Promise<AssessmentDto> => {
        var assessment = await this._assessmentRepo.completeAssessment(assessmentId);
        var responses = await this._assessmentHelperRepo.getUserResponses(assessmentId);
        assessment.UserResponses = responses;
        return assessment;
    };

    public isAnswered = async (assessmentId: uuid, currentNodeId: uuid) => {
        const response = await this._assessmentHelperRepo.getQueryResponse(assessmentId, currentNodeId);
        return response !== null;
    };

    public isListAnswered = async (assessmentId: uuid, listNode: CAssessmentListNode) => {
        if (!listNode.ServeListNodeChildrenAtOnce) {
            throw new ApiError(400, 'This list node cannot serve its children at once!');
        }
        const childrenNodeIds = listNode.ChildrenNodeIds;
        for await (var qid of childrenNodeIds) {
            var isAnswered = await this.isAnswered(assessmentId, qid);
            if (!isAnswered) {
                return false;
            }
        }
        return true;
    };

    //#region Privates

    private async traverseUpstream(assessmentId: uuid, currentNode: CAssessmentNode): Promise<CAssessmentNode> {
        const parentNode = await this._assessmentHelperRepo.getNodeById(currentNode.ParentNodeId);
        if (parentNode === null) {
            //We have reached the root node of the assessment
            return null; //Check for this null which means the assessment is over...
        }
        if (parentNode.NodeType !== AssessmentNodeType.NodeList) {
            return await this.traverseUpstream(assessmentId, parentNode);
        }
        var siblingNodes = await this._assessmentHelperRepo.getNodeListChildren(currentNode.ParentNodeId);
        if (siblingNodes.length === 0) {
            //The parent node is either a question node or message node
            //In this case, check the siblings of its parent.
            return await this.traverseUpstream(assessmentId, parentNode);
        }
        const sibling = await this.getNextUnansweredSibling(assessmentId, currentNode, siblingNodes);
        if (sibling) {
            return sibling;
        }
        //Since we no longer can find the next sibling, retract tracing by one step, move onto the parent
        return await this.traverseUpstream(assessmentId, parentNode);
    }

    private async getNextUnansweredSibling(
        assessmentId: uuid, currentNode: CAssessmentNode, siblingNodes: CAssessmentNode[]) {

        var sequence = currentNode.Sequence;
        var sequences = siblingNodes.map(x => x.Sequence);
        var maxSequenceValue = Math.max(...sequences);
        sequence = sequence + 1;

        while (sequence <= maxSequenceValue) {
            for await (var sibling of siblingNodes) {
                if (sibling.Sequence === sequence && currentNode.id !== sibling.id) {
                    const isAnswered = await this.isAnswered(assessmentId, sibling.id);
                    if (isAnswered) {
                        break;
                    }
                    else {
                        return sibling;
                    }
                }
            }
            sequence = sequence + 1;
        }
        return null;
    }

    private async iterateListNodeChildren(assessment: AssessmentDto, currentNodeId: uuid)
        : Promise<any> {
        var childrenNodes = await this._assessmentHelperRepo.getNodeListChildren(currentNodeId);
        const currentNode = await this._assessmentHelperRepo.getNodeById(currentNodeId);

        for await (var childNode of childrenNodes) {
            if (currentNode.DisplayCode.startsWith('RNode#')) {
                const nextNode = await this.traverse(assessment, childNode.id);
                if (nextNode != null) {
                    return nextNode;
                } else {
                    continue;
                }
            }
            else {
                return await this.traverse(assessment, childNode.id);
            }
        }

        return null;
    }

    private async traverseUpstreamInChildrenNode(
        assessmentId: string, currentNode: CAssessmentNode): Promise<CAssessmentNode> {
        const parentNode = await this._assessmentHelperRepo.getNodeById(currentNode.ParentNodeId);
        if (parentNode === null) {
            //We have reached the root node of the assessment
            return null; //Check for this null which means the assessment is over...
        }
        var siblingNodes = await this._assessmentHelperRepo.getNodeListChildren(currentNode.ParentNodeId);
        if (siblingNodes.length === 0) {
            //The parent node is either a question node or message node
            //In this case, check the siblings of its parent.
            return this.traverseUpstream(assessmentId, parentNode);
        }
        const currentSequence = currentNode.Sequence;
        for await (var sibling of siblingNodes) {
            if (sibling.Sequence === currentSequence) {
                return sibling;
            }
        }
        //Since we no longer can find the next sibling, retract tracing by one step, move onto the parent
        return this.traverseUpstream(assessmentId, parentNode);
    }

    private async traverseQuestionNode(assessment: AssessmentDto, currentNode: CAssessmentNode)
        : Promise<AssessmentQueryDto | AssessmentQueryListDto> {

        var isAnswered = await this.isAnswered(assessment.id, currentNode.id);
        if (!isAnswered) {
            return await this.returnAsCurrentQuestionNode(assessment, currentNode as CAssessmentQuestionNode);
        }

        var questionNode = currentNode as CAssessmentQuestionNode;
        if (questionNode.Paths.length > 0) {
            return await this.traverseQuestionNodePaths(assessment, questionNode);
        }
        else {
            const nextSiblingNode = await this.traverseUpstream(assessment.id, currentNode);
            if (nextSiblingNode === null) {
                //Assessment has finished
                return null;
            }
            return await this.traverse(assessment, nextSiblingNode.id);
        }
    }

    private async getChosenPathForSingleChoice(
        assessmentId: uuid,
        currentQuestionNode: CAssessmentQuestionNode,
        answerModel) {

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        var { answerDto, paths, chosenOptionSequence, nodeId } =
        await this.getSingleChoiceQueryAnswer(assessmentId, currentQuestionNode, answerModel);

        return await this.getChosenPath(currentQuestionNode.id, currentQuestionNode.Paths, chosenOptionSequence);
    }

    private async getChosenPathForMultipleChoice(
        assessmentId: uuid,
        currentQuestionNode: CAssessmentQuestionNode,
        answerModel) {

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        var { answerDto, paths, chosenOptionSequences, nodeId } =
        await this.getMultipleChoiceQueryAnswer(assessmentId, currentQuestionNode, answerModel);

        return await this.getChosenPath(currentQuestionNode.id, currentQuestionNode.Paths, chosenOptionSequences);
    }

    private async traverseQuestionNodePaths(
        assessment: AssessmentDto,
        currentQuestionNode: CAssessmentQuestionNode): Promise<AssessmentQueryDto | AssessmentQueryListDto> {

        //PLEASE NOTE: Current assumption that only single choice and multi choice questions
        //will have node paths may change in future! Till then...

        const currentNodeId = currentQuestionNode.id;
        const assessmentId = assessment.id;

        //Now check if all paths have been answered
        var nextAnsweredNode = null;
        const currentNodePaths = currentQuestionNode.Paths;
        for await (var path of currentNodePaths) {
            var nextNodeId = path.NextNodeId;
            const isAnswered = await this.isAnswered(assessmentId, nextNodeId);
            if (isAnswered) {
                nextAnsweredNode = await this._assessmentHelperRepo.getNodeById(nextNodeId);
                break;
            }
        }
        if (nextAnsweredNode) {
            return await this.traverse(assessment, nextAnsweredNode.id);
        }

        //This node has been answered but it seems next node is not selected
        const { incomingResponseType, answerModel } = await this.getAnswerModelFromResponse(
            assessmentId, currentNodeId, assessment);

        if (incomingResponseType === QueryResponseType.SingleChoiceSelection ||
            incomingResponseType === QueryResponseType.MultiChoiceSelection) {

            var chosenPath = null;

            if (incomingResponseType === QueryResponseType.SingleChoiceSelection) {
                chosenPath = await this.getChosenPathForSingleChoice(assessmentId, currentQuestionNode, answerModel);
            }
            else {
                chosenPath = await this.getChosenPathForMultipleChoice(assessmentId, currentQuestionNode, answerModel);
            }

            if (chosenPath != null) {
                const nextNodeId = chosenPath.NextNodeId;
                var nextNode = await this._assessmentHelperRepo.getNodeById(nextNodeId);
                if (nextNode) {
                    var nodeType = nextNode.NodeType;

                    if (nodeType === AssessmentNodeType.Question) {
                        return await this.questionNodeAsQueryDto(nextNode, assessment);
                    }
                    else if (nodeType === AssessmentNodeType.Message) {
                        return await this.messageNodeAsQueryDto(nextNode, assessment);
                    }
                    else {
                        return await this.traverse(assessment, nextNode.id);
                    }
                }
            }
        }
        const nextSiblingNode = await this.traverseUpstream(assessment.id, currentQuestionNode);
        if (nextSiblingNode === null) {
            //Assessment has finished
            return null;
        }
        return await this.traverse(assessment, nextSiblingNode.id);
    }

    private async getAnswerModelFromResponse(assessmentId: string, currentNodeId: string, assessment: AssessmentDto) {
        const response = await this._assessmentHelperRepo.getQueryResponse(assessmentId, currentNodeId);
        const incomingResponseType = response.ResponseType;

        const answerModel: AssessmentAnswerDomainModel = {
            AssessmentId   : assessment.id,
            QuestionNodeId : currentNodeId,
            ResponseType   : incomingResponseType,
            Biometrics     : response.ObjectValue ?? null,
            BooleanValue   : response.BooleanValue ?? null,
            DateValue      : response.DateValue ?? null,
            FloatArray     : response.ArrayValue ?? null,
            FloatValue     : response.FloatValue ?? null,
            IntegerArray   : response.ArrayValue ?? null,
            IntegerValue   : response.IntegerValue ?? null,
            ObjectArray    : response.ArrayValue ?? null,
            TextValue      : response.TextValue ?? null,
            Url            : response.Url ?? null
        };
        return { incomingResponseType, answerModel };
    }

    private async traverseMessageNode(assessment: AssessmentDto, currentNode: CAssessmentNode)
        : Promise<AssessmentQueryDto | AssessmentQueryListDto> {
        var isAnswered = await this.isAnswered(assessment.id, currentNode.id);
        if (!isAnswered) {
            return await this.returnAsCurrentMessageNode(assessment, currentNode as CAssessmentMessageNode);
        } else {
            const nextSiblingNode = await this.traverseUpstream(assessment.id, currentNode);
            if (nextSiblingNode === null) {
            //Assessment has finished
                return null;
            }
            return await this.traverse(assessment, nextSiblingNode.id);
        }
    }

    // eslint-disable-next-line max-len
    private async traverse(assessment: AssessmentDto, currentNodeId: uuid): Promise<AssessmentQueryDto | AssessmentQueryListDto> {

        const currentNode = await this._assessmentHelperRepo.getNodeById(currentNodeId);
        if (!currentNode) {
            throw new Error(`Error while executing assessment. Cannot find the node!`);
        }

        if (currentNode.NodeType === AssessmentNodeType.NodeList) {
            var currentListNode = currentNode as CAssessmentListNode;
            const serveListNodeChildrenAtOnce = currentListNode.ServeListNodeChildrenAtOnce;
            if (serveListNodeChildrenAtOnce) {
                const isListAnswered = await this.isListAnswered(assessment.id, currentListNode);
                if (isListAnswered) {
                    const nextSiblingNode = await this.traverseUpstream(assessment.id, currentNode);
                    if (nextSiblingNode === null) {
                        //Assessment has finished
                        return null;
                    }
                    return await this.traverse(assessment, nextSiblingNode.id);
                }
                else {
                    return await this.returnAsCurrentListNode(assessment, currentListNode);
                }
            }
            else {
                return await this.iterateListNodeChildren(assessment, currentNodeId);
            }
        }
        else {
            if (currentNode.NodeType === AssessmentNodeType.Question) {
                return await this.traverseQuestionNode(assessment, currentNode);
            }
            else if (currentNode.NodeType === AssessmentNodeType.Message) {
                return await this.traverseMessageNode(assessment, currentNode);
            }
        }
    }

    private getListNodeChildrenQueryDtos = async (
        assessment: AssessmentDto, listNode: CAssessmentListNode): Promise<AssessmentQueryDto[]> => {
        var queryDtos: AssessmentQueryDto[] = [];
        for await (var childId of listNode.ChildrenNodeIds) {
            var child = await this.getNodeById(childId);
            if (child.NodeType === AssessmentNodeType.Question) {
                var dto = await this.questionNodeAsQueryDto(child, assessment);
                queryDtos.push(dto);
            }
            else if (child.NodeType === AssessmentNodeType.Message) {
                var dto = await this.messageNodeAsQueryDto(child, assessment);
                queryDtos.push(dto);
            }
        }
        return queryDtos;
    };

    private async returnAsCurrentMessageNode(
        assessment: AssessmentDto,
        currentNode: CAssessmentMessageNode
    ): Promise<AssessmentQueryDto> {
        //Set as current node if not already
        await this._assessmentRepo.setCurrentNode(assessment.id, currentNode.id);
        return this.messageNodeAsQueryDto(currentNode, assessment);
    }

    private async returnAsCurrentQuestionNode(
        assessment: AssessmentDto,
        currentNode: CAssessmentQuestionNode
    ): Promise<AssessmentQueryDto> {
        //Set as current node if not already
        await this._assessmentRepo.setCurrentNode(assessment.id, currentNode.id);
        return this.questionNodeAsQueryDto(currentNode, assessment);
    }

    private async returnAsCurrentListNode(
        assessment: AssessmentDto,
        currentNode: CAssessmentListNode
    ): Promise<AssessmentQueryListDto> {
        //Set as current node if not already
        await this._assessmentRepo.setCurrentNode(assessment.id, currentNode.id);
        return this.getQueryListDto(assessment, currentNode);
    }

    private async getQueryListDto(
        assessment: AssessmentDto, currentNode: CAssessmentListNode): Promise<AssessmentQueryListDto> {
        var childrenQueryDtos: AssessmentQueryDto[] = await this.getListNodeChildrenQueryDtos(assessment, currentNode);
        return this.listNodeAsQueryListDto(currentNode, assessment, childrenQueryDtos);
    }

    private async getChosenPath(
        nodeId: uuid,
        paths: CAssessmentNodePath[],
        chosenOptions: any): Promise<CAssessmentNodePath> {

        var chosenPath: CAssessmentNodePath = null;
        for await (var path of paths) {
            const pathId = path.id;
            const conditionId = path.ConditionId;
            const condition = await this._assessmentHelperRepo.getPathCondition(conditionId, nodeId, pathId);
            if (!condition) {
                continue;
            }
            const resolved = await this._conditionProcessor.processCondition(condition, chosenOptions);
            if (resolved === true) {
                chosenPath = path;
                break;
            }
        }
        return chosenPath;
    }

    private isAnyPathExitPath(paths: CAssessmentNodePath[]) {
        var path = paths.find(x => x.IsExitPath === true);
        return path ? true : false;
    }

    private async processPathConditions(
        assessment: AssessmentDto,
        nodeId: uuid,
        currentQueryDto: AssessmentQueryDto,
        paths: CAssessmentNodePath[],
        answerDto: | SingleChoiceQueryAnswer
        | MultipleChoiceQueryAnswer
        | MessageAnswer
        | TextQueryAnswer
        | IntegerQueryAnswer
        | FloatQueryAnswer
        | BiometricQueryAnswer,
        chosenOptions: any) {

        const chosenPath = await this.getChosenPath(nodeId, paths, chosenOptions);
        const exitPathFound = this.isAnyPathExitPath(paths);

        if (chosenPath !== null) {
            const nextNodeId = chosenPath.NextNodeId;
            var nextNode = await this._assessmentHelperRepo.getNodeById(nextNodeId);
            var nodeType = nextNode.NodeType;
            var next: AssessmentQueryDto = null;

            if (nodeType === AssessmentNodeType.NodeList) {
                return await this.respondToUserAnswer(assessment, nextNodeId, currentQueryDto, answerDto);
            }
            else if (nodeType === AssessmentNodeType.Question) {
                next = await this.questionNodeAsQueryDto(nextNode, assessment);
            }
            else if (nodeType === AssessmentNodeType.Message) {
                next = await this.messageNodeAsQueryDto(nextNode, assessment);
            }
            const response: AssessmentQuestionResponseDto = {
                AssessmentId : assessment.id,
                Parent       : currentQueryDto,
                Answer       : answerDto,
                Next         : next,
            };
            return response;
        }
        else if (exitPathFound) {
            //IMPORTANT: When no chosen node found and one of the path is exit path, exit the assessment
            //Please note that - Assessment will be completed right here...
            const response: AssessmentQuestionResponseDto = {
                AssessmentId : assessment.id,
                Parent       : currentQueryDto,
                Answer       : answerDto,
                Next         : null,
            };
            await this.completeAssessment(assessment.id);
            return response;
        }
        else {
            return await this.respondToUserAnswer(assessment, nodeId, currentQueryDto, answerDto);
        }
    }

    private async createQueryResponse(
        assessment: AssessmentDto,
        nodeId: string,
        answerDto: | SingleChoiceQueryAnswer
        | MultipleChoiceQueryAnswer
        | MessageAnswer
        | TextQueryAnswer
        | DateQueryAnswer
        | IntegerQueryAnswer
        | BooleanQueryAnswer
        | FloatQueryAnswer
        | FileQueryAnswer
        | BiometricQueryAnswer) {
        var existingReposne = await this._assessmentHelperRepo.getQueryResponse(assessment.id, nodeId);
        if (existingReposne == null) {
            await this._assessmentHelperRepo.createQueryResponse(answerDto);
        }
    }

    private async getSingleChoiceQueryAnswer(
        assessmentId: uuid,
        questionNode: CAssessmentQuestionNode,
        answerModel: AssessmentAnswerDomainModel
    ) {
        const { minSequenceValue, maxSequenceValue, options, paths, nodeId } = await this.getChoiceSelectionParams(
            questionNode
        );

        const chosenOptionSequence = answerModel.IntegerValue;
        if (
            !chosenOptionSequence ||
            chosenOptionSequence < minSequenceValue ||
            chosenOptionSequence > maxSequenceValue
        ) {
            throw new Error(`Invalid option index! Cannot process the condition!`);
        }

        const answer = options.find((x) => x.Sequence === chosenOptionSequence);
        const answerDto = AssessmentHelperMapper.toSingleChoiceAnswerDto(
            assessmentId,
            questionNode,
            chosenOptionSequence,
            answer
        );

        return { answerDto, paths, chosenOptionSequence, nodeId };
    }

    private async handleSingleChoiceSelectionAnswer(
        assessment: AssessmentDto,
        questionNode: CAssessmentQuestionNode,
        answerModel: AssessmentAnswerDomainModel
    ): Promise<AssessmentQuestionResponseDto> {

        const currentQueryDto = this.questionNodeAsQueryDto(questionNode, assessment);

        const { answerDto, paths, chosenOptionSequence, nodeId } =
            await this.getSingleChoiceQueryAnswer(assessment.id, questionNode, answerModel);

        await this.createQueryResponse(assessment, nodeId, answerDto);

        if (paths.length === 0) {
            //In case there are no paths...
            //This question node is a leaf node and should use traverseUp to find the next stop...
            return await this.respondToUserAnswer(assessment, nodeId, currentQueryDto, answerDto);
        }

        return await this.processPathConditions(
            assessment, nodeId, currentQueryDto, paths, answerDto, chosenOptionSequence);
    }

    private async getMultipleChoiceQueryAnswer(
        assessmentId: uuid,
        questionNode: CAssessmentQuestionNode,
        answerModel: AssessmentAnswerDomainModel
    ) {
        const { minSequenceValue, maxSequenceValue, options, paths, nodeId } = await this.getChoiceSelectionParams(
            questionNode
        );

        const chosenOptionSequences = answerModel.IntegerArray;
        const selectedOptions: CAssessmentQueryOption[] = [];
        for (var choice of chosenOptionSequences) {
            if (!choice || choice < minSequenceValue || choice > maxSequenceValue) {
                throw new Error(`Invalid option index! Cannot process the condition!`);
            }
            const answer = options.find((x) => x.Sequence === choice);
            selectedOptions.push(answer);
        }

        const answerDto = AssessmentHelperMapper.toMultiChoiceAnswerDto(
            assessmentId,
            questionNode,
            chosenOptionSequences,
            selectedOptions
        );

        return { answerDto, paths, chosenOptionSequences, nodeId };
    }

    private async handleMultipleChoiceSelectionAnswer(
        assessment: AssessmentDto,
        questionNode: CAssessmentQuestionNode,
        answerModel: AssessmentAnswerDomainModel
    ): Promise<AssessmentQuestionResponseDto> {

        const currentQueryDto = this.questionNodeAsQueryDto(questionNode, assessment);

        const { answerDto, paths, chosenOptionSequences, nodeId } =
            await this.getMultipleChoiceQueryAnswer(assessment.id, questionNode, answerModel);

        await this.createQueryResponse(assessment, nodeId, answerDto);

        if (paths.length === 0) {
            //In case there are no paths...
            //This question node is a leaf node and should use traverseUp to find the next stop...
            return await this.respondToUserAnswer(assessment, nodeId, currentQueryDto, answerDto);
        }

        return await this.processPathConditions(
            assessment, nodeId, currentQueryDto, paths, answerDto, chosenOptionSequences);
    }

    private async handleBiometricsAnswer(
        assessment: AssessmentDto,
        questionNode: CAssessmentQuestionNode,
        answerModel: AssessmentAnswerDomainModel
    ): Promise<AssessmentQuestionResponseDto> {

        const currentQueryDto = this.questionNodeAsQueryDto(questionNode, assessment);
        const answerDto = AssessmentHelperMapper.toBiometricsAnswerDto(
            assessment.id,
            questionNode,
            answerModel.Biometrics
        );

        await this._assessmentHelperRepo.createQueryResponse(answerDto);
        if (answerDto.ResponseType === QueryResponseType.Biometrics) {
            const biometricsHelper = Loader.container.resolve(AssessmentBiometricsHelper);
            await biometricsHelper.persistBiometrics(assessment.PatientUserId, answerDto);
        }
        return await this.respondToUserAnswer(assessment, questionNode.id, currentQueryDto, answerDto);
    }

    private async handleTextAnswer(
        assessment: AssessmentDto,
        questionNode: CAssessmentQuestionNode,
        answerModel: AssessmentAnswerDomainModel
    ): Promise<AssessmentQuestionResponseDto> {

        const currentQueryDto = this.questionNodeAsQueryDto(questionNode, assessment);
        const answerDto = AssessmentHelperMapper.toTextAnswerDto(
            assessment.id,
            questionNode,
            answerModel.TextValue
        );

        await this._assessmentHelperRepo.createQueryResponse(answerDto);
        return await this.respondToUserAnswer(assessment, questionNode.id, currentQueryDto, answerDto);
    }

    private async handleAcknowledgement(
        assessment: AssessmentDto,
        messageNode: CAssessmentMessageNode
    ): Promise<AssessmentQuestionResponseDto> {

        const currentQueryDto = this.questionNodeAsQueryDto(messageNode, assessment);

        const answerDto = AssessmentHelperMapper.toMessageAnswerDto(
            assessment.id,
            messageNode,
        );

        await this._assessmentHelperRepo.createQueryResponse(answerDto);
        return await this.respondToUserAnswer(assessment, messageNode.id, currentQueryDto, answerDto);
    }

    private async handleDateAnswer(
        assessment: AssessmentDto,
        questionNode: CAssessmentQuestionNode,
        answerModel: AssessmentAnswerDomainModel): Promise<AssessmentQuestionResponseDto> {

        const currentQueryDto = this.questionNodeAsQueryDto(questionNode, assessment);
        const answerDto = AssessmentHelperMapper.toDateAnswerDto(
            assessment.id,
            questionNode,
            answerModel.DateValue
        );

        await this._assessmentHelperRepo.createQueryResponse(answerDto);
        return await this.respondToUserAnswer(assessment, questionNode.id, currentQueryDto, answerDto);
    }

    private async handleIntegerAnswer(
        assessment: AssessmentDto,
        questionNode: CAssessmentQuestionNode,
        answerModel: AssessmentAnswerDomainModel): Promise<AssessmentQuestionResponseDto> {

        const currentQueryDto = this.questionNodeAsQueryDto(questionNode, assessment);
        const answerDto = AssessmentHelperMapper.toIntegerAnswerDto(
            assessment.id,
            questionNode,
            answerModel.FieldName,
            answerModel.IntegerValue
        );

        await this._assessmentHelperRepo.createQueryResponse(answerDto);
        return await this.respondToUserAnswer(assessment, questionNode.id, currentQueryDto, answerDto);
    }

    private async handleBooleanAnswer(
        assessment: AssessmentDto,
        questionNode: CAssessmentQuestionNode,
        answerModel: AssessmentAnswerDomainModel): Promise<AssessmentQuestionResponseDto> {

        const currentQueryDto = this.questionNodeAsQueryDto(questionNode, assessment);
        const answerDto = AssessmentHelperMapper.toBooleanAnswerDto(
            assessment.id,
            questionNode,
            answerModel.FieldName,
            answerModel.BooleanValue
        );

        await this._assessmentHelperRepo.createQueryResponse(answerDto);
        return await this.respondToUserAnswer(assessment, questionNode.id, currentQueryDto, answerDto);
    }

    private async handleFloatAnswer(
        assessment: AssessmentDto,
        questionNode: CAssessmentQuestionNode,
        answerModel: AssessmentAnswerDomainModel): Promise<AssessmentQuestionResponseDto> {

        const currentQueryDto = this.questionNodeAsQueryDto(questionNode, assessment);
        const answerDto = AssessmentHelperMapper.toFloatAnswerDto(
            assessment.id,
            questionNode,
            answerModel.FieldName,
            answerModel.FloatValue
        );

        await this._assessmentHelperRepo.createQueryResponse(answerDto);
        return await this.respondToUserAnswer(assessment, questionNode.id, currentQueryDto, answerDto);
    }

    private async handleFileAnswer(
        assessment: AssessmentDto,
        questionNode: CAssessmentQuestionNode,
        answerModel: AssessmentAnswerDomainModel): Promise<AssessmentQuestionResponseDto> {

        const currentQueryDto = this.questionNodeAsQueryDto(questionNode, assessment);
        const answerDto = AssessmentHelperMapper.toFileAnswerDto(
            assessment.id,
            questionNode,
            answerModel.FieldName,
            answerModel.Url,
            answerModel.ResourceId
        );

        await this._assessmentHelperRepo.createQueryResponse(answerDto);
        return await this.respondToUserAnswer(assessment, questionNode.id, currentQueryDto, answerDto);
    }

    private async respondToUserAnswer(
        assessment: AssessmentDto,
        nextNodeId: string,
        currentQueryDto: AssessmentQueryDto,
        answerDto:
            | SingleChoiceQueryAnswer
            | MultipleChoiceQueryAnswer
            | MessageAnswer
            | TextQueryAnswer
            | DateQueryAnswer
            | IntegerQueryAnswer
            | FloatQueryAnswer
            | FileQueryAnswer
            | BiometricQueryAnswer
    ) {
        const next = await this.traverse(assessment, nextNodeId);
        if (next === null) {
            const endResponse: AssessmentQuestionResponseDto = {
                AssessmentId : assessment.id,
                Parent       : currentQueryDto,
                Answer       : answerDto,
                Next         : null
            };
            return endResponse;
        }
        const response: AssessmentQuestionResponseDto = {
            AssessmentId : assessment.id,
            Parent       : currentQueryDto,
            Answer       : answerDto,
            Next         : next,
        };
        return response;
    }

    private async getChoiceSelectionParams(questionNode: CAssessmentNode) {
        const nodeId = questionNode.id;
        const nodeType = questionNode.NodeType as AssessmentNodeType;
        const paths: CAssessmentNodePath[] = await this._assessmentHelperRepo.getQuestionNodePaths(nodeType, nodeId);
        const options: CAssessmentQueryOption[] = await this._assessmentHelperRepo.getQuestionNodeOptions(
            nodeType,
            nodeId
        );
        if (options.length === 0) {
            throw new Error(`Invalid options found for the question!`);
        }
        const sequenceArray = Array.from(options, (o) => o.Sequence);
        const maxSequenceValue = Math.max(...sequenceArray);
        const minSequenceValue = Math.min(...sequenceArray);
        return { minSequenceValue, maxSequenceValue, options, paths, nodeId };
    }

    private questionNodeAsQueryDto(node: CAssessmentNode, assessment: AssessmentDto) {
        const questionNode = node as CAssessmentQuestionNode;
        const query: AssessmentQueryDto = {
            id                   : questionNode.id,
            DisplayCode          : questionNode.DisplayCode,
            PatientUserId        : assessment.PatientUserId,
            AssessmentTemplateId : assessment.AssessmentTemplateId,
            ParentNodeId         : questionNode.ParentNodeId,
            AssessmentId         : assessment.id,
            Sequence             : questionNode.Sequence,
            NodeType             : questionNode.NodeType as AssessmentNodeType,
            Title                : questionNode.Title,
            Description          : questionNode.Description,
            ExpectedResponseType : questionNode.QueryResponseType as QueryResponseType,
            RawData              : questionNode.RawData,
            Options              : questionNode.Options,
            ProviderGivenCode    : questionNode.ProviderGivenCode,
            CorrectAnswer        : questionNode.CorrectAnswer ? JSON.parse(questionNode.CorrectAnswer) : null,
        };
        return query;
    }

    private messageNodeAsQueryDto(node: CAssessmentNode, assessment: AssessmentDto) {
        const messageNode = node as CAssessmentMessageNode;
        const query: AssessmentQueryDto = {
            id                   : messageNode.id,
            DisplayCode          : messageNode.DisplayCode,
            PatientUserId        : assessment.PatientUserId,
            AssessmentTemplateId : assessment.AssessmentTemplateId,
            ParentNodeId         : messageNode.ParentNodeId,
            AssessmentId         : assessment.id,
            Sequence             : messageNode.Sequence,
            NodeType             : messageNode.NodeType as AssessmentNodeType,
            Title                : messageNode.Message,
            Description          : messageNode.Description,
            Message              : messageNode.Message,
            ExpectedResponseType : QueryResponseType.Ok,
            Options              : [],
            ProviderGivenCode    : messageNode.ProviderGivenCode,
        };
        return query;
    }

    private listNodeAsQueryListDto(
        node: CAssessmentNode,
        assessment: AssessmentDto,
        childrenQueryDtos: AssessmentQueryDto[]) {

        const listNode = node as CAssessmentListNode;

        const query: AssessmentQueryListDto = {
            id                          : listNode.id,
            DisplayCode                 : listNode.DisplayCode,
            PatientUserId               : assessment.PatientUserId,
            AssessmentTemplateId        : assessment.AssessmentTemplateId,
            ParentNodeId                : listNode.ParentNodeId,
            AssessmentId                : assessment.id,
            Sequence                    : listNode.Sequence,
            NodeType                    : listNode.NodeType as AssessmentNodeType,
            Title                       : listNode.Title,
            Description                 : listNode.Description,
            ProviderGivenCode           : listNode.ProviderGivenCode,
            ServeListNodeChildrenAtOnce : listNode.ServeListNodeChildrenAtOnce,
            ChildrenQuestions           : childrenQueryDtos
        };
        return query;
    }

    private handleAnswersToQuestion = async (
        answerModel: AssessmentAnswerDomainModel,
        assessment: AssessmentDto,
        node: CAssessmentNode,
        incomingResponseType: QueryResponseType) : Promise<AssessmentQuestionResponseDto>=> {

        const questionNode = node as CAssessmentQuestionNode;
        const expectedResponseType = questionNode.QueryResponseType;

        if (incomingResponseType !== expectedResponseType) {
            throw new Error(`Provided response type is different than expected response type.`);
        }

        if (incomingResponseType === QueryResponseType.SingleChoiceSelection) {
            return await this.handleSingleChoiceSelectionAnswer(assessment, questionNode, answerModel);
        }
        if (incomingResponseType === QueryResponseType.MultiChoiceSelection) {
            return await this.handleMultipleChoiceSelectionAnswer(assessment, questionNode, answerModel);
        }
        if (incomingResponseType === QueryResponseType.Biometrics) {
            return await this.handleBiometricsAnswer(assessment, questionNode, answerModel);
        }
        if (incomingResponseType === QueryResponseType.Text) {
            return await this.handleTextAnswer(assessment, questionNode, answerModel);
        }
        if (incomingResponseType === QueryResponseType.Date) {
            return await this.handleDateAnswer(assessment, questionNode, answerModel);
        }
        if (incomingResponseType === QueryResponseType.Integer) {
            return await this.handleIntegerAnswer(assessment, questionNode, answerModel);
        }
        if (incomingResponseType === QueryResponseType.Boolean) {
            return await this.handleBooleanAnswer(assessment, questionNode, answerModel);
        }
        if (incomingResponseType === QueryResponseType.Float) {
            return await this.handleFloatAnswer(assessment, questionNode, answerModel);
        }
        if (incomingResponseType === QueryResponseType.File) {
            return await this.handleFileAnswer(assessment, questionNode, answerModel);
        }
        return null;
    };

    public addEHRRecord = async (answerResponse: any, assessment?: any, options?: any, appName?: string ) => {

        Logger.instance().log(`AnswerResponse: ${JSON.stringify(answerResponse)}`);
        Logger.instance().log(`Assessment: ${JSON.stringify(assessment, null, 2)}`);

        var assessmentRecord = {
            AppName        : appName,
            PatientUserId  : assessment.PatientUserId,
            AssessmentId   : assessment.id,
            TemplateId     : assessment.AssessmentTemplateId,
            NodeId         : answerResponse ? answerResponse.Answer.NodeId                                           : null,
            Title          : assessment.Title,
            Question       : answerResponse ? answerResponse.Answer.Title                                            : null,
            SubQuestion    : answerResponse && answerResponse.Answer.SubQuestion ? answerResponse.Answer.SubQuestion : null,
            QuestionType   : answerResponse ? answerResponse.Answer.ResponseType                                     : null,
            AnswerOptions  : options ? JSON.stringify(options.Options)                                               : null,
            AnswerValue    : null,
            AnswerReceived : null,
            AnsweredOn     : assessment.CreatedAt,
            Status         : assessment.Status ?? null,
            Score          : assessment.Score ?? null,
            AdditionalInfo : null,
            StartedAt      : assessment.StartedAt ?? null,
            FinishedAt     : assessment.FinishedAt ?? null,
            RecordDate     : assessment.CreatedAt ? new Date(assessment.CreatedAt) : null
        };

        Logger.instance().log(`AssessmentRecord: ${JSON.stringify(assessmentRecord, null, 2)}`);

        if (answerResponse && answerResponse.Answer.ResponseType === 'Single Choice Selection') {
            assessmentRecord['AnswerValue'] = answerResponse.Answer.ChosenOption.Sequence;
            assessmentRecord['AnswerReceived'] = answerResponse.Answer.ChosenOption.Text;
            EHRAnalyticsHandler.addAssessmentRecord(assessmentRecord);
        } else if (answerResponse && answerResponse.Answer.ResponseType === 'Multi Choice Selection') {
            var responses = answerResponse.Answer.ChosenOptions;
            for await (var r of responses) {
                assessmentRecord['AnswerValue'] = r.Sequence;
                assessmentRecord['AnswerReceived'] = r.Text;
                var a = JSON.parse(JSON.stringify(assessmentRecord));
                EHRAnalyticsHandler.addAssessmentRecord(a);
            }
        } else {
            EHRAnalyticsHandler.addAssessmentRecord(assessmentRecord);

        }
        
    };


    //#endregion

}
