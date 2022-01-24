import {
    BiometricQueryAnswer,
    FloatQueryAnswer,
    IntegerQueryAnswer,
    MessageAnswer,
    MultipleChoiceQueryAnswer,
    TextQueryAnswer,
} from '../../../domain.types/clinical/assessment/assessment.answer.dto';
import { SingleChoiceQueryAnswer } from '../../../domain.types/clinical/assessment/assessment.answer.dto';
import { inject, injectable } from 'tsyringe';
import { ApiError } from '../../../common/api.error';
import { IAssessmentHelperRepo } from '../../../database/repository.interfaces/clinical/assessment/assessment.helper.repo.interface';
import { IAssessmentRepo } from '../../../database/repository.interfaces/clinical/assessment/assessment.repo.interface';
import { IAssessmentTemplateRepo } from '../../../database/repository.interfaces/clinical/assessment/assessment.template.repo.interface';
import { AssessmentHelperMapper } from '../../../database/sql/sequelize/mappers/clinical/assessment/assessment.helper.mapper';
import { AssessmentAnswerDomainModel } from '../../../domain.types/clinical/assessment/assessment.answer.domain.model';
import { AssessmentDomainModel } from '../../../domain.types/clinical/assessment/assessment.domain.model';
import { AssessmentDto } from '../../../domain.types/clinical/assessment/assessment.dto';
import { AssessmentQueryDto } from '../../../domain.types/clinical/assessment/assessment.query.dto';
import { AssessmentQuestionResponseDto } from '../../../domain.types/clinical/assessment/assessment.question.response.dto';
import {
    AssessmentSearchFilters,
    AssessmentSearchResults,
} from '../../../domain.types/clinical/assessment/assessment.search.types';
import {
    AssessmentNodeType,
    QueryResponseType,
    SAssessmentMessageNode,
    SAssessmentNode,
    SAssessmentNodePath,
    SAssessmentQueryOption,
    SAssessmentQuestionNode,
} from '../../../domain.types/clinical/assessment/assessment.types';
import { ProgressStatus, uuid } from '../../../domain.types/miscellaneous/system.types';
import { ConditionProcessor } from './condition.processor';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class AssessmentService {
    
    constructor(
        @inject('IAssessmentRepo') private _assessmentRepo: IAssessmentRepo,
        @inject('IAssessmentTemplateRepo') private _assessmentTemplateRepo: IAssessmentTemplateRepo,
        @inject('IAssessmentHelperRepo') private _assessmentHelperRepo: IAssessmentHelperRepo
    ) {}

    create = async (assessmentDomainModel: AssessmentDomainModel): Promise<AssessmentDto> => {
        return await this._assessmentRepo.create(assessmentDomainModel);
    };

    getById = async (id: string): Promise<AssessmentDto> => {
        return await this._assessmentRepo.getById(id);
    };

    search = async (filters: AssessmentSearchFilters): Promise<AssessmentSearchResults> => {
        return await this._assessmentRepo.search(filters);
    };

    update = async (id: string, assessmentDomainModel: AssessmentDomainModel): Promise<AssessmentDto> => {
        return await this._assessmentRepo.update(id, assessmentDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._assessmentRepo.delete(id);
    };

    startAssessment = async (id: uuid): Promise<AssessmentQueryDto> => {
        var assessment = await this._assessmentRepo.getById(id);
        if (assessment.Status === ProgressStatus.InProgress && assessment.StartedAt !== null) {
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

        var nextQuestion: AssessmentQueryDto = await this.traverse(assessment, rootNodeId);

        return nextQuestion;
    };

    answerQuestion = async (answerModel: AssessmentAnswerDomainModel): Promise<AssessmentQuestionResponseDto> => {
        const questionNodeId = answerModel.QuestionNodeId;
        const assessmentId = answerModel.AssessmentId;

        //Check if the this question node is from same template as assessment
        const questionNode = (await this._assessmentHelperRepo.getNodeById(questionNodeId)) as SAssessmentQuestionNode;
        if (!questionNode) {
            throw new ApiError(404, `Question with id ${questionNodeId} cannot be found!`);
        }
        const assessment = await this._assessmentRepo.getById(assessmentId);
        if (!assessment) {
            throw new ApiError(404, `Assessment with id ${assessmentId} cannot be found!`);
        }
        if (questionNode.TemplateId !== assessment.AssessmentTemplateId) {
            throw new ApiError(400, `Template associated with assessment dows not match with the question!`);
        }

        var isAnswered = await this.isAnswered(assessmentId, questionNodeId);
        if (!isAnswered) {
            throw new ApiError(400, `The question has already been answered!`);
        }

        const responseType = answerModel.ResponseType;

        //Convert the answer to the format which we can persist
        if (responseType === QueryResponseType.SingleChoiceSelection) {
            return await this.handleSingleChoiceSelectionAnswer(assessment, questionNode, answerModel);
        }
        if (responseType === QueryResponseType.MultiChoiceSelection) {
            return await this.handleMultipleChoiceSelectionAnswer(assessment, questionNode, answerModel);
        }
        return null;
    };

    getQuestionById = async (assessmentId: uuid, questionId: uuid): Promise<AssessmentQueryDto | string> => {
        const questionNode = await this._assessmentHelperRepo.getNodeById(questionId);
        if (
            questionNode.NodeType !== AssessmentNodeType.Question &&
            questionNode.NodeType !== AssessmentNodeType.Message
        ) {
            return `The node with id ${questionId} is not a question!`;
        }
        const assessment = await this._assessmentRepo.getById(assessmentId);
        if (questionNode.NodeType !== AssessmentNodeType.Question) {
            return this.questionNodeAsQueryDto(questionNode, assessment);
        } else {
            return this.messageNodeAsQueryDto(questionNode, assessment);
        }
    };

    getNextQuestion = async (assessmentId: uuid): Promise<AssessmentQueryDto> => {
        const assessment = await this._assessmentRepo.getById(assessmentId);
        const currentNodeId = assessment.CurrentNodeId;
        return this.traverse(assessment, currentNodeId);
    };

    getAssessmentStatus = async (assessmentId: uuid): Promise<ProgressStatus> => {
        const assessment = await this._assessmentRepo.getById(assessmentId);
        return assessment.Status as ProgressStatus;
    };

    private async traverseUpstream(currentNode: SAssessmentNode): Promise<SAssessmentNode> {
        const parentNode = await this._assessmentHelperRepo.getNodeById(currentNode.ParentNodeId);
        if (parentNode === null) {
            //We have reached the root node of the assessment
            return null; //Check for this null which means the assessment is over...
        }
        var siblingNodes = await this._assessmentHelperRepo.getNodeListChildren(currentNode.ParentNodeId);
        if (siblingNodes.length === 0) {
            //The parent node is either a question node or message node
            //In this case, check the siblings of its parent.
            return this.traverseUpstream(parentNode);
        }
        const currentSequence = currentNode.Sequence;
        for await (var sibling of siblingNodes) {
            if (sibling.Sequence === currentSequence + 1) {
                return sibling;
            }
        }
        //Since we no longer can find the next sibling, retract tracing by one step, move onto the parent
        return this.traverseUpstream(parentNode);
    }

    //To be used while starting assessment

    private async traverse(assessment: AssessmentDto, currentNodeId: uuid): Promise<AssessmentQueryDto> {
        const currentNode = await this._assessmentHelperRepo.getNodeById(currentNodeId);
        if (!currentNode) {
            throw new Error(`Error while executing assessment. Cannot find the node!`);
        }

        if (currentNode.NodeType === AssessmentNodeType.NodeList) {
            var childrenNodes = await this._assessmentHelperRepo.getNodeListChildren(currentNodeId);
            for await (var childNode of childrenNodes) {
                if ((childNode.NodeType as AssessmentNodeType) === AssessmentNodeType.NodeList) {
                    const nextNode = await this.traverse(assessment, childNode.id);
                    if (nextNode != null) {
                        return nextNode;
                    } else {
                        continue;
                    }
                } else {
                    return await this.traverse(assessment, childNode.id);
                }
            }
        } else if (currentNode.NodeType === AssessmentNodeType.Question) {
            var isAnswered = await this.isAnswered(assessment.id, currentNodeId);
            if (!isAnswered) {
                return await this.returnAsCurrentQuestionNode(assessment, currentNode as SAssessmentQuestionNode);
            } else {
                const nextSiblingNode = await this.traverseUpstream(currentNode);
                return await this.traverse(assessment, nextSiblingNode.id);
            }
        } else if (currentNode.NodeType === AssessmentNodeType.Message) {
            var isAnswered = await this.isAnswered(assessment.id, currentNodeId);
            if (!isAnswered) {
                return await this.returnAsCurrentMessageNode(assessment, currentNode as SAssessmentMessageNode);
            } else {
                const nextSiblingNode = await this.traverseUpstream(currentNode);
                return await this.traverse(assessment, nextSiblingNode.id);
            }
        }

        return null;
    }

    private async returnAsCurrentMessageNode(
        assessment: AssessmentDto,
        currentNode: SAssessmentMessageNode
    ): Promise<AssessmentQueryDto> {
        //Set as current node if not already
        await this._assessmentRepo.setCurrentNode(assessment.id, currentNode.id);
        return this.messageNodeAsQueryDto(currentNode, assessment);
    }

    private async returnAsCurrentQuestionNode(
        assessment: AssessmentDto,
        currentNode: SAssessmentQuestionNode
    ): Promise<AssessmentQueryDto> {
        //Set as current node if not already
        await this._assessmentRepo.setCurrentNode(assessment.id, currentNode.id);
        return this.questionNodeAsQueryDto(currentNode, assessment);
    }

    private async isAnswered(assessmentId: uuid, currentNodeId: uuid) {
        const response = await this._assessmentHelperRepo.getQueryResponse(assessmentId, currentNodeId);
        return response !== null;
    }

    private async handleSingleChoiceSelectionAnswer(
        assessment: AssessmentDto,
        questionNode: SAssessmentQuestionNode,
        answerModel: AssessmentAnswerDomainModel
    ): Promise<AssessmentQuestionResponseDto> {
        const { minSequenceValue, maxSequenceValue, options, paths, nodeId } = await this.getChoiceSelectionParams(
            questionNode
        );

        const currentQueryDto = this.questionNodeAsQueryDto(questionNode, assessment);

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
            assessment.id,
            questionNode,
            chosenOptionSequence,
            answer
        );

        //Persist the answer
        await this._assessmentHelperRepo.createQueryResponse(answerDto);
        // if (answerDto.ResponseType === QueryResponseType.Biometrics) {
        //     await this.persistBiometrics(answerDto);
        // }

        if (paths.length === 0) {
            //In case there are no paths...
            //This question node is a leaf node and should use traverseUp to find the next stop...
            return await this.respondToUserAnswer(assessment, nodeId, currentQueryDto, answerDto);
        } else {
            var chosenPath: SAssessmentNodePath = null;
            for await (var path of paths) {
                const pathId = path.id;
                const conditionId = path.ConditionId;
                const condition = await this._assessmentHelperRepo.getPathCondition(conditionId, nodeId, pathId);
                if (!condition) {
                    continue;
                }
                const resolved = await ConditionProcessor.processCondition(condition, chosenOptionSequence);
                if (resolved === true) {
                    chosenPath = path;
                    break;
                }
            }
            if (chosenPath !== null) {
                return await this.respondToUserAnswer(assessment, chosenPath.NextNodeId, currentQueryDto, answerDto);
            } else {
                return await this.respondToUserAnswer(assessment, nodeId, currentQueryDto, answerDto);
            }
        }
    }

    private async handleMultipleChoiceSelectionAnswer(
        assessment: AssessmentDto,
        questionNode: SAssessmentQuestionNode,
        answerModel: AssessmentAnswerDomainModel
    ): Promise<AssessmentQuestionResponseDto> {
        const { minSequenceValue, maxSequenceValue, options, paths, nodeId } = await this.getChoiceSelectionParams(
            questionNode
        );

        const currentQueryDto = this.questionNodeAsQueryDto(questionNode, assessment);

        const chosenOptionSequences = answerModel.IntegerArray;
        const selectedOptions: SAssessmentQueryOption[] = [];
        for (var choice of chosenOptionSequences) {
            if (!choice || choice < minSequenceValue || choice > maxSequenceValue) {
                throw new Error(`Invalid option index! Cannot process the condition!`);
            }
            const answer = options.find((x) => x.Sequence === choice);
            selectedOptions.push(answer);
        }

        const answerDto = AssessmentHelperMapper.toMultiChoiceAnswerDto(
            assessment.id,
            questionNode,
            chosenOptionSequences,
            selectedOptions
        );

        //Persist the answer
        await this._assessmentHelperRepo.createQueryResponse(answerDto);
        // if (answerDto.ResponseType === QueryResponseType.Biometrics) {
        //     await this.persistBiometrics(answerDto);
        // }

        if (paths.length === 0) {
            //In case there are no paths...
            //This question node is a leaf node and should use traverseUp to find the next stop...
            return await this.respondToUserAnswer(assessment, nodeId, currentQueryDto, answerDto);
        } else {
            var chosenPath: SAssessmentNodePath = null;
            for await (var path of paths) {
                const pathId = path.id;
                const conditionId = path.ConditionId;
                const condition = await this._assessmentHelperRepo.getPathCondition(conditionId, nodeId, pathId);
                if (!condition) {
                    continue;
                }
                const resolved = await ConditionProcessor.processCondition(condition, chosenOptionSequences);
                if (resolved === true) {
                    chosenPath = path;
                    break;
                }
            }
            if (chosenPath !== null) {
                return await this.respondToUserAnswer(assessment, chosenPath.NextNodeId, currentQueryDto, answerDto);
            } else {
                return await this.respondToUserAnswer(assessment, nodeId, currentQueryDto, answerDto);
            }
        }
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
            | IntegerQueryAnswer
            | FloatQueryAnswer
            | BiometricQueryAnswer
    ) {
        const next = await this.traverse(assessment, nextNodeId);
        const response: AssessmentQuestionResponseDto = {
            AssessmentId : assessment.id,
            Parent       : currentQueryDto,
            Answer       : answerDto,
            Next         : next,
        };
        return response;
    }

    private async getChoiceSelectionParams(questionNode: SAssessmentNode) {
        const nodeId = questionNode.id;
        const nodeType = questionNode.NodeType as AssessmentNodeType;
        const paths: SAssessmentNodePath[] = await this._assessmentHelperRepo.getQuestionNodePaths(nodeType, nodeId);
        const options: SAssessmentQueryOption[] = await this._assessmentHelperRepo.getQuestionNodeOptions(
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

    private questionNodeAsQueryDto(node: SAssessmentNode, assessment: AssessmentDto) {
        const questionNode = node as SAssessmentQuestionNode;
        const query: AssessmentQueryDto = {
            NodeId               : questionNode.id,
            DisplayCode          : questionNode.DisplayCode,
            PatientUserId        : assessment.PatientUserId,
            AssessmentTemplateId : assessment.AssessmentTemplateId,
            ParentNodeId         : questionNode.ParentNodeId,
            AssessmentId         : assessment.id,
            Sequence             : questionNode.Sequence,
            NodeType             : questionNode.NodeType as AssessmentNodeType,
            Title                : questionNode.Title,
            Description          : questionNode.Description,
            QueryResponseType    : questionNode.QueryResponseType as QueryResponseType,
            Options              : questionNode.Options,
            ProviderGivenCode    : questionNode.ProviderGivenCode,
        };
        return query;
    }

    private messageNodeAsQueryDto(node: SAssessmentNode, assessment: AssessmentDto) {
        const messageNode = node as SAssessmentMessageNode;
        const query: AssessmentQueryDto = {
            NodeId               : messageNode.id,
            DisplayCode          : messageNode.DisplayCode,
            PatientUserId        : assessment.PatientUserId,
            AssessmentTemplateId : assessment.AssessmentTemplateId,
            ParentNodeId         : messageNode.ParentNodeId,
            AssessmentId         : assessment.id,
            Sequence             : messageNode.Sequence,
            NodeType             : messageNode.NodeType as AssessmentNodeType,
            Title                : messageNode.Title,
            Description          : messageNode.Description,
            QueryResponseType    : QueryResponseType.Ok,
            Options              : [],
            ProviderGivenCode    : messageNode.ProviderGivenCode,
        };
        return query;
    }

    // private persistBiometrics(answer: BiometricQueryAnswer) {
    //     throw new Error("Method not implemented.");
    // }

}
