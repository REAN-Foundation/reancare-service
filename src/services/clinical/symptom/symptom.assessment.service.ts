import { inject, injectable } from "tsyringe";
import { ISymptomAssessmentRepo } from "../../../database/repository.interfaces/clinical/symptom/symptom.assessment.repo.interface";
import { SymptomAssessmentDomainModel } from '../../../domain.types/clinical/symptom/symptom.assessment/symptom.assessment.domain.model';
import { SymptomAssessmentDto } from '../../../domain.types/clinical/symptom/symptom.assessment/symptom.assessment.dto';
import { SymptomAssessmentSearchFilters, SymptomAssessmentSearchResults } from '../../../domain.types/clinical/symptom/symptom.assessment/symptom.assessment.search.types';
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { BaseResourceService } from "../../../services/base.resource.service";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class SymptomAssessmentService  extends BaseResourceService {

    constructor(
        @inject('ISymptomAssessmentRepo') private _symptomAssessmentRepo: ISymptomAssessmentRepo,
    ) {
        super();
    }

    create = async (domainModel: SymptomAssessmentDomainModel): Promise<SymptomAssessmentDto> => {
        return await this._symptomAssessmentRepo.create(domainModel);
    };

    getById = async (id: uuid): Promise<SymptomAssessmentDto> => {
        return await this._symptomAssessmentRepo.getById(id);
    };

    search = async (filters: SymptomAssessmentSearchFilters): Promise<SymptomAssessmentSearchResults> => {
        return await this._symptomAssessmentRepo.search(filters);
    };

    update = async (id: uuid, domainModel: SymptomAssessmentDomainModel): Promise<SymptomAssessmentDto> => {
        return await this._symptomAssessmentRepo.update(id, domainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._symptomAssessmentRepo.delete(id);
    };

}
