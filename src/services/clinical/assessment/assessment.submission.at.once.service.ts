import { inject, injectable } from "tsyringe";
import { IAssessmentRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.repo.interface";
import { IAssessmentHelperRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.helper.repo.interface";
import { AssessmentDomainModel, AssessmentSubmissionDomainModel } from "../../../domain.types/clinical/assessment/assessment.domain.model";
import { AssessmentNodeType, AssessmentType, CAssessmentMessageNode, CAssessmentQuestionNode, QueryResponseType } from "../../../domain.types/clinical/assessment/assessment.types";
import { ApiError } from "../../../common/api.error";
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { Injector } from "../../../startup/injector";
import { AssessmentService } from "./assessment.service";
import { AssessmentAnswerDomainModel } from "../../../domain.types/clinical/assessment/assessment.answer.domain.model";

@injectable()
export class AssessmentSubmissionAtOnceService {

    _assessmentService = Injector.Container.resolve(AssessmentService);

    constructor(
        @inject('IAssessmentRepo') private _assessmentRepo: IAssessmentRepo,
        @inject('IAssessmentHelperRepo') private _assessmentHelperRepo: IAssessmentHelperRepo,
    ) {}

    public submitAtOnce = async (submission: AssessmentSubmissionDomainModel) => {
        const model: AssessmentDomainModel = {
            PatientUserId          : submission.PatientUserId,
            AssessmentTemplateId   : submission.AssessmentTemplateId,
            Title                  : submission.AssessmentTemplateTitle,
            Type                   : AssessmentType.Careplan,
            ScoringApplicable      : submission.ScoringApplicable,
            ProviderEnrollmentId   : submission.ProviderEnrollmentId,
            ProviderAssessmentCode : submission.ProviderAssessmentCode,
            Provider               : submission.Provider,
            ScheduledDateString    : new Date().toISOString()
                .split('T')[0]
        };
        const assessment = await this._assessmentService.create(model);
        if (!assessment) {
            throw new ApiError(500, 'Failed to create assessment.');
        }

        const nodes = await this._assessmentHelperRepo.getTemplateChildrenNodes(submission.AssessmentTemplateId);

        let questionNodes = nodes.filter(x => x.NodeType !== AssessmentNodeType.NodeList &&
            x.NodeType !== AssessmentNodeType.Message) as CAssessmentQuestionNode[];
        
        const messageNodes = nodes.filter(x => x.NodeType === AssessmentNodeType.Message) as CAssessmentMessageNode[];

        for await (var messageNode of messageNodes) {
            await this.submitResponseForMessageNode(assessment.id, messageNode);
        }

        questionNodes = questionNodes.sort((a, b) => {
            return a.Sequence - b.Sequence;
        });
        
        for await (var node  of questionNodes) {
            let isQuestionSkippable = false;
            this.isSubmittedAnswerValid(node, submission.Answers);
            if (!submission.Answers[this.getSubmissionKey(node.id)] && !node.Required) {
                isQuestionSkippable = true;
            }
            await this.submitResponseForQuestionNode(assessment.id, node, submission.Answers, isQuestionSkippable);
        }

        const completedAssessment = await this._assessmentRepo.completeAssessment(assessment.id);

        if (!completedAssessment) {
            throw new ApiError(500, 'Failed to complete assessment.');
        }

        return completedAssessment;
    };

    private submitResponseForQuestionNode =
    async (
        assessmentId: uuid, node: CAssessmentQuestionNode,
        answers: Record<string, any>,
        isQuestionSkippable: boolean
    ) => {
        if (isQuestionSkippable) {
            await this._assessmentService.skipQuestion(assessmentId, node.id);
            return;
        }
        const isAnswered = await this._assessmentService.isAnswered(assessmentId, node.id);
        if (isAnswered) {
            throw new ApiError(400, `The question ${node?.Title} has already been answered!`);
        }

        let answerModel: AssessmentAnswerDomainModel = {
            QuestionNodeId : node.id,
            ResponseType   : node.QueryResponseType,
            AssessmentId   : assessmentId
        };
        answerModel = await this.getAnswer(answerModel, node, answers);

        const answerResponse = await this._assessmentService.answerQuestion(answerModel);
        return answerResponse;
    };

    private submitResponseForMessageNode =
    async (assessmentId: uuid, node: CAssessmentMessageNode) => {
        const isAnswered = await this._assessmentService.isAnswered(assessmentId, node.id);
        if (isAnswered) {
            throw new ApiError(400, `The question ${node?.Title} has already been answered!`);
        }

        const answerModel: AssessmentAnswerDomainModel = {
            QuestionNodeId : node.id,
            ResponseType   : QueryResponseType.Ok,
            AssessmentId   : assessmentId,
            BooleanValue   : true
        };

        const answerResponse = await this._assessmentService.answerQuestion(answerModel);
        return answerResponse;
    };

    private getAnswer = async (
        answerModel: AssessmentAnswerDomainModel,
        node: CAssessmentQuestionNode,
        answers: Record<string, any>
    ) : Promise<AssessmentAnswerDomainModel> => {

        if (node.QueryResponseType === QueryResponseType.Text) {
            answerModel.TextValue = answers[this.getSubmissionKey(node.id)];
        }
        if (node.QueryResponseType === QueryResponseType.Integer) {
            answerModel.IntegerValue = parseInt(answers[this.getSubmissionKey(node.id)]);
        }
        if (node.QueryResponseType === QueryResponseType.Float) {
            answerModel.FloatValue = parseFloat(answers[this.getSubmissionKey(node.id)]);
        }
        if (node.QueryResponseType === QueryResponseType.Boolean) {
            answerModel.BooleanValue = answers[this.getSubmissionKey(node.id)];
        }
        if (node.QueryResponseType === QueryResponseType.SingleChoiceSelection) {
            const options =
            await this._assessmentHelperRepo.getQuestionNodeOptions(AssessmentNodeType.Question, node.id);
            const chosenOption = options?.find(
                option => option.ProviderGivenCode === answers[this.getSubmissionKey(node.id)]
            );
            if (!chosenOption) {
                throw new ApiError(400, `Answer is required for the question: ${node?.Title}!`);
            }
            answerModel.IntegerValue = chosenOption.Sequence;
        }
        if (node.QueryResponseType === QueryResponseType.MultiChoiceSelection) {
            const chosenOptionSequences = answers[this.getSubmissionKey(node.id)];
            if (chosenOptionSequences?.length === 0) {
                throw new ApiError(400, `Answer is required for the question: ${node?.Title}!`);
            }
            const options =
            await this._assessmentHelperRepo.getQuestionNodeOptions(AssessmentNodeType.Question, node.id);
            const chosenOptions = options?.filter(
                option => answers[this.getSubmissionKey(node.id)].includes(option.ProviderGivenCode)
            );
            if (chosenOptions.length === 0 || chosenOptions?.length !== chosenOptionSequences?.length) {
                throw new ApiError(400, `Answer is required for the question: ${node?.Title}!`);
            }
            answerModel.IntegerArray = chosenOptions.map(option => option.Sequence);
        }

        return answerModel;
    };

    private isSubmittedAnswerValid = (node: CAssessmentQuestionNode, answers: Record<string, any>) => {
        if (!answers[this.getSubmissionKey(node.id)] && node.Required) {
            throw new ApiError(400, `Answer is required for the question: ${node?.Title}!`);
        }
        return true;
    };

    private getSubmissionKey = (id: string) => {
        const key = id.replace(/-/g, "_");
        return `_${key}`;
    };

}
