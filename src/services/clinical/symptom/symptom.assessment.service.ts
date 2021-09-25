import { inject, injectable } from "tsyringe";
import { ISymptomAssessmentRepo } from "../../../database/repository.interfaces/clinical/symptom/symptom.assessment.repo.interface";
import { SymptomAssessmentDomainModel } from '../../../domain.types/clinical/symptom/symptom.assessment/symptom.assessment.domain.model';
import { SymptomAssessmentDto } from '../../../domain.types/clinical/symptom/symptom.assessment/symptom.assessment.dto';
import { SymptomAssessmentSearchResults, SymptomAssessmentSearchFilters } from '../../../domain.types/clinical/symptom/symptom.assessment/symptom.assessment.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class SymptomAssessmentService {

    constructor(
        @inject('ISymptomAssessmentRepo') private _symptomAssessmentRepo: ISymptomAssessmentRepo,
    ) {}

    create = async (domainModel: SymptomAssessmentDomainModel): Promise<SymptomAssessmentDto> => {
        return await this._symptomAssessmentRepo.create(domainModel);
    };

    getById = async (id: string): Promise<SymptomAssessmentDto> => {
        return await this._symptomAssessmentRepo.getById(id);
    };

    search = async (filters: SymptomAssessmentSearchFilters): Promise<SymptomAssessmentSearchResults> => {
        return await this._symptomAssessmentRepo.search(filters);
    };

    update = async (id: string, domainModel: SymptomAssessmentDomainModel): Promise<SymptomAssessmentDto> => {
        return await this._symptomAssessmentRepo.update(id, domainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._symptomAssessmentRepo.delete(id);
    };

}
