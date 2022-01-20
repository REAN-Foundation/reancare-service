import { AssessmentAnswerDomainModel } from "../../../domain.types/clinical/assessment/assessment.answer.domain.model";
import { AssessmentQuestionResponseDto } from "../../../domain.types/clinical/assessment/assessment.question.response.dto";
import { inject, injectable } from "tsyringe";
import { IAssessmentRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.repo.interface";
import { AssessmentDomainModel } from '../../../domain.types/clinical/assessment/assessment.domain.model';
import { AssessmentDto } from '../../../domain.types/clinical/assessment/assessment.dto';
import { AssessmentSearchFilters, AssessmentSearchResults } from "../../../domain.types/clinical/assessment/assessment.search.types";
import { ProgressStatus, uuid } from "../../../domain.types/miscellaneous/system.types";
import { AssessmentQuestionDto } from "../../../domain.types/clinical/assessment/assessment.question.dto";
import { IAssessmentTemplateRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.template.repo.interface";
import { IAssessmentHelperRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.helper.repo.interface";

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

    startAssessment = async (id: uuid): Promise<AssessmentQuestionDto> => {

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

        var nextQuestion : AssessmentQuestionDto = null;

        const template = await this._assessmentTemplateRepo.getById(assessment.AssessmentTemplateId);
        if (!template) {
            throw new Error(`Error while starting assessment. Cannot find template.`);
        }

        const rootNodeId = template.RootNodeId;
        if (!rootNodeId) {
            throw new Error(`Error while starting assessment. Cannot find template root node.`);
        }
        const rootNode = await this._assessmentHelperRepo.getNodeById(rootNodeId);
        if (!rootNode) {
            throw new Error(`Error while starting assessment. Cannot find template root node.`);
        }

        return nextQuestion;
    }

    answerQuestion = async (
        questionId: uuid,
        answerModel: AssessmentAnswerDomainModel): Promise<AssessmentQuestionResponseDto> => {
        throw new Error('Method not implemented.');
    }
    
    getQuestionById = async (id: uuid, questionId: uuid): Promise<AssessmentQuestionDto> => {
        throw new Error('Method not implemented.');
    }

    getNextQuestion = async (id: uuid): Promise<AssessmentQuestionDto> => {
        throw new Error('Method not implemented.');
    }

    getAssessmentStatus = async (id: uuid): Promise<ProgressStatus> => {
        throw new Error('Method not implemented.');
    }

}
