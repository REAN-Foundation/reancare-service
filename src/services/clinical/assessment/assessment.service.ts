import { AssessmentAnswerDomainModel } from "../../../domain.types/clinical/assessment/assessment.answer.domain.model";
import { AssessmentQuestionResponseDto } from "../../../domain.types/clinical/assessment/assessment.question.response.dto";
import { inject, injectable } from "tsyringe";
import { IAssessmentRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.repo.interface";
import { AssessmentDomainModel } from '../../../domain.types/clinical/assessment/assessment.domain.model';
import { AssessmentDto } from '../../../domain.types/clinical/assessment/assessment.dto';
import { AssessmentSearchFilters, AssessmentSearchResults } from "../../../domain.types/clinical/assessment/assessment.search.types";
import { ProgressStatus, uuid } from "../../../domain.types/miscellaneous/system.types";
import { AssessmentQueryDto } from "../../../domain.types/clinical/assessment/assessment.query.dto";
import { IAssessmentTemplateRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.template.repo.interface";
import { IAssessmentHelperRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.helper.repo.interface";
import { AssessmentNodeType, QueryResponseType, SAssessmentMessageNode, SAssessmentNode, SAssessmentQuestionNode } from "../../../domain.types/clinical/assessment/assessment.types";
import { AssessmentTemplateDto } from "../../../domain.types/clinical/assessment/assessment.template.dto";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class AssessmentService {

    constructor(
        @inject('IAssessmentRepo') private _assessmentRepo: IAssessmentRepo,
        @inject('IAssessmentTemplateRepo') private _assessmentTemplateRepo: IAssessmentTemplateRepo,
        @inject('IAssessmentHelperRepo') private _assessmentHelperRepo: IAssessmentHelperRepo,
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

        var nextQuestion : AssessmentQueryDto =
            await this.traverseDeep(assessment, template, rootNodeId);
        
        return nextQuestion;
    }

    answerQuestion = async (
        questionId: uuid,
        answerModel: AssessmentAnswerDomainModel): Promise<AssessmentQuestionResponseDto> => {
        throw new Error('Method not implemented.');
    }
    
    getQuestionById = async (id: uuid, questionId: uuid): Promise<AssessmentQueryDto> => {
        throw new Error('Method not implemented.');
    }

    getNextQuestion = async (id: uuid): Promise<AssessmentQueryDto> => {
        throw new Error('Method not implemented.');
    }

    getAssessmentStatus = async (id: uuid): Promise<ProgressStatus> => {
        throw new Error('Method not implemented.');
    }

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

    private async traverseDeep(
        assessment: AssessmentDto,
        template: AssessmentTemplateDto,
        currentNodeId: uuid): Promise<AssessmentQueryDto> {

        const currentNode = await this._assessmentHelperRepo.getNodeById(currentNodeId);
        if (!currentNode) {
            throw new Error(`Error while continueing assessment. Cannot find template root node.`);
        }

        if (currentNode.NodeType === AssessmentNodeType.NodeList) {

            var childrenNodes = await this._assessmentHelperRepo.getNodeListChildren(currentNodeId);
            for await (var childNode of childrenNodes) {
                if (childNode.NodeType as AssessmentNodeType === AssessmentNodeType.NodeList) {
                    const nextNode = await this.traverseDeep(assessment, template, childNode.id);
                    if (nextNode != null) {
                        return nextNode;
                    }
                    else {
                        continue;
                    }
                }
                else {
                    return await this.traverseDeep(assessment, template, childNode.id);
                }
            }
        }
        else if (currentNode.NodeType === AssessmentNodeType.Question) {
            var isAnswered = await this.isAnswered(assessment, currentNodeId);
            if (!isAnswered) {
                return await this.returnAsCurrentQuestionNode(assessment, template, currentNode);
            }
            else {
                const nextSiblingNode = await this.traverseUpstream(currentNode);
                return await this.traverseDeep(assessment, template, nextSiblingNode.id);
            }
        }
        else if (currentNode.NodeType === AssessmentNodeType.Message) {
            var isAnswered = await this.isAnswered(assessment, currentNodeId);
            if (!isAnswered) {
                return await this.returnAsCurrentMessageNode(assessment, template, currentNode);
            }
            else {
                const nextSiblingNode = await this.traverseUpstream(currentNode);
                return await this.traverseDeep(assessment, template, nextSiblingNode.id);
            }
        }

        return null;
    }

    private async returnAsCurrentMessageNode(
        assessment: AssessmentDto,
        template: AssessmentTemplateDto,
        currentNode: SAssessmentNode): Promise<AssessmentQueryDto> {

        await this._assessmentRepo.setCurrentNode(assessment.id, currentNode.id);

        const messageNode = currentNode as SAssessmentMessageNode;

        const query: AssessmentQueryDto = {
            NodeId               : messageNode.id,
            DisplayCode          : messageNode.DisplayCode,
            PatientUserId        : assessment.PatientUserId,
            AssessmentTemplateId : template.id,
            ParentNodeId         : currentNode.id,
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

    private async returnAsCurrentQuestionNode(
        assessment: AssessmentDto,
        template: AssessmentTemplateDto,
        currentNode: SAssessmentNode): Promise<AssessmentQueryDto> {

        //Set as current node if not already
        await this._assessmentRepo.setCurrentNode(assessment.id, currentNode.id);

        const questionNode = currentNode as SAssessmentQuestionNode;

        const query: AssessmentQueryDto = {
            NodeId               : questionNode.id,
            DisplayCode          : questionNode.DisplayCode,
            PatientUserId        : assessment.PatientUserId,
            AssessmentTemplateId : template.id,
            ParentNodeId         : currentNode.id,
            AssessmentId         : assessment.id,
            Sequence             : questionNode.Sequence,
            NodeType             : questionNode.NodeType as AssessmentNodeType,
            Title                : questionNode.Title,
            Description          : questionNode.Description,
            QueryResponseType    : questionNode.QueryResponseType as QueryResponseType,
            Options              : questionNode.Options,
            ProviderGivenCode    : questionNode.ProviderGivenCode
        };
        return query;
    }

    private async isAnswered(assessment: AssessmentDto, currentNodeId: string) {
        const response = await this._assessmentRepo.getQueryResponse(assessment.id, currentNodeId);
        return response !== null;
    }

}
