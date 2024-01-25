import { inject, injectable } from "tsyringe";
import { IDailyAssessmentRepo } from "../../../database/repository.interfaces/clinical/daily.assessment/daily.assessment.repo.interface";
import { DailyAssessmentDomainModel } from '../../../domain.types/clinical/daily.assessment/daily.assessment.domain.model';
import { DailyAssessmentDto } from '../../../domain.types/clinical/daily.assessment/daily.assessment.dto';
import { DailyAssessmentSearchFilters, DailyAssessmentSearchResults } from '../../../domain.types/clinical/daily.assessment/daily.assessment.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class DailyAssessmentService {

    constructor(
        @inject('IDailyAssessmentRepo') private _dailyAssessmentRepo: IDailyAssessmentRepo,
    ) {}

    create = async (dailyAssessmentDomainModel: DailyAssessmentDomainModel): Promise<DailyAssessmentDto> => {
        return await this._dailyAssessmentRepo.create(dailyAssessmentDomainModel);
    };

    search = async (filters: DailyAssessmentSearchFilters): Promise<DailyAssessmentSearchResults> => {
        return await this._dailyAssessmentRepo.search(filters);
    };

}
