import { inject, injectable } from "tsyringe";
import { IAssessmentRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.repo.interface";
import { AssessmentDomainModel } from '../../../domain.types/clinical/assessment/assessment.domain.model';
import { AssessmentDto } from '../../../domain.types/clinical/assessment/assessment.dto';
import { AssessmentSearchFilters, AssessmentSearchResults } from "../../../domain.types/clinical/assessment/assessment.search.types";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class AssessmentService {

    constructor(
        @inject('IAssessmentRepo') private _assessmentRepo: IAssessmentRepo,
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

    answerQuestion(questionId: string, answerModel: void): any {
        throw new Error('Method not implemented.');
    }
    
    getQuestionById(id: string, questionId: string) {
        throw new Error('Method not implemented.');
    }

    getNextQuestion(id: string) {
        throw new Error('Method not implemented.');
    }

    getAssessmentStatus(id: string): import("../../../domain.types/miscellaneous/system.types").ProgressStatus | PromiseLike<import("../../../domain.types/miscellaneous/system.types").ProgressStatus> {
        throw new Error('Method not implemented.');
    }

    startAssessment(id: string) {
        throw new Error('Method not implemented.');
    }

}
